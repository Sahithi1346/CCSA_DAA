// algorithms.js - Unified Algorithm Runner & Comparative Benchmark Engine

class AlgorithmRunner {
  /**
   * Runs the chosen algorithm or both for comparative DAA study
   * @param {string} algoType - 'greedy' | 'backtracking' | 'both'
   * @param {Array} candidates 
   * @param {Array} colleges 
   */
  static execute(algoType, candidates, colleges) {
    if (algoType === "greedy") {
      const result = GreedyAllocator.run(candidates, colleges);
      result.stability = AlgorithmRunner.verifyStability(result.allotments, candidates, colleges);
      return { greedy: result };
    } else if (algoType === "backtracking") {
      const result = BacktrackingAllocator.run(candidates, colleges, { quickOptimal: false });
      result.stability = AlgorithmRunner.verifyStability(result.allotments, candidates, colleges);
      return { backtracking: result };
    } else {
      // Run both
      const greedyRes = GreedyAllocator.run(candidates, colleges);
      greedyRes.stability = AlgorithmRunner.verifyStability(greedyRes.allotments, candidates, colleges);

      const btRes = BacktrackingAllocator.run(candidates, colleges, { quickOptimal: false });
      btRes.stability = AlgorithmRunner.verifyStability(btRes.allotments, candidates, colleges);

      return {
        greedy: greedyRes,
        backtracking: btRes,
        comparison: AlgorithmRunner.compareResults(greedyRes, btRes)
      };
    }
  }

  /**
   * Verifies Gale-Shapley stability & merit fairness
   * Checks for "Blocking Pairs": A student S and college-branch C such that S prefers C over current match,
   * AND C had available seats or admitted a student with a lower rank (worse merit).
   */
  static verifyStability(allotments, candidates, colleges) {
    const blockingPairs = [];

    // Map college branches to lowest-ranked admitted student
    const branchCutoffs = {};
    Object.values(allotments).forEach(item => {
      if (item.status === "ALLOTTED") {
        const key = `${item.collegeId}:${item.branchCode}`;
        if (!branchCutoffs[key] || item.rank > branchCutoffs[key]) {
          branchCutoffs[key] = item.rank;
        }
      }
    });

    candidates.forEach(cand => {
      const currentAlloc = allotments[cand.id];
      const currentChoiceNum = (currentAlloc && currentAlloc.status === "ALLOTTED") 
        ? currentAlloc.choiceNumber 
        : Infinity;

      // Check all choices preferred over current allocation
      for (let i = 0; i < cand.preferences.length; i++) {
        const prefChoiceNum = i + 1;
        if (prefChoiceNum >= currentChoiceNum) break; // Not preferred over current seat

        const prefStr = cand.preferences[i];
        const cutoffRank = branchCutoffs[prefStr];

        // If this branch admitted someone with worse rank than cand.rank, it's a stability violation!
        if (cutoffRank !== undefined && cand.rank < cutoffRank) {
          blockingPairs.push({
            candidateId: cand.id,
            candidateName: cand.name,
            candidateRank: cand.rank,
            preferredChoice: prefStr,
            currentChoice: currentAlloc ? `${currentAlloc.collegeId}:${currentAlloc.branchCode}` : "Unallotted",
            cutoffRankAdmitted: cutoffRank
          });
        }
      }
    });

    return {
      isStable: blockingPairs.length === 0,
      blockingPairsCount: blockingPairs.length,
      blockingPairs
    };
  }

  /**
   * Generates analytical comparison between Greedy and Backtracking
   */
  static compareResults(greedy, bt) {
    const gMetrics = greedy.metrics;
    const bMetrics = bt.metrics;

    // Preference breakdown (how many got 1st choice, 2nd choice, etc.)
    const gDist = { choice1: 0, choice2: 0, choice3: 0, choice4Plus: 0 };
    const bDist = { choice1: 0, choice2: 0, choice3: 0, choice4Plus: 0 };

    Object.values(greedy.allotments).forEach(item => {
      if (item.status === "ALLOTTED") {
        if (item.choiceNumber === 1) gDist.choice1++;
        else if (item.choiceNumber === 2) gDist.choice2++;
        else if (item.choiceNumber === 3) gDist.choice3++;
        else gDist.choice4Plus++;
      }
    });

    Object.values(bt.allotments).forEach(item => {
      if (item.status === "ALLOTTED") {
        if (item.choiceNumber === 1) bDist.choice1++;
        else if (item.choiceNumber === 2) bDist.choice2++;
        else if (item.choiceNumber === 3) bDist.choice3++;
        else bDist.choice4Plus++;
      }
    });

    return {
      speedupFactor: +(bMetrics.durationMs / Math.max(0.001, gMetrics.durationMs)).toFixed(1),
      greedyDistribution: gDist,
      backtrackingDistribution: bDist,
      winnerSpeed: gMetrics.durationMs <= bMetrics.durationMs ? "Greedy Algorithm" : "Backtracking",
      winnerPreference: gMetrics.averagePreferenceRank <= bMetrics.averagePreferenceRank ? "Greedy Algorithm" : "Backtracking",
      summary: `Greedy completed in ${gMetrics.durationMs}ms with 0 backtracks (strict merit priority). Backtracking explored ${bMetrics.statesExplored} states with ${bMetrics.backtrackCount} backtracks to evaluate constraint satisfaction.`
    };
  }
}

window.AlgorithmRunner = AlgorithmRunner;
