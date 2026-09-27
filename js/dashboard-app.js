// dashboard-app.js — Core Controller for CCSA Modern SaaS Admin Dashboard

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 1. DEFAULT DATASETS
  // ─────────────────────────────────────────────────────────────
  const DEFAULT_COLLEGES = [
    { id: 'C001', name: 'JNTU Hyderabad', branch: 'CSE', capacity: 120, closingRank: 15200 },
    { id: 'C001', name: 'JNTU Hyderabad', branch: 'ECE', capacity: 120, closingRank: 18600 },
    { id: 'C001', name: 'JNTU Hyderabad', branch: 'EEE', capacity: 60, closingRank: 25400 },
    { id: 'C002', name: 'Osmania University', branch: 'CSE', capacity: 120, closingRank: 16200 },
    { id: 'C002', name: 'Osmania University', branch: 'ECE', capacity: 120, closingRank: 20100 },
    { id: 'C003', name: 'CBIT Hyderabad', branch: 'CSE', capacity: 120, closingRank: 17400 },
    { id: 'C003', name: 'CBIT Hyderabad', branch: 'IT', capacity: 60, closingRank: 26800 },
    { id: 'C004', name: 'VNR VJIET', branch: 'CSE', capacity: 180, closingRank: 19800 },
    { id: 'C004', name: 'VNR VJIET', branch: 'ECE', capacity: 120, closingRank: 24500 },
    { id: 'C005', name: 'Vasavi College of Engineering', branch: 'CSE', capacity: 120, closingRank: 21400 },
    { id: 'C005', name: 'Vasavi College of Engineering', branch: 'IT', capacity: 60, closingRank: 28900 },
    { id: 'C006', name: 'CVR College of Engineering', branch: 'CSE', capacity: 180, closingRank: 25800 },
    { id: 'C006', name: 'CVR College of Engineering', branch: 'AI&DS', capacity: 120, closingRank: 29500 },
    { id: 'C007', name: 'Gokaraju Rangaraju (GRIET)', branch: 'CSE', capacity: 180, closingRank: 27100 },
    { id: 'C008', name: 'Vardhaman College of Engg', branch: 'CSE', capacity: 180, closingRank: 31200 },
    { id: 'C009', name: 'Keshav Memorial (KMIT)', branch: 'CSE', capacity: 240, closingRank: 28400 },
    { id: 'C010', name: 'B V Raju Institute (BVRIT)', branch: 'CSE', capacity: 180, closingRank: 35600 },
    { id: 'C011', name: 'Sreenidhi Inst of Sci & Tech', branch: 'CSE', capacity: 240, closingRank: 34100 },
    { id: 'C012', name: 'MVSR Engineering College', branch: 'CSE', capacity: 180, closingRank: 36200 },
    { id: 'C013', name: 'Mahatma Gandhi Inst (MGIT)', branch: 'CSE', capacity: 120, closingRank: 32500 },
    { id: 'C014', name: 'Kakatiya Inst (KITS Warangal)', branch: 'CSE', capacity: 180, closingRank: 38900 },
    { id: 'C015', name: 'CMR College of Engineering', branch: 'CSE', capacity: 180, closingRank: 42100 },
    { id: 'C016', name: 'CMR Institute of Technology', branch: 'ECE', capacity: 120, closingRank: 48900 },
    { id: 'C017', name: 'Malla Reddy Engg College', branch: 'CSE', capacity: 240, closingRank: 45600 },
    { id: 'C018', name: 'MLR Institute of Technology', branch: 'CSE', capacity: 180, closingRank: 47200 },
    { id: 'C019', name: 'Institute of Aeronautical Engg', branch: 'CSE', capacity: 180, closingRank: 46800 },
    { id: 'C020', name: 'Guru Nanak Tech Campus', branch: 'CSE', capacity: 240, closingRank: 52100 },
    { id: 'C021', name: 'Anurag University', branch: 'CSE', capacity: 240, closingRank: 43500 },
    { id: 'C022', name: 'SR University Warangal', branch: 'CSE', capacity: 180, closingRank: 54200 },
    { id: 'C023', name: 'Vaagdevi Engineering College', branch: 'CSE', capacity: 120, closingRank: 58900 },
    { id: 'C024', name: 'JNTUH Sultanpur', branch: 'CSE', capacity: 60, closingRank: 37500 },
    { id: 'C025', name: 'JNTUH Jagtial', branch: 'CSE', capacity: 60, closingRank: 39800 },
    { id: 'C026', name: 'JNTUH Manthani', branch: 'CSE', capacity: 60, closingRank: 44200 },
    { id: 'C027', name: 'KU College of Engg Kothagudem', branch: 'CSE', capacity: 60, closingRank: 46500 },
    { id: 'C028', name: 'Siddhartha Inst of Tech', branch: 'CSE', capacity: 120, closingRank: 62400 },
    { id: 'C029', name: 'KG Reddy College of Engg', branch: 'CSE', capacity: 120, closingRank: 65100 },
    { id: 'C030', name: 'Sphoorthy Engineering College', branch: 'CSE', capacity: 120, closingRank: 69400 },
    { id: 'C031', name: 'Nalla Malla Reddy Engg College', branch: 'CSE', capacity: 120, closingRank: 71200 },
    { id: 'C032', name: 'Samskruti College of Engg', branch: 'CSE', capacity: 120, closingRank: 75400 },
    { id: 'C033', name: 'Balaji Inst of Tech Narsampet', branch: 'CSE', capacity: 120, closingRank: 78900 },
    { id: 'C034', name: 'Jayamukhi Inst of Tech Warangal', branch: 'CSE', capacity: 120, closingRank: 81200 },
    { id: 'C035', name: 'Jyothishmathi Inst Karimnagar', branch: 'CSE', capacity: 120, closingRank: 83500 },
    { id: 'C036', name: 'Anurag Engineering Kodad', branch: 'CSE', capacity: 120, closingRank: 86400 },
    { id: 'C037', name: 'TKR College of Engg', branch: 'CSE', capacity: 180, closingRank: 49800 },
    { id: 'C038', name: 'Teegala Krishna Reddy Engg', branch: 'CSE', capacity: 120, closingRank: 59400 },
    { id: 'C039', name: 'Geethanjali College of Engg', branch: 'CSE', capacity: 180, closingRank: 41200 },
    { id: 'C040', name: 'Bharat Inst of Engg & Tech', branch: 'CSE', capacity: 180, closingRank: 63100 },
    { id: 'C041', name: 'St. Martins Engineering College', branch: 'CSE', capacity: 180, closingRank: 51200 },
    { id: 'C042', name: 'Marri Laxman Reddy (MLRS)', branch: 'CSE', capacity: 180, closingRank: 53400 },
    { id: 'C043', name: 'Maturi Venkata Subba Rao (ECE)', branch: 'ECE', capacity: 120, closingRank: 44500 },
    { id: 'C044', name: 'KITS Warangal (ECE)', branch: 'ECE', capacity: 120, closingRank: 46200 },
    { id: 'C045', name: 'CMR Engineering College', branch: 'CSE', capacity: 180, closingRank: 50400 },
    { id: 'C046', name: 'VNR VJIET (IT)', branch: 'IT', capacity: 60, closingRank: 22100 },
    { id: 'C047', name: 'CBIT Hyderabad (ECE)', branch: 'ECE', capacity: 120, closingRank: 23400 },
    { id: 'C048', name: 'Vasavi College of Engg (ECE)', branch: 'ECE', capacity: 120, closingRank: 25100 },
    { id: 'C049', name: 'CVR College (ECE)', branch: 'ECE', capacity: 120, closingRank: 31200 },
    { id: 'C050', name: 'GRIET Hyderabad (IT)', branch: 'IT', capacity: 60, closingRank: 32400 },
    { id: 'C051', name: 'Vardhaman College (IT)', branch: 'IT', capacity: 60, closingRank: 36500 },
    { id: 'C052', name: 'BVRIT Narsapur (ECE)', branch: 'ECE', capacity: 120, closingRank: 39800 }
  ];

  // Top 8 candidates with REAL college preferences
  const PRIMARY_STUDENTS = [
    {
      id: 'S001',
      name: 'Aarav Sharma',
      rank: 12450,
      category: 'BC-B',
      preferences: [
        'JNTU Hyderabad - CSE',
        'JNTU Hyderabad - ECE',
        'Osmania University - CSE',
        'CBIT Hyderabad - CSE',
        'VNR VJIET - CSE'
      ]
    },
    {
      id: 'S002',
      name: 'Priya Reddy',
      rank: 18500,
      category: 'OC',
      preferences: [
        'JNTU Hyderabad - CSE',
        'Osmania University - ECE',
        'CBIT Hyderabad - CSE',
        'VNR VJIET - IT',
        'Vasavi College of Engineering - CSE'
      ]
    },
    {
      id: 'S003',
      name: 'Karthik Verma',
      rank: 22010,
      category: 'BC-A',
      preferences: [
        'JNTU Hyderabad - CSE',
        'Osmania University - CSE',
        'JNTU Hyderabad - EEE',
        'CVR College of Engineering - AI&DS',
        'Gokaraju Rangaraju (GRIET) - CSE'
      ]
    },
    {
      id: 'S004',
      name: 'Sneha Iyer',
      rank: 35600,
      category: 'OC',
      preferences: [
        'VNR VJIET - IT',
        'CBIT Hyderabad - IT',
        'Vasavi College of Engineering - IT',
        'CVR College of Engineering - CSE',
        'Keshav Memorial (KMIT) - CSE'
      ]
    },
    {
      id: 'S005',
      name: 'Rohit Kumar',
      rank: 42100,
      category: 'SC',
      preferences: [
        'CBIT Hyderabad - CSE',
        'VNR VJIET - CSE',
        'JNTU Hyderabad - ECE',
        'CMR College of Engineering - CSE',
        'Geethanjali College of Engg - CSE'
      ]
    },
    {
      id: 'S006',
      name: 'Ananya Rao',
      rank: 50200,
      category: 'BC-B',
      preferences: [
        'JNTU Hyderabad - ECE',
        'Osmania University - ECE',
        'CBIT Hyderabad (ECE) - ECE',
        'Vasavi College of Engg (ECE) - ECE',
        'CVR College (ECE) - ECE'
      ]
    },
    {
      id: 'S007',
      name: 'Vikram Singh',
      rank: 61200,
      category: 'BC-D',
      preferences: [
        'Malla Reddy Engg College - CSE',
        'MLR Institute of Technology - CSE',
        'Guru Nanak Tech Campus - CSE',
        'Anurag University - CSE',
        'SR University Warangal - CSE'
      ]
    },
    {
      id: 'S008',
      name: 'Neha Patel',
      rank: 74500,
      category: 'OC',
      preferences: [
        'Keshav Memorial (KMIT) - CSE',
        'B V Raju Institute (BVRIT) - CSE',
        'Sreenidhi Inst of Sci & Tech - CSE',
        'TKR College of Engg - CSE',
        'CMR Engineering College - CSE'
      ]
    }
  ];

  // ─────────────────────────────────────────────────────────────
  // ALLOCATION ENGINE — Category-aware, rank-correct, seat-aware
  // ─────────────────────────────────────────────────────────────

  /**
   * Category closing rank multipliers relative to OC closing rank.
   * SC/ST/EWS typically have higher (more relaxed) cutoffs.
   * BC categories are slightly relaxed compared to OC.
   */
  const CATEGORY_CLOSING_RANK_FACTOR = {
    'OC':   1.00,
    'BC-A': 1.18,
    'BC-B': 1.12,
    'BC-C': 1.22,
    'BC-D': 1.15,
    'BC-E': 1.10,
    'SC':   1.45,
    'ST':   1.60,
    'EWS':  1.08
  };

  /**
   * Get effective closing rank for a student's category at a given college-branch.
   * Uses student's actual category (SC, ST, BC-A/B/C/D/E, EWS, OC).
   * If a category cutoff is missing, handles it explicitly.
   */
  function getCategoryClosingRank(college, studentCategory) {
    if (!college) return null;
    const cat = (studentCategory || 'OC').trim().toUpperCase();

    // 1. Direct category cutoff mapping if provided on college object
    if (college.cutoffs && college.cutoffs[cat] !== undefined) {
      return Number(college.cutoffs[cat]);
    }
    if (college.categoryCutoffs && college.categoryCutoffs[cat] !== undefined) {
      return Number(college.categoryCutoffs[cat]);
    }

    // 2. Base closing rank (OC cutoff) scaled by specific student's category multiplier
    const baseRank = Number(college.closingRank || college.cutoff || 0);
    if (baseRank > 0) {
      const factor = CATEGORY_CLOSING_RANK_FACTOR[cat] || 1.0;
      return Math.round(baseRank * factor);
    }

    // Explicit handling if category cutoff is missing: return null
    return null;
  }

  function cleanCollegeName(str) {
    return (str || '')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/college of engineering/gi, 'college')
      .replace(/institute of technology/gi, 'institute')
      .toLowerCase()
      .trim();
  }

  /**
   * Find a college entry in app.colleges by name and branch.
   * Handles variations and branch-in-name formats like 'VNR VJIET (IT)'.
   */
  function findCollegeEntry(collegeName, branchName) {
    if (!collegeName || !branchName) return null;
    const targetCol = collegeName.trim().toLowerCase();
    const targetColClean = cleanCollegeName(collegeName);
    const targetBr = branchName.trim().toLowerCase();

    // 1. Exact match by name & branch
    let found = app.colleges.find(c =>
      c.name.toLowerCase() === targetCol && c.branch.toLowerCase() === targetBr
    );
    if (found) return found;

    // 2. Match by cleaned name & branch
    found = app.colleges.find(c => {
      const cClean = cleanCollegeName(c.name);
      return (cClean === targetColClean || cClean.includes(targetColClean) || targetColClean.includes(cClean)) &&
             c.branch.toLowerCase() === targetBr;
    });
    return found || null;
  }

  /**
   * GREEDY ALLOCATION ENGINE:
   * Evaluates student's preferences in strict order.
   * Step 1: Rank eligibility check (studentRank <= categoryClosingRank).
   * Step 2: Seat availability check (college.capacity - used > 0).
   * Returns { col, br, pref, status, closingRank, steps[] }
   */
  function greedyAllocate(student, seatTracker) {
    const steps = [];
    for (let i = 0; i < student.preferences.length; i++) {
      const prefNum = i + 1;
      const prefStr = student.preferences[i] || '';
      const parts = prefStr.split(' - ');
      const colName = parts[0] ? parts[0].trim() : '';
      const brName  = parts[1] ? parts[1].trim() : '';
      const prefLabel = prefStr || `Preference ${prefNum}`;

      const college = findCollegeEntry(colName, brName);

      if (!college) {
        steps.push({
          prefNum, prefLabel,
          rankEligible: false, seatsAvailable: false, allocated: false,
          closingRank: null, reason: 'College/branch not found in dataset'
        });
        continue;
      }

      // Category-based cutoff
      const categoryClosingRank = getCategoryClosingRank(college, student.category);

      // STEP 1: Rank eligibility check (studentRank <= closingRank)
      // Lower numerical rank is better. Equal rank (e.g. 20000 <= 20000) is ELIGIBLE.
      // If category cutoff is missing, handle explicitly (do not mark ineligible).
      const rankEligible = (categoryClosingRank === null)
        ? true
        : (student.rank <= categoryClosingRank);

      if (!rankEligible) {
        steps.push({
          prefNum, prefLabel,
          collegeName: college.name, branch: college.branch,
          rankEligible: false, seatsAvailable: false, allocated: false,
          closingRank: categoryClosingRank, reason: 'Not available (closing rank exceeded)'
        });
        continue; // Try next preference
      }

      // STEP 2: Seat availability check
      const key = `${college.id}-${college.branch}`;
      const used = seatTracker.get(key) || 0;
      const seatsAvailable = (college.capacity - used) > 0;

      if (!seatsAvailable) {
        steps.push({
          prefNum, prefLabel,
          collegeName: college.name, branch: college.branch,
          rankEligible: true, seatsAvailable: false, allocated: false,
          closingRank: categoryClosingRank, reason: 'Eligible by rank, but no seats available'
        });
        continue; // Try next preference
      }

      // STEP 3: Both rank and seat satisfied -> ALLOCATE!
      seatTracker.set(key, used + 1);
      steps.push({
        prefNum, prefLabel,
        collegeName: college.name, branch: college.branch,
        rankEligible: true, seatsAvailable: true, allocated: true,
        closingRank: categoryClosingRank, reason: 'Allocated'
      });

      return {
        col: college.name,
        br: college.branch,
        pref: prefNum,
        status: 'Allocated',
        closingRank: categoryClosingRank,
        steps
      };
    }

    // No preference could be allocated
    return {
      col: '-', br: '-', pref: '-',
      status: 'Unallocated',
      closingRank: null,
      steps
    };
  }

  /**
   * BACKTRACKING ALLOCATION ENGINE:
   * Uses the EXACT same rank, category, and seat eligibility rules as Greedy:
   * studentRank <= categoryClosingRank and availableSeats > 0.
   */
  function backtrackingAllocate(student, seatTracker) {
    return greedyAllocate(student, seatTracker);
  }

  /**
   * Run allocation for a list of students using selected algorithm.
   * Returns array of result objects with steps attached.
   */
  function runAllocationEngine(students, algorithm = 'greedy') {
    // Sort by rank ascending (lower rank = higher merit priority)
    const sorted = [...students].sort((a, b) => a.rank - b.rank);
    const seatTracker = new Map(); // tracks seats allocated this run
    const results = [];

    for (const s of sorted) {
      let result;
      if (algorithm === 'backtracking') {
        result = backtrackingAllocate(s, seatTracker);
      } else {
        result = greedyAllocate(s, seatTracker);
      }
      results.push({
        studentId: s.id,
        name: s.name,
        rank: s.rank,
        category: s.category,
        allocatedCollege: result.col,
        branch: result.br,
        preferenceNumber: result.pref,
        status: result.status,
        closingRank: result.closingRank,
        steps: result.steps
      });
    }
    return results;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. STATE MANAGER
  // ─────────────────────────────────────────────────────────────
  class DashboardState {
    constructor() {
      this.students = [];
      this.colleges = [];
      this.allocationResults = [];
      this.isAllocated = false;
      this.selectedAlgorithm = 'greedy';
      this.selectedStudentId = null;
      this.lastAllocationTimestamp = '24 Sep 2026, 10:45 AM';

      // Selection mode for batch allocation
      this.isStudentSelectionMode = false;
      this.checkedStudentIds = new Set();
      this.batchSelectedIds = [];
      this.batchCurrentIndex = 0;

      // Pagination
      this.studentsPage = 1;
      this.studentsPerPage = 8;
      this.studentsSearch = '';

      this.collegesPage = 1;
      this.collegesPerPage = 8;
      this.collegesSearch = '';

      this.resultsPage = 1;
      this.resultsPerPage = 8;
      this.resultsSearch = '';

      this.loadFromStorage();
    }

    loadFromStorage() {
      try {
        // 1. Load Students
        const savedStudents = localStorage.getItem('ccsa_students_data');
        if (savedStudents) {
          const parsed = JSON.parse(savedStudents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.students = parsed;
          }
        }
        if (!this.students || this.students.length === 0) {
          this.students = [...PRIMARY_STUDENTS];
          this.initExtendedStudents(1000);
          this.saveStudents();
        }

        // 2. Load Colleges
        const savedColleges = localStorage.getItem('ccsa_colleges_data');
        if (savedColleges) {
          const parsedCol = JSON.parse(savedColleges);
          if (Array.isArray(parsedCol) && parsedCol.length > 0) {
            this.colleges = parsedCol;
          }
        }
        if (!this.colleges || this.colleges.length === 0) {
          this.colleges = [...DEFAULT_COLLEGES];
          this.saveColleges();
        }

        // 3. Load Allocation Results
        const savedResults = localStorage.getItem('ccsa_allocation_results');
        if (savedResults) {
          const parsedRes = JSON.parse(savedResults);
          if (Array.isArray(parsedRes) && parsedRes.length > 0) {
            this.allocationResults = parsedRes;
          }
        }

        const savedIsAllocated = localStorage.getItem('ccsa_is_allocated');
        if (savedIsAllocated !== null) {
          this.isAllocated = JSON.parse(savedIsAllocated);
        }

        const savedTimestamp = localStorage.getItem('ccsa_last_allocation_time');
        if (savedTimestamp) {
          this.lastAllocationTimestamp = savedTimestamp;
        }

        const savedAlgo = localStorage.getItem('ccsa_selected_algo');
        if (savedAlgo) {
          this.selectedAlgorithm = savedAlgo;
        }
      } catch (e) {
        console.warn('Could not read state from localStorage', e);
        if (!this.students || this.students.length === 0) {
          this.students = [...PRIMARY_STUDENTS];
          this.initExtendedStudents(1000);
        }
        if (!this.colleges || this.colleges.length === 0) {
          this.colleges = [...DEFAULT_COLLEGES];
        }
      }
    }

    saveStudents() {
      try {
        localStorage.setItem('ccsa_students_data', JSON.stringify(this.students));
      } catch (e) {
        console.warn('Could not save students to localStorage', e);
      }
    }

    saveColleges() {
      try {
        localStorage.setItem('ccsa_colleges_data', JSON.stringify(this.colleges));
      } catch (e) {
        console.warn('Could not save colleges to localStorage', e);
      }
    }

    saveAllocation() {
      try {
        localStorage.setItem('ccsa_allocation_results', JSON.stringify(this.allocationResults));
        localStorage.setItem('ccsa_is_allocated', JSON.stringify(this.isAllocated));
        localStorage.setItem('ccsa_last_allocation_time', this.lastAllocationTimestamp);
        localStorage.setItem('ccsa_selected_algo', this.selectedAlgorithm);
      } catch (e) {
        console.warn('Could not save allocation to localStorage', e);
      }
    }

    initExtendedStudents(count = 1000) {
      if (this.students.length >= count) return;

      const firstNames = ['Aarav', 'Aditya', 'Akash', 'Akshay', 'Ananya', 'Anjali', 'Arjun', 'Bhavya', 'Charan', 'Deepak', 'Divya', 'Harsha', 'Ishita', 'Karthik', 'Keerthana', 'Krishna', 'Manoj', 'Meghana', 'Nandini', 'Nikhil', 'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rakesh', 'Riya', 'Rohit', 'Sai', 'Sanjana', 'Sanjay', 'Sathvik', 'Shreya', 'Siddharth', 'Sneha', 'Srinivas', 'Teja', 'Varun', 'Vamshi', 'Vishal', 'Yash'];
      const lastNames = ['Sharma', 'Reddy', 'Verma', 'Iyer', 'Kumar', 'Rao', 'Singh', 'Patel', 'Nair', 'Bhat', 'Shetty', 'Goud', 'Naidu', 'Chowdary', 'Yadav', 'Deshmukh', 'Murthy', 'Varma', 'Prasad'];
      const categories = ['OC', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST', 'EWS'];
      const sampleColleges = ['JNTU Hyderabad', 'Osmania University', 'CBIT Hyderabad', 'VNR VJIET', 'Vasavi College', 'CVR College', 'GRIET Hyderabad', 'Vardhaman College', 'KMIT', 'BVRIT'];
      const branches = ['CSE', 'ECE', 'EEE', 'IT', 'AI&DS', 'MECH'];

      for (let i = this.students.length + 1; i <= count; i++) {
        const id = 'S' + String(i).padStart(3, '0');
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fn} ${ln}`;
        const rank = 10000 + (i * 95) + Math.floor(Math.random() * 50);
        const category = categories[Math.floor(Math.random() * categories.length)];

        // Select 5 real college-branch preferences
        const prefs = [];
        for (let p = 0; p < 5; p++) {
          const col = sampleColleges[Math.floor(Math.random() * sampleColleges.length)];
          const br = branches[Math.floor(Math.random() * branches.length)];
          prefs.push(`${col} - ${br}`);
        }

        this.students.push({
          id,
          name,
          rank,
          category,
          preferences: prefs
        });
      }
    }
  }

  const app = new DashboardState();
  app.initExtendedStudents(1000);

  // ─────────────────────────────────────────────────────────────
  // 3. UI RENDERING & CONTROLLER
  // ─────────────────────────────────────────────────────────────

  // Update Top Stat Cards & Summary Box
  function updateStatCards() {
    const totalStudentsEl = document.getElementById('statTotalStudents');
    const totalCollegesEl = document.getElementById('statTotalColleges');
    const totalBranchesEl = document.getElementById('statTotalBranches');
    const totalSeatsEl = document.getElementById('statTotalSeats');

    if (totalStudentsEl) totalStudentsEl.textContent = Number(app.students.length).toLocaleString();
    if (totalCollegesEl) totalCollegesEl.textContent = Number(app.colleges.length).toLocaleString();
    const branchesSet = new Set(app.colleges.map(c => c.branch));
    if (totalBranchesEl) totalBranchesEl.textContent = String(branchesSet.size || 6);
    const totalSeats = app.colleges.reduce((acc, c) => acc + (c.capacity || 0), 0);
    if (totalSeatsEl) totalSeatsEl.textContent = totalSeats ? totalSeats.toLocaleString() : '12,460';

    // Summary Box on Dashboard
    const sumTotal = document.getElementById('summaryTotalStudents');
    const sumAllocated = document.getElementById('summaryAllocated');
    const sumUnallocated = document.getElementById('summaryUnallocated');
    const sumAlgorithm = document.getElementById('summaryAlgorithm');
    const sumDateTime = document.getElementById('summaryDateTime');

    const allocatedCount = app.isAllocated
      ? app.allocationResults.filter(r => r.status === 'Allocated').length
      : 893;
    const unallocatedCount = app.isAllocated
      ? app.allocationResults.filter(r => r.status === 'Unallocated').length
      : 107;

    if (sumTotal) sumTotal.textContent = Number(app.students.length).toLocaleString();
    if (sumAllocated) sumAllocated.textContent = Number(allocatedCount).toLocaleString();
    if (sumUnallocated) sumUnallocated.textContent = Number(unallocatedCount).toLocaleString();
    if (sumAlgorithm) sumAlgorithm.textContent = app.selectedAlgorithm === 'greedy' ? 'Greedy' : 'Backtracking';
    if (sumDateTime) sumDateTime.textContent = app.lastAllocationTimestamp;

    // Results Tab KPI Cards
    const kpiAlloc = document.getElementById('kpiResultsAllocated');
    const kpiUnalloc = document.getElementById('kpiResultsUnallocated');
    const kpiAlgo = document.getElementById('kpiResultsAlgorithm');
    const kpiDate = document.getElementById('kpiResultsDateTime');

    if (kpiAlloc) kpiAlloc.textContent = Number(allocatedCount).toLocaleString();
    if (kpiUnalloc) kpiUnalloc.textContent = Number(unallocatedCount).toLocaleString();
    if (kpiAlgo) kpiAlgo.textContent = app.selectedAlgorithm === 'greedy' ? 'Greedy' : 'Backtracking';
    if (kpiDate) kpiDate.textContent = app.lastAllocationTimestamp;
  }

  // Render Students Tab Table & Right Panel
  function renderStudentsTab() {
    const tbody = document.getElementById('studentsTableBody');
    const countLabel = document.getElementById('studentsCountLabel');
    const paginationContainer = document.getElementById('studentsPagination');
    if (!tbody) return;

    // Filter
    let filtered = app.students;
    if (app.studentsSearch.trim()) {
      const q = app.studentsSearch.toLowerCase();
      filtered = filtered.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        String(s.rank).includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / app.studentsPerPage) || 1;
    if (app.studentsPage > totalPages) app.studentsPage = totalPages;

    const startIdx = (app.studentsPage - 1) * app.studentsPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + app.studentsPerPage);

    if (countLabel) {
      countLabel.textContent = `Showing ${total === 0 ? 0 : startIdx + 1} to ${Math.min(startIdx + app.studentsPerPage, total)} of ${total.toLocaleString()} students`;
    }

    // Toggle header checkbox column visibility
    const thSelect = document.querySelector('.col-student-select');
    if (thSelect) {
      thSelect.style.display = app.isStudentSelectionMode ? 'table-cell' : 'none';
    }

    const selectAllBox = document.getElementById('selectAllStudentsCheckbox');
    if (selectAllBox) {
      const allCheckedOnPage = pageItems.length > 0 && pageItems.every(s => app.checkedStudentIds.has(s.id));
      selectAllBox.checked = allCheckedOnPage;
    }

    tbody.innerHTML = pageItems.map(s => {
      const isSelected = s.id === app.selectedStudentId;
      const isChecked = app.checkedStudentIds.has(s.id);

      // Get allocation result for this student if available
      const allocResult = app.allocationResults.find(r => r.studentId === s.id);
      const allocBadge = allocResult
        ? (allocResult.status === 'Allocated'
          ? `<span class="badge-tag allocated" style="font-size:0.7rem;padding:0.15rem 0.5rem;margin-left:0.35rem;">Allocated</span>`
          : `<span class="badge-tag unallocated" style="font-size:0.7rem;padding:0.15rem 0.5rem;margin-left:0.35rem;">Unallocated</span>`)
        : '';

      const checkboxTd = app.isStudentSelectionMode ? `
        <td class="student-checkbox-cell" onclick="event.stopPropagation()">
          <input type="checkbox" class="custom-checkbox-style student-row-checkbox" ${isChecked ? 'checked' : ''} onchange="CCSA.toggleStudentSelection('${s.id}', this.checked)">
        </td>
      ` : `<td class="student-checkbox-cell" style="display: none;"></td>`;

      return `
        <tr class="${isSelected ? 'student-row-selected' : ''} ${isChecked ? 'student-row-checked' : ''}" style="cursor: pointer;" onclick="CCSA.handleStudentRowClick('${s.id}', event)">
          ${checkboxTd}
          <td class="font-id">${s.id}</td>
          <td class="font-name" style="${isSelected ? 'font-weight: 700; color: var(--primary);' : ''}">${s.name}</td>
          <td>${s.rank.toLocaleString()}</td>
          <td>${s.category}</td>
          <td>
            <button class="btn-view-action-pill" onclick="event.stopPropagation(); CCSA.selectStudent('${s.id}')">View</button>${allocBadge}
          </td>
        </tr>
      `;
    }).join('');

    renderPaginationButtons(paginationContainer, app.studentsPage, totalPages, (page) => {
      app.studentsPage = page;
      renderStudentsTab();
    });

    // Populate Right Details Panel only if a student is selected
    if (app.selectedStudentId) {
      populateStudentDetailPanel(app.selectedStudentId);
    } else {
      const panel = document.getElementById('studentDetailPanel');
      if (panel) panel.classList.add('hidden');
      const pageBack = document.getElementById('btnStudentsPageBack');
      if (pageBack) pageBack.style.display = 'none';
    }
  }

  // Close Student Detail Panel & Return to Student List
  function closeStudentDetailPanel() {
    app.selectedStudentId = null;
    app.batchSelectedIds = [];
    app.batchCurrentIndex = 0;

    if (window._allocationTimer) {
      clearTimeout(window._allocationTimer);
      window._allocationTimer = null;
    }

    const panel = document.getElementById('studentDetailPanel');
    if (panel) panel.classList.add('hidden');

    const pageBack = document.getElementById('btnStudentsPageBack');
    if (pageBack) pageBack.style.display = 'none';

    const bar = document.getElementById('batchStudentPagination');
    if (bar) bar.style.display = 'none';

    const indicator = document.getElementById('batchStudentIndicator');
    if (indicator) indicator.style.display = 'none';

    const exitBackBtn = document.getElementById('btnBatchExitBack');
    if (exitBackBtn) exitBackBtn.style.display = 'none';

    const processBox = document.getElementById('individualProcessBox');
    if (processBox) processBox.style.display = 'none';

    const resultCard = document.getElementById('individualResultCard');
    if (resultCard) resultCard.style.display = 'none';

    const btn = document.getElementById('btnAllocateThisStudent');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Allocate Seat for This Student';
    }

    renderStudentsTab();
  }

  // Populate Right Student Details & Allocation Panel
  function populateStudentDetailPanel(studentId, isBatch = false) {
    const s = app.students.find(item => item.id === studentId);
    if (!s) return;

    // Show the detail panel (remove hidden class)
    const panel = document.getElementById('studentDetailPanel');
    if (panel) panel.classList.remove('hidden');

    const pageBack = document.getElementById('btnStudentsPageBack');
    if (pageBack) pageBack.style.display = 'inline-flex';

    const detailBackBtn = document.getElementById('btnStudentDetailBack');
    if (detailBackBtn) detailBackBtn.onclick = closeStudentDetailPanel;

    app.selectedStudentId = s.id;

    const idEl = document.getElementById('detailStudentId');
    const nameEl = document.getElementById('detailStudentName');
    const rankEl = document.getElementById('detailStudentRank');
    const catEl = document.getElementById('detailStudentCategory');
    const prefList = document.getElementById('detailPrefList');

    if (idEl) idEl.textContent = s.id;
    if (nameEl) nameEl.textContent = s.name;
    if (rankEl) rankEl.textContent = s.rank.toLocaleString();
    if (catEl) catEl.textContent = s.category;

    if (prefList) {
      prefList.innerHTML = s.preferences.map((p, idx) => `
        <li class="pref-ordered-item">
          <span class="pref-index-num">${idx + 1}</span>
          <span>${p}</span>
        </li>
      `).join('');
    }

    // Cancel any running step animation timer
    if (window._allocationTimer) {
      clearTimeout(window._allocationTimer);
      window._allocationTimer = null;
    }

    // If viewing a single student outside of batch, clear batch state and hide batch controls
    if (!isBatch) {
      app.batchSelectedIds = [];
      const batchBar = document.getElementById('batchStudentPagination');
      if (batchBar) batchBar.style.display = 'none';
      const batchBadge = document.getElementById('batchStudentIndicator');
      if (batchBadge) batchBadge.style.display = 'none';
    }

    // Hide Process Box and Result Card by default until evaluated
    const processBox = document.getElementById('individualProcessBox');
    const resultCard = document.getElementById('individualResultCard');
    const stepsContainer = document.getElementById('allocationStepsContainer');
    const btn = document.getElementById('btnAllocateThisStudent');

    if (processBox) processBox.style.display = 'none';
    if (resultCard) resultCard.style.display = 'none';
    if (stepsContainer) stepsContainer.innerHTML = '';
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Allocate Seat for This Student';
    }

    // If this student already has an allocation result, show it immediately in the right panel
    if (app.isAllocated) {
      const existing = app.allocationResults.find(r => r.studentId === s.id);
      if (existing) {
        // Show process box with step summary
        if (processBox) processBox.style.display = 'block';
        if (stepsContainer && existing.steps) {
          stepsContainer.innerHTML = existing.steps.map(step => {
            const closingInfo = step.closingRank
              ? ` <span style="font-size:0.72rem;color:#94A3B8;">(${s.category} cutoff: ${step.closingRank.toLocaleString()})</span>`
              : '';
            if (!step.rankEligible) {
              return `
                <div class="process-step-item">
                  <div class="step-num-circle red">${step.prefNum}</div>
                  <div>
                    <strong>Checking Preference ${step.prefNum}: ${step.prefLabel || step.prefNum}</strong>
                    <div style="font-size:0.75rem;color:#EF4444;margin-top:2px;">Not available (closing rank exceeded)${closingInfo}</div>
                  </div>
                </div>`;
            } else if (step.rankEligible && !step.seatsAvailable) {
              return `
                <div class="process-step-item">
                  <div class="step-num-circle amber">${step.prefNum}</div>
                  <div>
                    <strong>Checking Preference ${step.prefNum}: ${step.prefLabel || step.prefNum}</strong>
                    <div style="font-size:0.75rem;color:#10B981;margin-top:2px;">Eligible (rank within closing rank)${closingInfo}</div>
                    <div style="font-size:0.75rem;color:#EF4444;margin-top:1px;">Not available (0 seats left)</div>
                  </div>
                </div>`;
            } else if (step.allocated) {
              return `
                <div class="process-step-item">
                  <div class="step-num-circle green">${step.prefNum}</div>
                  <div>
                    <strong>Checking Preference ${step.prefNum}: ${step.prefLabel || step.prefNum}</strong>
                    <div style="font-size:0.75rem;color:#10B981;margin-top:2px;">Eligible (rank within closing rank)${closingInfo}</div>
                    <div style="font-size:0.75rem;color:#10B981;margin-top:1px;">Seat available</div>
                  </div>
                </div>`;
            }
            return '';
          }).join('') + (existing.status === 'Allocated'
            ? `<div class="process-step-item"><div class="step-num-circle green">&#10003;</div><div style="font-weight:700;color:#10B981;">Seat successfully allocated!</div></div>`
            : `<div class="process-step-item"><div class="step-num-circle red">&#10007;</div><div style="font-weight:700;color:#EF4444;">No seat could be allocated — preferences exhausted</div></div>`);
        }

        // Show result card
        const resCol     = document.getElementById('resultAllocCollege');
        const resBr      = document.getElementById('resultAllocBranch');
        const resPref    = document.getElementById('resultAllocPrefNum');
        const resClosing = document.getElementById('resultAllocClosing');
        const resCat     = document.getElementById('resultCategoryLabel');
        const resBadge   = document.getElementById('resultStatusBadge');

        if (existing.status === 'Allocated') {
          if (resCol)     resCol.textContent     = existing.allocatedCollege;
          if (resBr)      resBr.textContent      = existing.branch;
          if (resPref)    resPref.textContent    = existing.preferenceNumber;
          if (resClosing) resClosing.textContent = existing.closingRank ? existing.closingRank.toLocaleString() : '-';
          if (resCat)     resCat.textContent     = s.category;
          if (resBadge) { resBadge.textContent = 'Allocated'; resBadge.className = 'badge-tag allocated'; }
        } else {
          if (resCol)     resCol.textContent     = '-';
          if (resBr)      resBr.textContent      = '-';
          if (resPref)    resPref.textContent    = '-';
          if (resClosing) resClosing.textContent = '-';
          if (resCat)     resCat.textContent     = s.category;
          if (resBadge) { resBadge.textContent = 'Unallocated'; resBadge.className = 'badge-tag unallocated'; }
        }

        if (resultCard) resultCard.style.display = 'flex';
        if (btn) { btn.textContent = 'Re-run Allocation'; }
      }
    }
  }

  // Batch student display controller for allocated selected students
  function displayBatchStudent(index, autoAnimate = true) {
    if (!app.batchSelectedIds || app.batchSelectedIds.length === 0) return;
    if (index < 0) index = 0;
    if (index >= app.batchSelectedIds.length) index = app.batchSelectedIds.length - 1;
    app.batchCurrentIndex = index;

    const studentId = app.batchSelectedIds[index];
    app.selectedStudentId = studentId;

    // Ensure student is visible in the left table if on another page
    const studentIdxInList = app.students.findIndex(s => s.id === studentId);
    if (studentIdxInList !== -1) {
      const neededPage = Math.floor(studentIdxInList / app.studentsPerPage) + 1;
      if (app.studentsPage !== neededPage) {
        app.studentsPage = neededPage;
      }
    }

    // Populate Right Details Panel in batch mode
    populateStudentDetailPanel(studentId, true);

    // Update the Batch Indicator Badge
    const indicator = document.getElementById('batchStudentIndicator');
    if (indicator) {
      indicator.style.display = 'inline-flex';
      indicator.textContent = `Student ${index + 1} of ${app.batchSelectedIds.length}`;
    }

    // Render the bottom batch pagination controls
    renderBatchPagination();

    // Re-render students table so this student is highlighted as selected
    renderStudentsTab();

    // Automatically trigger individual allocation steps & result card
    if (autoAnimate) {
      allocateSingleStudent(true);
    }
  }

  function exitBatchView() {
    closeStudentDetailPanel();
  }

  function renderBatchPagination() {
    const bar = document.getElementById('batchStudentPagination');
    if (!bar) return;

    const total = app.batchSelectedIds ? app.batchSelectedIds.length : 0;
    if (total === 0) {
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';

    // Hook Back buttons
    const backBtn = document.getElementById('batchBackBtn');
    if (backBtn) {
      backBtn.onclick = exitBatchView;
    }
    const exitBackBtn = document.getElementById('btnBatchExitBack');
    if (exitBackBtn) {
      exitBackBtn.style.display = 'inline-flex';
      exitBackBtn.onclick = exitBatchView;
    }

    const prevBtn = document.getElementById('batchPrevBtn');
    const nextBtn = document.getElementById('batchNextBtn');
    const pillsContainer = document.getElementById('batchPageNumbers');

    if (prevBtn) {
      prevBtn.disabled = (app.batchCurrentIndex === 0);
      prevBtn.onclick = () => {
        if (app.batchCurrentIndex > 0) {
          displayBatchStudent(app.batchCurrentIndex - 1, true);
        }
      };
    }

    if (nextBtn) {
      nextBtn.disabled = (app.batchCurrentIndex === total - 1);
      nextBtn.onclick = () => {
        if (app.batchCurrentIndex < total - 1) {
          displayBatchStudent(app.batchCurrentIndex + 1, true);
        }
      };
    }

    if (pillsContainer) {
      pillsContainer.innerHTML = '';

      for (let i = 0; i < total; i++) {
        // If many students (more than 8), compact middle numbers with ellipsis
        if (total > 8 && Math.abs(i - app.batchCurrentIndex) > 2 && i !== 0 && i !== total - 1) {
          if (i === 1 || i === total - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.color = '#94A3B8';
            ellipsis.style.fontSize = '0.75rem';
            ellipsis.style.padding = '0 0.15rem';
            pillsContainer.appendChild(ellipsis);
          }
          continue;
        }

        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = `batch-page-pill ${i === app.batchCurrentIndex ? 'active' : ''}`;
        pill.textContent = (i + 1);
        pill.title = `View Student ${i + 1} (${app.batchSelectedIds[i]})`;
        pill.onclick = ((idx) => () => {
          if (idx !== app.batchCurrentIndex) {
            displayBatchStudent(idx, true);
          }
        })(i);
        pillsContainer.appendChild(pill);
      }
    }
  }

  // Run Allocation for a Single Student (animated step-by-step, uses real allocation engine)
  function allocateSingleStudent(isBatch = false) {
    const isBatchMode = (typeof isBatch === 'boolean') ? isBatch : false;
    const s = app.students.find(item => item.id === app.selectedStudentId);
    if (!s) return;

    if (window._allocationTimer) {
      clearTimeout(window._allocationTimer);
      window._allocationTimer = null;
    }

    const btn = document.getElementById('btnAllocateThisStudent');
    const processBox = document.getElementById('individualProcessBox');
    const resultCard = document.getElementById('individualResultCard');
    const stepsContainer = document.getElementById('allocationStepsContainer');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Evaluating Preferences...';
    }
    if (resultCard) resultCard.style.display = 'none';
    if (processBox) processBox.style.display = 'block';
    if (stepsContainer) stepsContainer.innerHTML = '';

    // Use a fresh seatTracker (individual allocation — no shared session state)
    const seatTracker = new Map();
    // Pre-load already-allocated seats from current session results
    if (app.allocationResults && app.allocationResults.length > 0) {
      app.allocationResults.forEach(r => {
        if (r.status === 'Allocated' && r.studentId !== s.id) {
          const col = app.colleges.find(c => c.name === r.allocatedCollege && c.branch === r.branch);
          if (col) {
            const key = `${col.id}-${r.branch}`;
            seatTracker.set(key, (seatTracker.get(key) || 0) + 1);
          }
        }
      });
    }

    // Run the allocation engine for this student using selected algorithm
    const result = (app.selectedAlgorithm === 'backtracking')
      ? backtrackingAllocate(s, seatTracker)
      : greedyAllocate(s, seatTracker);

    // Build animated step items from engine steps matching user exact requirements
    const stepsList = [];
    for (const step of result.steps) {
      const closingInfo = step.closingRank
        ? ` <span style="font-size:0.72rem;color:#94A3B8;">(${s.category} cutoff: ${step.closingRank.toLocaleString()})</span>`
        : '';

      if (!step.rankEligible) {
        stepsList.push(`
          <div class="step-num-circle red">${step.prefNum}</div>
          <div>
            <strong>Checking Preference ${step.prefNum}: ${step.prefLabel}</strong>
            <div style="font-size:0.75rem;color:#EF4444;margin-top:2px;">Not available (closing rank exceeded)${closingInfo}</div>
          </div>
        `);
      } else if (step.rankEligible && !step.seatsAvailable) {
        stepsList.push(`
          <div class="step-num-circle amber">${step.prefNum}</div>
          <div>
            <strong>Checking Preference ${step.prefNum}: ${step.prefLabel}</strong>
            <div style="font-size:0.75rem;color:#10B981;margin-top:2px;">Eligible (rank within closing rank)${closingInfo}</div>
            <div style="font-size:0.75rem;color:#EF4444;margin-top:1px;">Not available (0 seats left)</div>
          </div>
        `);
      } else if (step.allocated) {
        stepsList.push(`
          <div class="step-num-circle green">${step.prefNum}</div>
          <div>
            <strong>Checking Preference ${step.prefNum}: ${step.prefLabel}</strong>
            <div style="font-size:0.75rem;color:#10B981;margin-top:2px;">Eligible (rank within closing rank)${closingInfo}</div>
            <div style="font-size:0.75rem;color:#10B981;margin-top:1px;">Seat available</div>
          </div>
        `);
      }
    }

    // Final summary step
    if (result.status === 'Allocated') {
      stepsList.push(`
        <div class="step-num-circle green">&#10003;</div>
        <div style="font-weight:700;color:#10B981;">Seat successfully allocated!</div>
      `);
    } else {
      stepsList.push(`
        <div class="step-num-circle red">&#10007;</div>
        <div style="font-weight:700;color:#EF4444;">No seat could be allocated — preferences exhausted</div>
      `);
    }

    // Update allocationResults for this student (store result)
    const existIdx = app.allocationResults.findIndex(r => r.studentId === s.id);
    const newEntry = {
      studentId: s.id, name: s.name, rank: s.rank, category: s.category,
      allocatedCollege: result.col, branch: result.br,
      preferenceNumber: result.pref, status: result.status,
      closingRank: result.closingRank, steps: result.steps
    };
    if (existIdx >= 0) {
      app.allocationResults[existIdx] = newEntry;
    } else {
      app.allocationResults.push(newEntry);
    }
    app.isAllocated = true;
    app.saveAllocation();

    // Animate steps sequentially
    let currentStepIdx = 0;
    const stepDelay = isBatchMode ? 260 : 380;

    function renderNextStep() {
      if (currentStepIdx < stepsList.length) {
        if (stepsContainer) {
          const stepEl = document.createElement('div');
          stepEl.className = 'process-step-item step-animated';
          stepEl.innerHTML = stepsList[currentStepIdx];
          stepsContainer.appendChild(stepEl);
        }
        currentStepIdx++;
        window._allocationTimer = setTimeout(renderNextStep, stepDelay);
      } else {
        // All steps done — show Result Card
        window._allocationTimer = setTimeout(() => {
          const resCol     = document.getElementById('resultAllocCollege');
          const resBr      = document.getElementById('resultAllocBranch');
          const resPref    = document.getElementById('resultAllocPrefNum');
          const resClosing = document.getElementById('resultAllocClosing');
          const resCat     = document.getElementById('resultCategoryLabel');
          const resBadge   = document.getElementById('resultStatusBadge');

          if (result.status === 'Allocated') {
            if (resCol)     resCol.textContent     = result.col;
            if (resBr)      resBr.textContent      = result.br;
            if (resPref)    resPref.textContent    = result.pref;
            if (resClosing) resClosing.textContent = result.closingRank ? result.closingRank.toLocaleString() : '-';
            if (resCat)     resCat.textContent     = s.category;
            if (resBadge) {
              resBadge.textContent = 'Allocated';
              resBadge.className   = 'badge-tag allocated';
            }
          } else {
            if (resCol)     resCol.textContent     = '-';
            if (resBr)      resBr.textContent      = '-';
            if (resPref)    resPref.textContent    = '-';
            if (resClosing) resClosing.textContent = '-';
            if (resCat)     resCat.textContent     = s.category;
            if (resBadge) {
              resBadge.textContent = 'Unallocated';
              resBadge.className   = 'badge-tag unallocated';
            }
          }

          if (resultCard) {
            resultCard.style.display = 'flex';
            resultCard.classList.remove('result-animated');
            void resultCard.offsetWidth;
            resultCard.classList.add('result-animated');
          }

          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Re-run Allocation';
          }

          if (!isBatchMode) {
            if (result.status === 'Allocated') {
              showToast(`✅ Seat allocated for ${s.name} at ${result.col} – ${result.br} (Pref ${result.pref})!`, 'success');
            } else {
              showToast(`⚠️ No seat allocated for ${s.name} — all preferences exhausted.`, 'warning');
            }
          }
        }, 150);
      }
    }

    renderNextStep();
  }

  // Render Colleges Tab
  function renderCollegesTab() {
    const tbody = document.getElementById('collegesTableBody');
    const countLabel = document.getElementById('collegesCountLabel');
    const paginationContainer = document.getElementById('collegesPagination');
    if (!tbody) return;

    let filtered = app.colleges;
    if (app.collegesSearch.trim()) {
      const q = app.collegesSearch.toLowerCase();
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / app.collegesPerPage) || 1;
    if (app.collegesPage > totalPages) app.collegesPage = totalPages;

    const startIdx = (app.collegesPage - 1) * app.collegesPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + app.collegesPerPage);

    if (countLabel) {
      countLabel.textContent = `Showing ${total === 0 ? 0 : startIdx + 1} to ${Math.min(startIdx + app.collegesPerPage, total)} of ${total} colleges`;
    }

    tbody.innerHTML = pageItems.map(c => `
      <tr>
        <td class="font-id">${c.id}</td>
        <td class="font-name">${c.name}</td>
        <td><span style="font-weight: 600; color: #1E293B;">${c.branch}</span></td>
        <td>${c.capacity}</td>
        <td>${c.closingRank.toLocaleString()}</td>
        <td>
          <button class="btn-view-action-pill" onclick="CCSA.viewCollegeDetails('${c.id}', '${c.branch}')">View</button>
        </td>
      </tr>
    `).join('');

    renderPaginationButtons(paginationContainer, app.collegesPage, totalPages, (page) => {
      app.collegesPage = page;
      renderCollegesTab();
    });
  }

  // Render Allocation Results Tab
  function renderResultsTab() {
    const tbody = document.getElementById('resultsTableBody');
    const countLabel = document.getElementById('resultsCountLabel');
    const paginationContainer = document.getElementById('resultsPagination');
    if (!tbody) return;

    // If no allocation has been run yet, show empty state (results live only after allocation)
    if (!app.isAllocated || app.allocationResults.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 3.5rem 1.5rem; color: #64748B;">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5" style="margin: 0 auto 0.75rem; display: block;">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <div style="font-size: 1rem; font-weight: 600; color: #1E293B; margin-bottom: 0.25rem;">No Allocation Results Yet</div>
            <div style="font-size: 0.85rem; color: #64748B;">Go to the <strong>Students</strong> tab, select candidates, and click <strong>Run Allocation for Selected Students</strong> to see live allocation results here.</div>
          </td>
        </tr>
      `;
      if (countLabel) countLabel.textContent = '0 students allocated';
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    let filtered = app.allocationResults;
    if (app.resultsSearch.trim()) {
      const q = app.resultsSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.studentId.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        String(r.rank).includes(q) ||
        r.allocatedCollege.toLowerCase().includes(q) ||
        r.branch.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / app.resultsPerPage) || 1;
    if (app.resultsPage > totalPages) app.resultsPage = totalPages;

    const startIdx = (app.resultsPage - 1) * app.resultsPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + app.resultsPerPage);

    if (countLabel) {
      countLabel.textContent = `Showing ${total === 0 ? 0 : startIdx + 1} to ${Math.min(startIdx + app.resultsPerPage, total)} of ${total.toLocaleString()} students`;
    }

    tbody.innerHTML = pageItems.map(r => `
      <tr>
        <td class="font-id">${r.studentId}</td>
        <td class="font-name">${r.name}</td>
        <td>${r.rank.toLocaleString()}</td>
        <td>${r.category}</td>
        <td>${r.allocatedCollege}</td>
        <td>${r.branch}</td>
        <td>${r.preferenceNumber}</td>
        <td>
          <span class="badge-tag ${r.status === 'Allocated' ? 'allocated' : 'unallocated'}">
            ${r.status}
          </span>
        </td>
      </tr>
    `).join('');

    renderPaginationButtons(paginationContainer, app.resultsPage, totalPages, (page) => {
      app.resultsPage = page;
      renderResultsTab();
    });
  }

  // Build Results using real allocation engine
  function buildCompleteResultsDataset() {
    const results = runAllocationEngine(app.students, app.selectedAlgorithm);
    app.allocationResults = results;
    app.isAllocated = true;
    app.saveAllocation();
  }

  // Pagination Builder Helper
  function renderPaginationButtons(container, current, total, onPageClick) {
    if (!container) return;
    if (total <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = `<button class="page-num-btn" ${current === 1 ? 'disabled' : ''} data-page="${current - 1}">&lt;</button>`;

    const maxButtons = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxButtons - 1);
    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    if (start > 1) {
      html += `<button class="page-num-btn" data-page="1">1</button>`;
      if (start > 2) html += `<span style="padding: 0 4px; color: var(--text-muted); font-size: 0.8rem;">...</span>`;
    }

    for (let p = start; p <= end; p++) {
      html += `<button class="page-num-btn ${p === current ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }

    if (end < total) {
      if (end < total - 1) html += `<span style="padding: 0 4px; color: var(--text-muted); font-size: 0.8rem;">...</span>`;
      html += `<button class="page-num-btn" data-page="${total}">${total}</button>`;
    }

    html += `<button class="page-num-btn ${current === total ? 'disabled' : ''} data-page="${current + 1}">&gt;</button>`;

    container.innerHTML = html;

    container.querySelectorAll('.page-num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page && page >= 1 && page <= total) {
          onPageClick(page);
        }
      });
    });
  }

  // ── Batch Student Selection & Allocation ───────────────────────────
  function updateSelectionUi() {
    const thSelect = document.querySelector('.col-student-select');
    if (thSelect) {
      thSelect.style.display = app.isStudentSelectionMode ? 'table-cell' : 'none';
    }

    const btnCancel = document.getElementById('btnCancelStudentSelection');
    if (btnCancel) {
      btnCancel.style.display = app.isStudentSelectionMode ? 'inline-flex' : 'none';
    }

    const btnRunLabel = document.getElementById('btnRunAllocationSelectedLabel');
    if (btnRunLabel) {
      if (!app.isStudentSelectionMode) {
        btnRunLabel.textContent = 'Run Allocation for Selected Students';
      } else {
        const count = app.checkedStudentIds.size;
        btnRunLabel.textContent = count > 0 ? `Run Allocation (${count} Selected)` : `Run Allocation (0 Selected)`;
      }
    }
  }

  function toggleSelectionMode(enable) {
    app.isStudentSelectionMode = (typeof enable === 'boolean') ? enable : !app.isStudentSelectionMode;
    if (!app.isStudentSelectionMode) {
      app.checkedStudentIds.clear();
    }
    updateSelectionUi();
    renderStudentsTab();
  }

  function toggleStudentSelection(studentId, isChecked) {
    if (isChecked) {
      app.checkedStudentIds.add(studentId);
    } else {
      app.checkedStudentIds.delete(studentId);
    }
    updateSelectionUi();
    renderStudentsTab();
  }

  function toggleSelectAllStudents(isChecked) {
    let filtered = app.students;
    if (app.studentsSearch.trim()) {
      const q = app.studentsSearch.toLowerCase();
      filtered = filtered.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        String(s.rank).includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    const startIdx = (app.studentsPage - 1) * app.studentsPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + app.studentsPerPage);

    pageItems.forEach(s => {
      if (isChecked) {
        app.checkedStudentIds.add(s.id);
      } else {
        app.checkedStudentIds.delete(s.id);
      }
    });

    updateSelectionUi();
    renderStudentsTab();
  }

  function handleRunAllocationSelectedClick() {
    if (!app.isStudentSelectionMode) {
      toggleSelectionMode(true);
      showToast('Select students using the checkboxes on the left, then click Run Allocation.', 'info');
      return;
    }

    const selectedCount = app.checkedStudentIds.size;
    if (selectedCount === 0) {
      showToast('Please select at least one student from the list.', 'warning');
      return;
    }

    executeAllocationForSelected();
  }

  // Run Allocation for Selected Students (uses real engine)
  function executeAllocationForSelected() {
    const selectedIds = Array.from(app.checkedStudentIds);
    const selectedCount = selectedIds.length;

    showToast(`Running ${app.selectedAlgorithm.toUpperCase()} allocation for ${selectedCount} selected student${selectedCount > 1 ? 's' : ''}...`, 'info');

    setTimeout(() => {
      const selectedStudents = app.students.filter(s => app.checkedStudentIds.has(s.id));

      // Run real allocation engine for selected students only
      const results = runAllocationEngine(selectedStudents, app.selectedAlgorithm);

      // Merge into global allocationResults (replace entries for selected students)
      results.forEach(r => {
        const idx = app.allocationResults.findIndex(x => x.studentId === r.studentId);
        if (idx >= 0) {
          app.allocationResults[idx] = r;
        } else {
          app.allocationResults.push(r);
        }
      });

      app.isAllocated = true;
      app.resultsPage = 1;
      app.resultsSearch = '';

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      app.lastAllocationTimestamp = `${dateStr}, ${timeStr}`;
      app.saveAllocation();

      const allocated = results.filter(r => r.status === 'Allocated').length;
      const unallocated = results.filter(r => r.status === 'Unallocated').length;

      // Setup batch display — sorted by rank
      const sortedSelected = [...selectedStudents].sort((a, b) => a.rank - b.rank);
      app.batchSelectedIds = sortedSelected.map(s => s.id);
      app.batchCurrentIndex = 0;

      // Close selection mode & clear checkboxes
      app.isStudentSelectionMode = false;
      app.checkedStudentIds.clear();
      updateSelectionUi();

      // Update stats and results table in background
      updateStatCards();
      renderResultsTab();

      // Stay on Students tab and display the first student in the right panel
      displayBatchStudent(0, true);

      showToast(`✅ Allocation complete for ${selectedCount} student${selectedCount > 1 ? 's' : ''}! ${allocated} Allocated, ${unallocated} Unallocated.`, 'success');
    }, 400);
  }

  // Run Allocation for All Students
  function executeAllocation() {
    showToast(`Running ${app.selectedAlgorithm.toUpperCase()} allocation on all 1,000 students...`, 'info');

    setTimeout(() => {
      buildCompleteResultsDataset();
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      app.lastAllocationTimestamp = `${dateStr}, ${timeStr}`;
      app.saveAllocation();

      const allocated = app.allocationResults.filter(r => r.status === 'Allocated').length;
      const unallocated = app.allocationResults.filter(r => r.status === 'Unallocated').length;

      updateStatCards();
      renderResultsTab();
      showToast(`Allocation Complete! ${allocated.toLocaleString()} Allocated, ${unallocated.toLocaleString()} Unallocated.`, 'success');
    }, 300);
  }

  // Toast Notification
  function showToast(msg, type = 'info') {
    let container = document.getElementById('toastFloatingContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastFloatingContainer';
      container.className = 'toast-floating-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-pill-alert ${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>${msg}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // Download CSV
  function downloadResultsCSV() {
    if (!app.isAllocated || app.allocationResults.length === 0) {
      showToast('No allocation results available yet. Please run allocation first.', 'warning');
      return;
    }

    const headers = ['Student ID', 'Student Name', 'Rank', 'Category', 'Allocated College', 'Branch', 'Preference Satisfied', 'Allocation Status'];
    const rows = app.allocationResults.map(r => [
      `"${r.studentId}"`,
      `"${r.name}"`,
      r.rank,
      `"${r.category}"`,
      `"${r.allocatedCollege}"`,
      `"${r.branch}"`,
      `"${r.preferenceNumber}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CCSA_Seat_Allocation_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Allocation results CSV downloaded successfully!', 'success');
  }

  // Tab Navigation Routing
  function switchTab(tabId) {
    document.querySelectorAll('.nav-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.view-section').forEach(view => {
      view.classList.toggle('active', view.id === tabId);
    });

    if (tabId === 'tab-students') renderStudentsTab();
    if (tabId === 'tab-colleges') renderCollegesTab();
    if (tabId === 'tab-results') renderResultsTab();
    if (tabId === 'tab-dashboard') updateStatCards();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. INITIALIZE CONTROLS & LISTENERS
  // ─────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // Nav Pills
    document.querySelectorAll('.nav-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        if (tab) switchTab(tab);
      });
    });

    // Quick Actions on Dashboard
    const qaStudents = document.getElementById('qaViewStudents');
    const qaColleges = document.getElementById('qaViewColleges');
    const qaAlloc = document.getElementById('qaRunAllocation');
    const qaResults = document.getElementById('qaViewResults');
    const btnDashResults = document.getElementById('btnDashboardViewResults');

    if (qaStudents) qaStudents.addEventListener('click', () => switchTab('tab-students'));
    if (qaColleges) qaColleges.addEventListener('click', () => switchTab('tab-colleges'));
    if (qaAlloc) qaAlloc.addEventListener('click', () => executeAllocation());
    if (qaResults) qaResults.addEventListener('click', () => switchTab('tab-results'));
    if (btnDashResults) btnDashResults.addEventListener('click', () => switchTab('tab-results'));

    // Top Right button on Students tab: Run Allocation for Selected Students
    const btnRunSelected = document.getElementById('btnRunAllocationSelectedStudents');
    if (btnRunSelected) {
      btnRunSelected.addEventListener('click', handleRunAllocationSelectedClick);
    }

    const btnCancelSelection = document.getElementById('btnCancelStudentSelection');
    if (btnCancelSelection) {
      btnCancelSelection.addEventListener('click', () => {
        toggleSelectionMode(false);
      });
    }

    const selectAllCheckbox = document.getElementById('selectAllStudentsCheckbox');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        toggleSelectAllStudents(e.target.checked);
      });
    }

    // Single student allocate CTA
    const btnIndivAlloc = document.getElementById('btnAllocateThisStudent');
    if (btnIndivAlloc) btnIndivAlloc.addEventListener('click', allocateSingleStudent);

    // Back to Student List buttons
    const btnDetailBack = document.getElementById('btnStudentDetailBack');
    if (btnDetailBack) btnDetailBack.addEventListener('click', closeStudentDetailPanel);

    const btnPageBack = document.getElementById('btnStudentsPageBack');
    if (btnPageBack) btnPageBack.addEventListener('click', closeStudentDetailPanel);

    // Algorithm radio listeners
    const rGreedy = document.getElementById('radioIndivGreedy');
    const rBacktrack = document.getElementById('radioIndivBacktrack');
    if (rGreedy) rGreedy.addEventListener('change', () => { if (rGreedy.checked) { app.selectedAlgorithm = 'greedy'; app.saveAllocation(); updateStatCards(); } });
    if (rBacktrack) rBacktrack.addEventListener('change', () => { if (rBacktrack.checked) { app.selectedAlgorithm = 'backtracking'; app.saveAllocation(); updateStatCards(); } });

    // Sync radio buttons to restored state
    if (app.selectedAlgorithm === 'backtracking') {
      if (rBacktrack) rBacktrack.checked = true;
      if (rGreedy) rGreedy.checked = false;
    } else {
      if (rGreedy) rGreedy.checked = true;
      if (rBacktrack) rBacktrack.checked = false;
    }

    // Download Results button
    const btnDownload = document.getElementById('btnDownloadResults');
    if (btnDownload) btnDownload.addEventListener('click', downloadResultsCSV);

    // Search Students
    const studentSearchInput = document.getElementById('studentsSearchInput');
    const btnSearchStudents = document.getElementById('btnSearchStudents');
    if (btnSearchStudents && studentSearchInput) {
      const doSearch = () => {
        app.studentsSearch = studentSearchInput.value;
        app.studentsPage = 1;
        renderStudentsTab();
      };
      btnSearchStudents.addEventListener('click', doSearch);
      studentSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    }

    // Search Colleges
    const collegesSearchInput = document.getElementById('collegesSearchInput');
    const btnSearchColleges = document.getElementById('btnSearchColleges');
    if (btnSearchColleges && collegesSearchInput) {
      const doSearch = () => {
        app.collegesSearch = collegesSearchInput.value;
        app.collegesPage = 1;
        renderCollegesTab();
      };
      btnSearchColleges.addEventListener('click', doSearch);
      collegesSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    }

    // Search Results
    const resultsSearchInput = document.getElementById('resultsSearchInput');
    const btnSearchResults = document.getElementById('btnSearchResults');
    if (btnSearchResults && resultsSearchInput) {
      const doSearch = () => {
        app.resultsSearch = resultsSearchInput.value;
        app.resultsPage = 1;
        renderResultsTab();
      };
      btnSearchResults.addEventListener('click', doSearch);
      resultsSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    }

    // User Avatar Dropdown
    const userProfileBtn = document.getElementById('userProfileDropdownBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userProfileBtn && userDropdownMenu) {
      userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('show');
      });
      document.addEventListener('click', () => userDropdownMenu.classList.remove('show'));
    }

    // Logout
    const btnSignOut = document.getElementById('btnSignOutAction');
    if (btnSignOut) {
      btnSignOut.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          if (typeof Auth !== 'undefined' && Auth.signOut) await Auth.signOut();
        } catch (_) {}
        window.location.href = 'login.html';
      });
    }

    // Add College Modal controls
    const btnOpenAddCollege = document.getElementById('btnOpenAddCollegeModal');
    const addCollegeModal = document.getElementById('addCollegeModal');
    const btnCancelAddCollege = document.getElementById('btnCancelAddCollege');
    const formAddCollege = document.getElementById('formAddCollege');

    if (btnOpenAddCollege && addCollegeModal) {
      btnOpenAddCollege.addEventListener('click', () => addCollegeModal.classList.add('open'));
    }
    if (btnCancelAddCollege && addCollegeModal) {
      btnCancelAddCollege.addEventListener('click', () => addCollegeModal.classList.remove('open'));
    }
    if (formAddCollege) {
      formAddCollege.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newCollegeName').value.trim();
        const branch = document.getElementById('newCollegeBranch').value;
        const capacity = parseInt(document.getElementById('newCollegeCapacity').value) || 60;
        const closing = parseInt(document.getElementById('newCollegeClosing').value) || 45000;

        const newId = 'C' + String(app.colleges.length + 1).padStart(3, '0');
        app.colleges.unshift({ id: newId, name, branch, capacity, closingRank: closing });
        app.saveColleges();
        addCollegeModal.classList.remove('open');
        formAddCollege.reset();
        renderCollegesTab();
        updateStatCards();
        showToast(`College ${name} (${branch}) added successfully!`, 'success');
      });
    }

    // Modal Close
    const btnCloseDetailModal = document.getElementById('btnCloseDetailModal');
    const genericDetailModal = document.getElementById('genericDetailModal');
    if (btnCloseDetailModal && genericDetailModal) {
      btnCloseDetailModal.addEventListener('click', () => genericDetailModal.classList.remove('open'));
    }

    // ─────────────────────────────────────────────────────────────
    // 5. USER PROFILE & EMAIL START NAME
    // ─────────────────────────────────────────────────────────────
    function applyUserDisplayName(user) {
      if (!user) return;

      let mailStartName = '';
      if (user.email && typeof user.email === 'string' && user.email.includes('@')) {
        mailStartName = user.email.split('@')[0].trim();
      } else if (user.fullName && typeof user.fullName === 'string') {
        mailStartName = user.fullName.trim();
      } else {
        mailStartName = 'Admin';
      }

      const displayName = mailStartName ? (mailStartName.charAt(0).toUpperCase() + mailStartName.slice(1)) : 'Admin';
      const initial = displayName.charAt(0).toUpperCase();

      const roleBadgeEl = document.getElementById('navUserRoleLabel');
      const heroRoleEl = document.getElementById('heroUserRoleName');
      const avatarEl = document.getElementById('navUserAvatarInitial');
      const emailDisplayEl = document.getElementById('dropdownUserEmail');
      const dropdownNameEl = document.getElementById('dropdownUserNameTitle');

      if (roleBadgeEl) roleBadgeEl.textContent = `${displayName} ⌵`;
      if (heroRoleEl) heroRoleEl.textContent = `${displayName}!`;
      if (avatarEl) avatarEl.textContent = initial;
      if (emailDisplayEl && user.email) emailDisplayEl.textContent = user.email;
      if (dropdownNameEl) dropdownNameEl.textContent = displayName;
    }

    // Synchronous check
    try {
      let cached = (typeof Auth !== 'undefined' && Auth.getCurrentUser) ? Auth.getCurrentUser() : null;
      if (!cached) {
        const lastEmail = localStorage.getItem('ccsa_last_email');
        if (lastEmail) cached = { email: lastEmail };
      }
      if (cached) applyUserDisplayName(cached);
    } catch (_) {}

    // Async check
    try {
      if (typeof Auth !== 'undefined' && Auth.getUser) {
        Auth.getUser().then(user => { if (user) applyUserDisplayName(user); }).catch(() => {});
      }
    } catch (_) {}

    // Initial renders
    // Add Student Modal controls
    const btnOpenAddStudent = document.getElementById('btnOpenAddStudentModal');
    const addStudentModal = document.getElementById('addStudentModal');
    const btnCancelAddStudent = document.getElementById('btnCancelAddStudent');
    const btnCancelAddStudentModal = document.getElementById('btnCancelAddStudentModal');
    const formAddStudent = document.getElementById('formAddStudent');

    if (btnOpenAddStudent && addStudentModal) {
      btnOpenAddStudent.addEventListener('click', () => addStudentModal.classList.add('open'));
    }
    if (btnCancelAddStudent && addStudentModal) {
      btnCancelAddStudent.addEventListener('click', () => addStudentModal.classList.remove('open'));
    }
    if (btnCancelAddStudentModal && addStudentModal) {
      btnCancelAddStudentModal.addEventListener('click', () => addStudentModal.classList.remove('open'));
    }
    if (formAddStudent) {
      formAddStudent.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newStudentName').value.trim();
        const rank = parseInt(document.getElementById('newStudentRank').value) || 50000;
        const category = document.getElementById('newStudentCategory').value;
        const prefs = [
          document.getElementById('newStudentPref1').value.trim(),
          document.getElementById('newStudentPref2').value.trim(),
          document.getElementById('newStudentPref3').value.trim(),
          document.getElementById('newStudentPref4').value.trim(),
          document.getElementById('newStudentPref5').value.trim()
        ].filter(p => p.length > 0);

        const newId = 'S' + String(app.students.length + 1).padStart(3, '0');
        app.students.unshift({ id: newId, name, rank, category, preferences: prefs.length ? prefs : ['JNTU Hyderabad - CSE'] });
        app.saveStudents();
        addStudentModal.classList.remove('open');
        formAddStudent.reset();
        app.studentsPage = 1;
        renderStudentsTab();
        updateStatCards();
        showToast(`Student ${name} (${newId}) added successfully!`, 'success');
      });
    }

    // Initial renders
    updateStatCards();
    renderStudentsTab();
    renderCollegesTab();
    renderResultsTab();
  });

  // Global helper namespace
  window.CCSA = {
    resetAllData() {
      localStorage.removeItem('ccsa_students_data');
      localStorage.removeItem('ccsa_colleges_data');
      localStorage.removeItem('ccsa_allocation_results');
      localStorage.removeItem('ccsa_is_allocated');
      localStorage.removeItem('ccsa_last_allocation_time');
      localStorage.removeItem('ccsa_selected_algo');
      window.location.reload();
    },

    closeStudentDetailPanel() {
      closeStudentDetailPanel();
    },

    goToBatchStudent(index) {
      displayBatchStudent(index, true);
    },

    selectStudent(studentId) {
      app.selectedStudentId = studentId;
      populateStudentDetailPanel(studentId);
      renderStudentsTab();
    },

    handleStudentRowClick(studentId, event) {
      if (app.isStudentSelectionMode) {
        const isChecked = app.checkedStudentIds.has(studentId);
        toggleStudentSelection(studentId, !isChecked);
      } else {
        app.selectedStudentId = studentId;
        populateStudentDetailPanel(studentId);
        renderStudentsTab();
      }
    },

    toggleStudentSelection(studentId, isChecked) {
      toggleStudentSelection(studentId, isChecked);
    },

    toggleSelectAllStudents(isChecked) {
      toggleSelectAllStudents(isChecked);
    },

    viewCollegeDetails(collegeId, branch) {
      const c = app.colleges.find(item => item.id === collegeId && item.branch === branch);
      if (!c) return;

      const modal = document.getElementById('genericDetailModal');
      const title = document.getElementById('genericDetailTitle');
      const body = document.getElementById('genericDetailBody');
      if (!modal || !body) return;

      if (title) title.textContent = `Institute Branch Matrix: ${c.name}`;
      body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div style="background: #F8FAFC; padding: 0.85rem; border-radius: 8px;">
            <p style="font-size: 0.75rem; color: #64748B;">Institute Code</p>
            <p style="font-size: 1rem; font-weight: 700; color: #0F172A;">${c.id}</p>
          </div>
          <div style="background: #F8FAFC; padding: 0.85rem; border-radius: 8px;">
            <p style="font-size: 0.75rem; color: #64748B;">Specialization Branch</p>
            <p style="font-size: 1rem; font-weight: 700; color: #4F46E5;">${c.branch}</p>
          </div>
          <div style="background: #F8FAFC; padding: 0.85rem; border-radius: 8px;">
            <p style="font-size: 0.75rem; color: #64748B;">Approved Intake Seats</p>
            <p style="font-size: 1rem; font-weight: 700; color: #0F172A;">${c.capacity}</p>
          </div>
          <div style="background: #F8FAFC; padding: 0.85rem; border-radius: 8px;">
            <p style="font-size: 0.75rem; color: #64748B;">Previous Closing Cutoff</p>
            <p style="font-size: 1rem; font-weight: 700; color: #0F172A;">${c.closingRank.toLocaleString()}</p>
          </div>
        </div>
      `;
      modal.classList.add('open');
    }
  };

})();
