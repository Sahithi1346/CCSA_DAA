// backtracking.js - Backtracking / Constraint Satisfaction Allocation with State-Space Tree Exploration
/**
 * Backtracking Algorithm Concept in College Counselling:
 * 1. State-Space Representation: Each level 'i' in the recursion tree represents Decision for Candidate i.
 *    Branches from node i represent trying Choice 1, Choice 2, ... Choice K, or skipping (Unallotted).
 * 2. Pruning & Constraint Satisfaction:
 *    - Quota & capacity constraints: cannot allocate if remaining capacity is 0 or category quota exhausted.
 *    - Merit bounds: higher-ranked candidates have priority preference options.
 * 3. Backtracking Step:
 *    If a partial assignment leaves subsequent high-priority candidates without any valid seat (or if looking
 *    for maximum global preference satisfaction / social welfare), the algorithm undos the recent allotment,
 *    restores seat capacity, and explores alternative sibling branches.
 *
 * Time Complexity:
 * - Worst case: O(K^N) where K = choices per candidate, N = candidates
 * - With Pruning: Exponential worst-case pruned significantly to O(B^d)
 * Space Complexity:
 * - O(N) recursion stack depth + O(C * B) seat matrix state
 */

class BacktrackingAllocator {
  static run(candidates, colleges, options = {}) {
    const startTime = performance.now();
    let recursiveCalls = 0;
    let backtrackCount = 0;
    let statesExplored = 0;
    let prunedBranches = 0;
    const traceSteps = [];
    const stateSpaceTree = []; // Tree visualization nodes

    // Sort candidates by rank
    const sortedCandidates = [...candidates].sort((a, b) => a.rank - b.rank);

    // Initial seat matrix state
    const seatMatrix = {};
    colleges.forEach(col => {
      seatMatrix[col.id] = {};
      Object.keys(col.branches).forEach(bCode => {
        const b = col.branches[bCode];
        seatMatrix[col.id][bCode] = {
          total: b.total,
          remaining: b.total,
          quotas: { ...b.quotas },
          allotted: []
        };
      });
    });

    let bestSolution = null;
    let bestScore = -Infinity; // Metric: (+100 for each allotted candidate) - (preference index * 5)

    traceSteps.push({
      type: "BACKTRACK_INIT",
      description: `Backtracking State-Space search initialized for ${sortedCandidates.length} candidates. Root node (Level 0) generated.`
    });

    // Helper to evaluate solution quality
    function calculateScore(currentAllotments) {
      let score = 0;
      Object.values(currentAllotments).forEach(item => {
        if (item.status === "ALLOTTED") {
          score += 100 - (item.choiceNumber - 1) * 10;
        }
      });
      return score;
    }

    // Recursive search function
    function solve(candidateIdx, currentAllotments, treeNodeId, parentNodeId) {
      recursiveCalls++;
      statesExplored++;

      // Base Case: All candidates processed
      if (candidateIdx >= sortedCandidates.length) {
        const score = calculateScore(currentAllotments);
        traceSteps.push({
          type: "LEAF_NODE_REACHED",
          description: `Leaf reached! Completed branch with global satisfaction score: ${score}`,
          score
        });

        if (score > bestScore) {
          bestScore = score;
          // Deep clone current allotments & matrix as best solution
          bestSolution = {
            allotments: JSON.parse(JSON.stringify(currentAllotments)),
            seatMatrix: JSON.parse(JSON.stringify(seatMatrix)),
            score
          };
        }
        return;
      }

      const candidate = sortedCandidates[candidateIdx];
      const currentNode = {
        id: treeNodeId,
        parentId: parentNodeId,
        candidateName: candidate.name,
        rank: candidate.rank,
        level: candidateIdx + 1,
        branchTried: null,
        status: "ACTIVE"
      };
      stateSpaceTree.push(currentNode);

      traceSteps.push({
        type: "RECURSION_STEP",
        nodeId: treeNodeId,
        candidateId: candidate.id,
        candidateName: candidate.name,
        rank: candidate.rank,
        level: candidateIdx + 1,
        description: `[Level ${candidateIdx + 1}] Evaluating choices for Rank #${candidate.rank} ${candidate.name}`
      });

      let allottedAny = false;

      // Try each preference branch in order
      for (let pIdx = 0; pIdx < candidate.preferences.length; pIdx++) {
        const prefStr = candidate.preferences[pIdx];
        const [cId, bCode] = prefStr.split(":");
        const branchSeat = seatMatrix[cId] && seatMatrix[cId][bCode];

        // Constraint check (Pruning condition)
        if (!branchSeat || branchSeat.remaining <= 0) {
          prunedBranches++;
          traceSteps.push({
            type: "BRANCH_PRUNED",
            nodeId: treeNodeId,
            candidateName: candidate.name,
            choice: prefStr,
            reason: "Seat capacity zero - Branch pruned",
            description: `[Prune] ${candidate.name} cannot take ${prefStr} (Capacity 0)`
          });
          continue;
        }

        // Quota check
        let quota = null;
        if (branchSeat.quotas.GEN > 0) {
          quota = "GEN";
        } else if (candidate.category !== "GEN" && branchSeat.quotas[candidate.category] > 0) {
          quota = candidate.category;
        }

        if (!quota) {
          prunedBranches++;
          traceSteps.push({
            type: "BRANCH_PRUNED",
            nodeId: treeNodeId,
            candidateName: candidate.name,
            choice: prefStr,
            reason: `Quota full for ${candidate.category} & GEN`,
            description: `[Prune] ${prefStr} has no eligible quota left for ${candidate.name} (${candidate.category})`
          });
          continue;
        }

        // Forward Step (Make Choice)
        branchSeat.remaining--;
        branchSeat.quotas[quota]--;
        const allocRecord = {
          candidateId: candidate.id,
          candidateName: candidate.name,
          rank: candidate.rank,
          category: candidate.category,
          quotaUsed: quota,
          preferenceNumber: pIdx + 1
        };
        branchSeat.allotted.push(allocRecord);

        currentAllotments[candidate.id] = {
          candidateId: candidate.id,
          candidateName: candidate.name,
          rank: candidate.rank,
          category: candidate.category,
          collegeId: cId,
          branchCode: bCode,
          choiceNumber: pIdx + 1,
          quotaUsed: quota,
          status: "ALLOTTED"
        };
        allottedAny = true;

        const childNodeId = `${treeNodeId}-${pIdx + 1}`;
        traceSteps.push({
          type: "CHOOSE_BRANCH",
          nodeId: childNodeId,
          parentNodeId: treeNodeId,
          candidateName: candidate.name,
          choice: prefStr,
          choiceNumber: pIdx + 1,
          quota,
          description: `[Branch Forward] Temporarily assigning ${prefStr} to ${candidate.name} (Choice #${pIdx + 1}, ${quota}). Recursing to Level ${candidateIdx + 2}...`
        });

        // Recurse to next candidate
        solve(candidateIdx + 1, currentAllotments, childNodeId, treeNodeId);

        // Backtrack Step (Undo Choice)
        backtrackCount++;
        branchSeat.remaining++;
        branchSeat.quotas[quota]++;
        branchSeat.allotted.pop();
        delete currentAllotments[candidate.id];

        traceSteps.push({
          type: "BACKTRACK_STEP",
          nodeId: childNodeId,
          parentNodeId: treeNodeId,
          candidateName: candidate.name,
          choice: prefStr,
          description: `[Backtrack] Undoing assignment ${prefStr} for ${candidate.name}. Restoring seat capacity and exploring alternative branches...`
        });

        // Optimization: In standard merit counselling, candidates strictly prefer Choice 1 over Choice 2.
        // Once a valid branch with the higher preference yields an optimal sub-solution, we limit excessive deep search.
        if (options.quickOptimal && bestScore > 0) {
          break;
        }
      }

      // Branch: What if candidate cannot be allotted or is skipped?
      currentAllotments[candidate.id] = {
        candidateId: candidate.id,
        candidateName: candidate.name,
        rank: candidate.rank,
        category: candidate.category,
        status: "UNALLOTTED",
        choiceNumber: null,
        reason: "No preference could be satisfied without constraint violation"
      };

      const skipNodeId = `${treeNodeId}-skip`;
      traceSteps.push({
        type: "EXPLORE_SKIP_BRANCH",
        nodeId: skipNodeId,
        parentNodeId: treeNodeId,
        candidateName: candidate.name,
        description: `[Skip Branch] Exploring outcome where ${candidate.name} remains unallotted.`
      });

      solve(candidateIdx + 1, currentAllotments, skipNodeId, treeNodeId);

      // Backtrack skip choice
      delete currentAllotments[candidate.id];
      backtrackCount++;
    }

    // Start recursive backtracking from Level 0 (root)
    solve(0, {}, "root", null);

    const endTime = performance.now();
    const durationMs = +(endTime - startTime).toFixed(3);

    // If no solution found (rare), fallback
    if (!bestSolution) {
      bestSolution = { allotments: {}, seatMatrix, score: 0 };
    }

    let allottedCount = 0;
    let totalPrefNumber = 0;
    const unallotted = [];

    Object.values(bestSolution.allotments).forEach(item => {
      if (item.status === "ALLOTTED") {
        allottedCount++;
        totalPrefNumber += item.choiceNumber;
      } else {
        unallotted.push(item);
      }
    });

    const metrics = {
      algorithm: "Backtracking / Constraint Search",
      totalCandidates: candidates.length,
      allottedCount,
      unallottedCount: unallotted.length,
      fillRate: `${((allottedCount / candidates.length) * 100).toFixed(1)}%`,
      averagePreferenceRank: allottedCount > 0 ? +(totalPrefNumber / allottedCount).toFixed(2) : 0,
      recursiveCalls,
      backtrackCount,
      statesExplored,
      prunedBranches,
      durationMs,
      timeComplexity: "O(K^N) worst-case (pruned to O(B^d))",
      spaceComplexity: "O(N) recursion stack"
    };

    return {
      allotments: bestSolution.allotments,
      unallotted,
      seatMatrix: bestSolution.seatMatrix,
      metrics,
      traceSteps,
      stateSpaceTree: stateSpaceTree.slice(0, 100) // Keep reasonable subset for canvas rendering
    };
  }
}

window.BacktrackingAllocator = BacktrackingAllocator;
