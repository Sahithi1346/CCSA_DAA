// greedy.js - Greedy Rank-Based Priority Allocation Algorithm (JoSAA / Counselling Standard)
/**
 * Greedy Algorithm Concept in College Counselling:
 * 1. Greedy Choice Property: Process candidates strictly by merit (Rank 1 first). At each step,
 *    satisfy the current candidate with the highest possible preference available in the seat matrix.
 * 2. Optimal Substructure: By greedily maximizing merit fairness for candidate i, the overall
 *    allocation preserves strict meritocracy (no candidate with rank j > i can claim a seat preferred
 *    by candidate i if candidate i was denied that seat due to capacity).
 *
 * Time Complexity:
 * - Sorting candidates: O(N log N)
 * - Seat evaluation: O(N * K) where K is number of preferences per student
 * - Overall Time: O(N log N + N * K)
 * Space Complexity:
 * - O(C * B) for seat matrix + O(N) for allotment map
 */

class GreedyAllocator {
  static run(candidates, colleges, options = {}) {
    const startTime = performance.now();
    let comparisons = 0;
    let allocationsCount = 0;
    const traceSteps = [];

    // Clone seat matrix to avoid modifying original state
    const seatMatrix = {};
    colleges.forEach(col => {
      seatMatrix[col.id] = {};
      Object.keys(col.branches).forEach(bCode => {
        const b = col.branches[bCode];
        seatMatrix[col.id][bCode] = {
          total: b.total,
          remaining: b.total,
          quotas: { ...b.quotas },
          allotted: [] // array of { candidateId, rank, category, quotaUsed }
        };
      });
    });

    // Step 1: Sort candidates by rank ascending (Greedy priority queue order)
    const sortedCandidates = [...candidates].sort((a, b) => {
      comparisons++;
      return a.rank - b.rank;
    });

    traceSteps.push({
      type: "SORT_COMPLETED",
      description: `Candidates sorted in strictly ascending merit order (Ranks 1 to ${sortedCandidates.length}). Greedy pointer initialized.`,
      candidatesQueue: sortedCandidates.map(c => ({ id: c.id, rank: c.rank, name: c.name }))
    });

    const allotments = {};
    const unallotted = [];
    let totalPreferenceScore = 0; // Sum of choice ranks (1 for 1st choice, 2 for 2nd etc.) - Lower is better

    // Step 2: Greedily evaluate each candidate
    for (let i = 0; i < sortedCandidates.length; i++) {
      const candidate = sortedCandidates[i];
      let allottedChoice = null;

      traceSteps.push({
        type: "CANDIDATE_START",
        candidateId: candidate.id,
        candidateName: candidate.name,
        rank: candidate.rank,
        category: candidate.category,
        description: `Processing Rank #${candidate.rank}: ${candidate.name} (${candidate.category})`
      });

      // Iterate through preferences in strict user priority
      for (let pIdx = 0; pIdx < candidate.preferences.length; pIdx++) {
        const prefStr = candidate.preferences[pIdx];
        const [cId, bCode] = prefStr.split(":");
        comparisons++;

        const branchSeat = seatMatrix[cId] && seatMatrix[cId][bCode];

        traceSteps.push({
          type: "EVALUATE_CHOICE",
          candidateId: candidate.id,
          candidateName: candidate.name,
          choiceIndex: pIdx + 1,
          choice: prefStr,
          collegeId: cId,
          branchCode: bCode,
          seatsLeft: branchSeat ? branchSeat.remaining : 0,
          description: `Rank #${candidate.rank} evaluates Choice #${pIdx + 1}: ${cId} - ${bCode}`
        });

        if (!branchSeat || branchSeat.remaining <= 0) {
          traceSteps.push({
            type: "CHOICE_UNAVAILABLE",
            candidateId: candidate.id,
            choice: prefStr,
            reason: "Total capacity exhausted",
            description: `Choice #${pIdx + 1} (${cId} - ${bCode}) has NO remaining seats.`
          });
          continue;
        }

        // Check quota availability:
        // In realistic Indian counselling (JoSAA), candidates first compete for OPEN/GEN merit seats.
        // If GEN seat is available, allot under GEN. Otherwise, if candidate is reserved (OBC/SC/ST) and quota is available, allot under quota.
        let quotaAllotted = null;

        if (branchSeat.quotas.GEN > 0) {
          quotaAllotted = "GEN";
        } else if (candidate.category !== "GEN" && branchSeat.quotas[candidate.category] > 0) {
          quotaAllotted = candidate.category;
        }

        if (quotaAllotted) {
          // Commit Greedy Choice!
          branchSeat.remaining--;
          branchSeat.quotas[quotaAllotted]--;
          branchSeat.allotted.push({
            candidateId: candidate.id,
            candidateName: candidate.name,
            rank: candidate.rank,
            category: candidate.category,
            quotaUsed: quotaAllotted,
            preferenceNumber: pIdx + 1
          });

          allottedChoice = {
            candidateId: candidate.id,
            candidateName: candidate.name,
            rank: candidate.rank,
            category: candidate.category,
            collegeId: cId,
            branchCode: bCode,
            choiceNumber: pIdx + 1,
            quotaUsed: quotaAllotted,
            status: "ALLOTTED"
          };

          allotments[candidate.id] = allottedChoice;
          allocationsCount++;
          totalPreferenceScore += (pIdx + 1);

          traceSteps.push({
            type: "SEAT_COMMITTED",
            candidateId: candidate.id,
            candidateName: candidate.name,
            rank: candidate.rank,
            choice: prefStr,
            choiceNumber: pIdx + 1,
            quotaUsed: quotaAllotted,
            seatsLeftNow: branchSeat.remaining,
            description: `SUCCESS: Rank #${candidate.rank} ${candidate.name} is GREEDILY allotted Choice #${pIdx + 1} (${cId}:${bCode}) under [${quotaAllotted}] quota!`
          });

          break; // Stop evaluating further preferences for this candidate
        } else {
          traceSteps.push({
            type: "QUOTA_EXHAUSTED",
            candidateId: candidate.id,
            choice: prefStr,
            category: candidate.category,
            description: `Seats available in ${cId}:${bCode}, but ${candidate.category} & GEN quotas are both full.`
          });
        }
      }

      if (!allottedChoice) {
        unallotted.push(candidate);
        allotments[candidate.id] = {
          candidateId: candidate.id,
          candidateName: candidate.name,
          rank: candidate.rank,
          category: candidate.category,
          status: "UNALLOTTED",
          choiceNumber: null,
          reason: "Preferences exhausted / Higher ranks took available capacity"
        };

        traceSteps.push({
          type: "CANDIDATE_UNALLOTTED",
          candidateId: candidate.id,
          candidateName: candidate.name,
          rank: candidate.rank,
          description: `Rank #${candidate.rank} ${candidate.name} could NOT be allotted any of their preferred choices.`
        });
      }
    }

    const endTime = performance.now();
    const durationMs = +(endTime - startTime).toFixed(3);

    const metrics = {
      algorithm: "Greedy Priority Allocation",
      totalCandidates: candidates.length,
      allottedCount: allocationsCount,
      unallottedCount: unallotted.length,
      fillRate: `${((allocationsCount / candidates.length) * 100).toFixed(1)}%`,
      averagePreferenceRank: allocationsCount > 0 ? +(totalPreferenceScore / allocationsCount).toFixed(2) : 0,
      comparisons,
      durationMs,
      timeComplexity: "O(N log N + N · K)",
      spaceComplexity: "O(C · B + N)"
    };

    return {
      allotments,
      unallotted,
      seatMatrix,
      metrics,
      traceSteps
    };
  }
}

window.GreedyAllocator = GreedyAllocator;
