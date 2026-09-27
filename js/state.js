// state.js - Data Models and Pre-loaded Presets for Engineering & Medical Counselling

const PRESETS = {
  ts_eamcet: {
    name: "Telangana EAMCET (1,000 Students & 2021 Cutoffs)",
    isEamcet: true,
    colleges: [],
    candidates: []
  }
};

class AppState {
  constructor() {
    this.currentPresetKey = "ts_eamcet";
    this.colleges = [];
    this.candidates = [];
    this.allotmentResults = null;
    this.currentAlgorithm = "greedy"; // 'greedy' | 'backtracking' | 'both'
    this.currentRound = 1;
    this.maxRounds = 3;
    this.roundData = {
      1: { candidateDecisions: {}, allotments: null },
      2: { candidateDecisions: {}, allotments: null },
      3: { candidateDecisions: {}, allotments: null }
    };
    this.executionMetrics = {
      greedy: null,
      backtracking: null
    };
    this.listeners = [];
  }

  loadPreset(key) {
    this.currentPresetKey = key;
    if (key === "ts_eamcet") {
      this.colleges = [];
      this.candidates = [];
    } else if (PRESETS[key]) {
      this.colleges = JSON.parse(JSON.stringify(PRESETS[key].colleges));
      this.candidates = JSON.parse(JSON.stringify(PRESETS[key].candidates));
    }
    this.resetRounds();
    this.notify();
  }

  resetRounds() {
    this.currentRound = 1;
    this.allotmentResults = null;
    this.roundData = {
      1: { candidateDecisions: {}, allotments: null },
      2: { candidateDecisions: {}, allotments: null },
      3: { candidateDecisions: {}, allotments: null }
    };
    this.executionMetrics = { greedy: null, backtracking: null };
  }

  subscribe(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  getCollege(collegeId) {
    return this.colleges.find(c => c.id === collegeId);
  }

  getBranchName(collegeId, branchCode) {
    const col = this.getCollege(collegeId);
    if (col && col.branches[branchCode]) {
      return col.branches[branchCode].name;
    }
    return branchCode;
  }

  getChoiceDisplay(choiceStr) {
    if (!choiceStr) return "None";
    const [cId, bCode] = choiceStr.split(":");
    const col = this.getCollege(cId);
    const colName = col ? col.name : cId;
    const bName = this.getBranchName(cId, bCode);
    return `${colName} — ${bName} (${bCode})`;
  }

  // Clone seat matrix helper for simulation without side effects
  cloneSeatMatrix() {
    const matrix = {};
    this.colleges.forEach(col => {
      matrix[col.id] = {};
      Object.keys(col.branches).forEach(bKey => {
        const b = col.branches[bKey];
        matrix[col.id][bKey] = {
          total: b.total,
          remaining: b.total,
          quotas: { ...b.quotas },
          allotted: [] // array of candidate IDs
        };
      });
    });
    return matrix;
  }
}

// Global instance
window.appState = new AppState();
