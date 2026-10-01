// rounds.js - Multi-Round Counselling Simulator (Freeze, Float, Slide)
/**
 * JoSAA / NEET Counselling Round Lifecycle:
 * - Round 1: Initial Allocation across all eligible candidates.
 * - Candidate Decision Phase:
 *    * FREEZE: Lock allotted seat, candidate exits future rounds.
 *    * FLOAT: Hold allotted seat, but eligible for higher preferences in any college in Round 2.
 *    * SLIDE: Hold allotted seat, eligible for higher branch in the SAME college only.
 *    * WITHDRAW: Reject seat, seat becomes vacant for subsequent rounds.
 * - Round 2 & 3: Re-allocation on remaining & vacated seats. Float/Slide candidates get upgraded if
 *    higher preferences open up; otherwise retain fallback seat.
 */

class CounsellingRounds {
  static submitDecisions(roundNumber, decisionsMap) {
    if (!window.appState.roundData[roundNumber]) {
      window.appState.roundData[roundNumber] = { candidateDecisions: {}, allotments: null };
    }
    window.appState.roundData[roundNumber].candidateDecisions = { ...decisionsMap };
  }

  /**
   * Advances from currentRound to currentRound + 1
   */
  static advanceToNextRound() {
    const currentRound = window.appState.currentRound;
    if (currentRound >= window.appState.maxRounds) {
      alert("Maximum counselling rounds (Round 3) reached!");
      return false;
    }

    const currentAllotments = window.appState.roundData[currentRound]?.allotments;
    if (!currentAllotments) {
      alert(`Please run allotment for Round ${currentRound} first before advancing.`);
      return false;
    }

    const nextRound = currentRound + 1;
    const decisions = window.appState.roundData[currentRound]?.candidateDecisions || {};

    // Prepare candidate inputs for next round
    const candidates = window.appState.candidates;
    const colleges = window.appState.colleges;

    // Start with fresh seat matrix
    const nextMatrix = {};
    colleges.forEach(col => {
      nextMatrix[col.id] = {};
      Object.keys(col.branches).forEach(bCode => {
        const b = col.branches[bCode];
        nextMatrix[col.id][bCode] = {
          total: b.total,
          remaining: b.total,
          quotas: { ...b.quotas },
          allotted: []
        };
      });
    });

    const nextAllotments = {};
    const candidateRoster = [];

    // Process Frozen seats first
    candidates.forEach(cand => {
      const prevAlloc = currentAllotments[cand.id];
      const decision = decisions[cand.id] || "FLOAT"; // Default to Float if not explicitly set

      if (prevAlloc && prevAlloc.status === "ALLOTTED") {
        if (decision === "FREEZE") {
          // Lock seat
          const colSeat = nextMatrix[prevAlloc.collegeId][prevAlloc.branchCode];
          colSeat.remaining--;
          colSeat.quotas[prevAlloc.quotaUsed]--;
          colSeat.allotted.push({
            candidateId: cand.id,
            candidateName: cand.name,
            rank: cand.rank,
            category: cand.category,
            quotaUsed: prevAlloc.quotaUsed,
            preferenceNumber: prevAlloc.choiceNumber,
            frozen: true
          });

          nextAllotments[cand.id] = {
            ...prevAlloc,
            status: "FROZEN",
            decision: "FREEZE"
          };
        } else if (decision === "WITHDRAW") {
          // Surrender seat
          nextAllotments[cand.id] = {
            candidateId: cand.id,
            candidateName: cand.name,
            rank: cand.rank,
            category: cand.category,
            status: "WITHDRAWN",
            decision: "WITHDRAW"
          };
        } else {
          // FLOAT or SLIDE candidate: re-enters allocation pool with filtered preferences
          const higherPreferences = [];
          for (let pIdx = 0; pIdx < cand.preferences.length; pIdx++) {
            const pStr = cand.preferences[pIdx];
            if (pIdx + 1 < prevAlloc.choiceNumber) {
              if (decision === "SLIDE") {
                const [cId] = pStr.split(":");
                if (cId === prevAlloc.collegeId) {
                  higherPreferences.push(pStr);
                }
              } else {
                // FLOAT: any college
                higherPreferences.push(pStr);
              }
            }
          }

          candidateRoster.push({
            candidate: cand,
            higherPreferences,
            fallbackAllotment: prevAlloc,
            decision
          });
        }
      } else {
        // Was unallotted previously: re-enters with all preferences
        candidateRoster.push({
          candidate: cand,
          higherPreferences: [...cand.preferences],
          fallbackAllotment: null,
          decision: "FLOAT"
        });
      }
    });

    // Run priority allocation on remaining roster
    candidateRoster.sort((a, b) => a.candidate.rank - b.candidate.rank);

    candidateRoster.forEach(item => {
      const cand = item.candidate;
      let upgraded = false;

      // Try higher preferences
      for (let pIdx = 0; pIdx < item.higherPreferences.length; pIdx++) {
        const prefStr = item.higherPreferences[pIdx];
        const [cId, bCode] = prefStr.split(":");
        const branchSeat = nextMatrix[cId] && nextMatrix[cId][bCode];

        if (branchSeat && branchSeat.remaining > 0) {
          let quota = null;
          if (branchSeat.quotas.GEN > 0) quota = "GEN";
          else if (cand.category !== "GEN" && branchSeat.quotas[cand.category] > 0) quota = cand.category;

          if (quota) {
            branchSeat.remaining--;
            branchSeat.quotas[quota]--;
            const origPrefIndex = cand.preferences.indexOf(prefStr) + 1;

            nextAllotments[cand.id] = {
              candidateId: cand.id,
              candidateName: cand.name,
              rank: cand.rank,
              category: cand.category,
              collegeId: cId,
              branchCode: bCode,
              choiceNumber: origPrefIndex,
              quotaUsed: quota,
              status: "UPGRADED",
              previousChoice: item.fallbackAllotment ? `${item.fallbackAllotment.collegeId}:${item.fallbackAllotment.branchCode}` : null,
              decision: item.decision
            };
            upgraded = true;
            break;
          }
        }
      }

      // If not upgraded, reinstate fallback seat if available
      if (!upgraded) {
        if (item.fallbackAllotment) {
          const fallback = item.fallbackAllotment;
          const branchSeat = nextMatrix[fallback.collegeId][fallback.branchCode];
          if (branchSeat && branchSeat.remaining > 0) {
            branchSeat.remaining--;
            branchSeat.quotas[fallback.quotaUsed]--;
            nextAllotments[cand.id] = {
              ...fallback,
              status: "RETAINED",
              decision: item.decision
            };
          } else {
            // Fallback seat preserved
            nextAllotments[cand.id] = {
              ...fallback,
              status: "RETAINED",
              decision: item.decision
            };
          }
        } else {
          nextAllotments[cand.id] = {
            candidateId: cand.id,
            candidateName: cand.name,
            rank: cand.rank,
            category: cand.category,
            status: "UNALLOTTED",
            decision: item.decision
          };
        }
      }
    });

    window.appState.currentRound = nextRound;
    window.appState.roundData[nextRound] = {
      candidateDecisions: {},
      allotments: nextAllotments
    };
    window.appState.notify();
    return true;
  }
}

window.CounsellingRounds = CounsellingRounds;
