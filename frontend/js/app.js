// app.js - Main Application Orchestrator and UI Controller (TS EAMCET & JoSAA/NEET)

document.addEventListener("DOMContentLoaded", async () => {
  const visualizer = new AllocationVisualizer();
  let latestRunResult = null;
  let activeAlgorithm = "greedy";

  // View States for Pagination & Filtering
  const studentViewState = { page: 1, pageSize: 25, search: "", category: "ALL", sort: "rank-asc" };
  const cutoffViewState = { page: 1, pageSize: 25, search: "", district: "ALL", branch: "ALL" };
  const capacityViewState = { page: 1, pageSize: 25, search: "", district: "ALL", branch: "ALL" };
  const allotmentViewState = { page: 1, pageSize: 25, search: "", status: "ALL", category: "ALL" };

  // --- INITIALIZE DATASETS ---
  if (window.eamcetManager) {
    await window.eamcetManager.init();
    populateEamcetFilters();
  }

  // --- TAB NAVIGATION ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTabId = btn.getAttribute("data-tab");
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) targetPane.classList.add("active");

      // Auto refresh views when tabs change
      if (targetTabId === "tab-data-mgmt") {
        renderStudentsDatasetTable();
        renderCutoffsDatasetTable();
        renderCapacityDatasetTable();
      }
      if (targetTabId === "tab-colleges") renderSeatMatrix();
      if (targetTabId === "tab-candidates") renderCandidates();
      if (targetTabId === "tab-rounds") renderRoundDecisions();
      if (targetTabId === "tab-analytics") renderAnalytics();
      if (targetTabId === "tab-algorithms") {
        if (latestRunResult?.backtracking?.stateSpaceTree) {
          AllocationVisualizer.renderTree("stateTreeCanvas", latestRunResult.backtracking.stateSpaceTree);
        }
      }
    });
  });

  // --- DATA MANAGEMENT SUB-NAV PILLS ---
  const subPills = document.querySelectorAll("#dataMgmtPills .sub-pill-btn");
  const subPanes = document.querySelectorAll(".data-sub-pane");

  subPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const subTarget = pill.getAttribute("data-sub");
      subPills.forEach(p => p.classList.remove("active"));
      subPanes.forEach(pane => pane.style.display = "none");

      pill.classList.add("active");
      const activePane = document.getElementById(subTarget);
      if (activePane) activePane.style.display = "block";

      if (subTarget === "sub-students") renderStudentsDatasetTable();
      if (subTarget === "sub-cutoffs") renderCutoffsDatasetTable();
      if (subTarget === "sub-capacity") renderCapacityDatasetTable();
    });
  });

  // --- PRESET SELECTOR & RESET ---
  const presetSelect = document.getElementById("presetSelect");
  presetSelect.addEventListener("change", (e) => {
    const key = e.target.value;
    window.appState.loadPreset(key);
    runAllocationInstant();
  });

  document.getElementById("btnResetData").addEventListener("click", () => {
    window.appState.loadPreset(presetSelect.value);
    if (presetSelect.value === "ts_eamcet" && window.eamcetManager) {
      window.eamcetManager.resetRemainingSeats();
    }
    runAllocationInstant();
    alert("Dataset reset to original state.");
  });

  // --- ALLOCATION EXECUTION ---
  const algoSelect = document.getElementById("algoSelect");
  algoSelect.addEventListener("change", (e) => {
    activeAlgorithm = e.target.value;
  });

  document.getElementById("btnRunInstant").addEventListener("click", () => {
    runAllocationInstant();
  });

  function runAllocationInstant() {
    visualizer.pause();
    document.getElementById("playbackControls").style.display = "none";
    document.getElementById("visualizerPanel").style.display = "none";

    const isEamcet = window.appState.currentPresetKey === "ts_eamcet" && window.eamcetManager?.isLoaded;

    if (isEamcet) {
      runEamcetAllocation();
    } else {
      runPresetAllocation();
    }
  }

  // --- TS EAMCET ALLOCATION RUNNER ---
  function runEamcetAllocation() {
    const em = window.eamcetManager;
    let res = null;

    const bannerTitle = document.getElementById("activeAlgoTitle");
    const bannerDesc = document.getElementById("activeAlgoDesc");
    const bannerStat = document.getElementById("activeAlgoStatPill");

    if (activeAlgorithm === "greedy") {
      res = em.runGreedyAllocation();
      if (bannerTitle) bannerTitle.textContent = "⚡ Greedy Priority Allocation Algorithm";
      if (bannerDesc) bannerDesc.textContent = "Processing 1,000 students in strictly ascending EAMCET rank order (Rank 1 first) with category cutoff and capacity constraints.";
    } else if (activeAlgorithm === "backtracking") {
      res = em.runBacktrackingAllocation();
      if (bannerTitle) bannerTitle.textContent = "🌲 Backtracking / Constraint Search Algorithm";
      if (bannerDesc) bannerDesc.textContent = "Recursive state-space tree traversal exploring alternative preferences with cutoff constraint pruning & seat state restoration.";
    } else {
      // Both
      const greedyRes = em.runGreedyAllocation();
      const btRes = em.runBacktrackingAllocation();
      res = greedyRes;
      if (bannerTitle) bannerTitle.textContent = "⚖️ Comparative Benchmark: Greedy vs Backtracking";
      if (bannerDesc) bannerDesc.textContent = `Greedy: ${greedyRes.metrics.allocatedCount} allocated (${greedyRes.metrics.durationMs}ms) vs Backtracking: ${btRes.metrics.allocatedCount} allocated (${btRes.metrics.durationMs}ms, ${btRes.metrics.backtrackCount} backtracks).`;
    }

    latestRunResult = res;
    window.appState.allotmentResults = res.results;

    // Update 7 Dashboard Statistics
    updateEamcetDashboardStats(res.metrics);

    // Reset pagination to first page
    allotmentViewState.page = 1;
    renderAllotmentsTable(res.results);

    // Update Live Vacancy in Capacity view
    renderCapacityDatasetTable();

    if (bannerStat) bannerStat.textContent = `${res.metrics.totalStudents} candidates • ${res.metrics.durationMs} ms`;
  }

  function updateEamcetDashboardStats(metrics) {
    const em = window.eamcetManager;
    const elCandidates = document.getElementById("metricTotalCandidates");
    const elColleges = document.getElementById("metricTotalColleges");
    const elBranches = document.getElementById("metricTotalBranches");
    const elAllotted = document.getElementById("metricAllottedCount");
    const elUnallocated = document.getElementById("metricUnallocatedCount");
    const elAllocPct = document.getElementById("metricAllocationPercentage");
    const elRemainingSeats = document.getElementById("metricRemainingSeats");
    const elExecTime = document.getElementById("metricExecTime");
    const elComplexity = document.getElementById("metricAlgoComplexity");
    const elFillRate = document.getElementById("metricFillRate");

    if (elCandidates) elCandidates.textContent = (metrics.totalStudents || 1000).toLocaleString();
    if (elColleges) elColleges.textContent = (em.colleges.length || 213).toLocaleString();
    if (elBranches) elBranches.textContent = (em.branches.length || 46).toLocaleString();
    if (elAllotted) elAllotted.textContent = (metrics.allocatedCount || 0).toLocaleString();
    if (elUnallocated) elUnallocated.textContent = (metrics.unallocatedCount || 0).toLocaleString();
    if (elAllocPct) elAllocPct.textContent = metrics.allocationPercentage || "0.0%";
    if (elFillRate) elFillRate.textContent = `Fill Rate: ${metrics.allocationPercentage}`;
    if (elRemainingSeats) elRemainingSeats.textContent = (metrics.totalRemainingSeats || 0).toLocaleString();
    if (elExecTime) elExecTime.textContent = `${metrics.durationMs} ms`;
    if (elComplexity) elComplexity.textContent = `Complexity: ${metrics.timeComplexity}`;
  }

  // --- LEGACY PRESET RUNNER (JoSAA / NEET) ---
  function runPresetAllocation() {
    const candidates = window.appState.candidates;
    const colleges = window.appState.colleges;

    latestRunResult = AlgorithmRunner.execute(activeAlgorithm, candidates, colleges);

    const primaryResult = latestRunResult.greedy || latestRunResult.backtracking;
    window.appState.allotmentResults = primaryResult.allotments;

    if (!window.appState.roundData[window.appState.currentRound]) {
      window.appState.roundData[window.appState.currentRound] = { candidateDecisions: {}, allotments: null };
    }
    window.appState.roundData[window.appState.currentRound].allotments = primaryResult.allotments;

    // Update statistics
    const m = primaryResult.metrics;
    document.getElementById("metricTotalCandidates").textContent = m.totalCandidates;
    document.getElementById("metricTotalColleges").textContent = colleges.length;
    document.getElementById("metricTotalBranches").textContent = Object.values(colleges).reduce((acc, c) => acc + Object.keys(c.branches).length, 0);
    document.getElementById("metricAllottedCount").textContent = m.allottedCount;
    document.getElementById("metricUnallocatedCount").textContent = m.unallottedCount;
    document.getElementById("metricAllocationPercentage").textContent = m.fillRate;
    document.getElementById("metricFillRate").textContent = `Fill Rate: ${m.fillRate}`;
    document.getElementById("metricExecTime").textContent = `${m.durationMs} ms`;
    document.getElementById("metricAlgoComplexity").textContent = `Complexity: ${m.timeComplexity}`;

    const totalSeats = colleges.reduce((sum, col) => sum + Object.values(col.branches).reduce((bSum, b) => bSum + b.total, 0), 0);
    document.getElementById("metricRemainingSeats").textContent = Math.max(0, totalSeats - m.allottedCount);

    renderAllotmentsTable(primaryResult.allotments);
    renderSeatMatrix();
    updateAlgorithmComparison();
    updateLetterCandidateDropdown();
  }

  // --- STEP-BY-STEP VISUALIZER ---
  document.getElementById("btnStartStepVisualizer").addEventListener("click", () => {
    if (window.eamcetManager && window.eamcetManager.isLoaded) {
      const res = latestRunResult || window.eamcetManager.runGreedyAllocation();
      const traceSteps = (res.traceSteps && res.traceSteps.length > 0) 
        ? res.traceSteps 
        : (res.results || []).slice(0, 50).map((r, i) => ({
            type: r.status === "Allocated" ? "ALLOCATE" : "NO_ALLOCATION",
            description: r.status === "Allocated" 
              ? `Rank #${r.rank} (${r.studentName}): Allocated to ${r.allocatedCollege} - ${r.branch} (${r.category})`
              : `Rank #${r.rank} (${r.studentName}): Cutoff rank criteria not met for submitted preferences.`,
            candidateName: r.studentName,
            rank: r.rank,
            category: r.category
          }));

      document.getElementById("playbackControls").style.display = "flex";
      document.getElementById("visualizerPanel").style.display = "grid";

      visualizer.loadSteps(traceSteps);
      renderTraceLogList(traceSteps);
      visualizer.play();
    } else {
      alert("TS EAMCET dataset is loading, please wait a moment.");
    }
  });

  document.getElementById("btnStepPlayPause").addEventListener("click", () => {
    const btn = document.getElementById("btnStepPlayPause");
    if (visualizer.isPlaying) {
      visualizer.pause();
      btn.textContent = "▶ Play";
    } else {
      visualizer.play();
      btn.textContent = "⏸ Pause";
    }
  });

  document.getElementById("btnStepNext").addEventListener("click", () => visualizer.next());
  document.getElementById("btnStepPrev").addEventListener("click", () => visualizer.prev());
  document.getElementById("btnStepEnd").addEventListener("click", () => visualizer.jumpToEnd());

  document.getElementById("playbackSpeed").addEventListener("change", (e) => {
    visualizer.setSpeed(parseInt(e.target.value, 10));
  });

  visualizer.onStepChange((step, index, total) => {
    document.getElementById("stepCounter").textContent = `Step ${index + 1} / ${total}`;
    if (!step) return;

    document.getElementById("currentActionBanner").textContent = step.description;

    if (step.candidateName) {
      document.getElementById("focusCandidateName").textContent = step.candidateName;
      document.getElementById("focusCandidateAvatar").textContent = step.candidateName.charAt(0);
      document.getElementById("focusCandidateTags").innerHTML = `
        <span class="status-pill">Rank #${step.rank || "--"}</span>
        <span class="status-pill">Cat: ${step.category || "--"}</span>
      `;
    }

    const badge = document.getElementById("currentPhaseBadge");
    badge.textContent = step.type;

    const items = document.querySelectorAll(".trace-log-item");
    items.forEach(it => it.classList.remove("active"));
    const activeItem = document.getElementById(`trace-item-${index}`);
    if (activeItem) {
      activeItem.classList.add("active");
      activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  function renderTraceLogList(traceSteps) {
    const container = document.getElementById("traceLogScroll");
    document.getElementById("logCountPill").textContent = `${traceSteps.length} events`;
    container.innerHTML = traceSteps.map((step, idx) => `
      <div class="trace-log-item" id="trace-item-${idx}">
        <span class="trace-step-num">#${idx + 1}</span>
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #f8fafc; font-size: 0.8rem;">${step.type}</div>
          <div style="color: var(--text-secondary); font-size: 0.78rem;">${step.description}</div>
        </div>
      </div>
    `).join("");
  }

  // --- RENDER ALLOTMENT RESULTS TABLE (PAGINATED WITH SEARCH & FILTERS) ---
  function renderAllotmentsTable(allotments) {
    const tbody = document.getElementById("allotmentsTableBody");
    if (!allotments) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No allocation results generated yet.</td></tr>`;
      return;
    }

    let rows = Array.isArray(allotments) ? allotments : Object.values(allotments);

    // Apply Search Filter
    if (allotmentViewState.search) {
      const q = allotmentViewState.search.toLowerCase();
      rows = rows.filter(r => {
        const id = (r.studentId || r.candidateId || '').toLowerCase();
        const name = (r.studentName || r.candidateName || '').toLowerCase();
        const col = (r.allocatedCollege || r.collegeId || '').toLowerCase();
        const br = (r.branch || r.branchCode || '').toLowerCase();
        return id.includes(q) || name.includes(q) || col.includes(q) || br.includes(q);
      });
    }

    // Apply Status Filter
    if (allotmentViewState.status !== "ALL") {
      rows = rows.filter(r => {
        const isAlloc = r.status === "Allocated" || r.status === "ALLOTTED" || r.status === "FROZEN" || r.status === "UPGRADED";
        return allotmentViewState.status === "Allocated" ? isAlloc : !isAlloc;
      });
    }

    // Apply Category Filter
    if (allotmentViewState.category !== "ALL") {
      rows = rows.filter(r => (r.category || '').toUpperCase() === allotmentViewState.category);
    }

    const totalFiltered = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / allotmentViewState.pageSize));
    allotmentViewState.page = Math.min(allotmentViewState.page, totalPages);

    const startIdx = (allotmentViewState.page - 1) * allotmentViewState.pageSize;
    const pageRows = rows.slice(startIdx, startIdx + allotmentViewState.pageSize);

    // Update Counter & Pagination Info
    const counterEl = document.getElementById("allotmentFilteredCount");
    if (counterEl) counterEl.textContent = `${totalFiltered.toLocaleString()} students`;

    const infoEl = document.getElementById("allotmentPaginationInfo");
    if (infoEl) {
      const endIdx = Math.min(startIdx + allotmentViewState.pageSize, totalFiltered);
      infoEl.textContent = `Showing ${totalFiltered === 0 ? 0 : startIdx + 1}-${endIdx} of ${totalFiltered.toLocaleString()} results`;
    }

    const pageDisplay = document.getElementById("allotmentPageDisplay");
    if (pageDisplay) pageDisplay.textContent = `Page ${allotmentViewState.page} of ${totalPages}`;

    // Enable/Disable pagination buttons
    const btnFirst = document.getElementById("btnAllotmentFirst");
    const btnPrev = document.getElementById("btnAllotmentPrev");
    const btnNext = document.getElementById("btnAllotmentNext");
    const btnLast = document.getElementById("btnAllotmentLast");

    if (btnFirst) btnFirst.disabled = allotmentViewState.page <= 1;
    if (btnPrev) btnPrev.disabled = allotmentViewState.page <= 1;
    if (btnNext) btnNext.disabled = allotmentViewState.page >= totalPages;
    if (btnLast) btnLast.disabled = allotmentViewState.page >= totalPages;

    if (pageRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No matching candidate records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = pageRows.map(r => {
      const studentId = r.studentId || r.candidateId || '--';
      const name = r.studentName || r.candidateName || '--';
      const rank = r.rank ? r.rank.toLocaleString() : '--';
      const cat = r.category || '--';
      const colName = r.allocatedCollege || (r.collegeId ? (window.appState.getCollege(r.collegeId)?.name || r.collegeId) : '--');
      const branch = r.branch || r.branchCode || '--';
      const prefNum = r.preferenceNumber || r.choiceNumber ? `#${r.preferenceNumber || r.choiceNumber}` : '--';
      const closing = r.closingRank ? (typeof r.closingRank === 'number' ? r.closingRank.toLocaleString() : r.closingRank) : '--';
      const isAlloc = r.status === 'Allocated' || r.status === 'ALLOTTED' || r.status === 'FROZEN' || r.status === 'UPGRADED';
      const badgeClass = isAlloc ? 'badge-allocated' : 'badge-unallocated';
      const displayStatus = isAlloc ? 'Allocated' : 'Not Allocated';

      return `
        <tr>
          <td><strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${studentId}</strong></td>
          <td><strong style="color: var(--text-primary);">${name}</strong></td>
          <td><span style="font-family: var(--font-mono); font-weight: 700; color: #e2e8f0;">${rank}</span></td>
          <td><span class="badge badge-${cat.toLowerCase().replace(/[^a-z]/g, '')}">${cat}</span></td>
          <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${colName}">${colName}</td>
          <td><span class="status-pill">${branch}</span></td>
          <td><span class="status-pill" style="color: #67e8f9;">${prefNum}</span></td>
          <td><span style="font-family: var(--font-mono); color: var(--text-secondary);">${closing}</span></td>
          <td><span class="${badgeClass}">${displayStatus}</span></td>
          <td>
            ${isAlloc ? `<button class="btn btn-secondary btn-sm" onclick="previewCandidateSlip('${studentId}')" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;">📄 Slip</button>` : '--'}
          </td>
        </tr>
      `;
    }).join("");
  }

  // --- ALLOTMENT TABLE FILTERS & PAGINATION EVENTS ---
  const inputAllotSearch = document.getElementById("allotmentSearchInput");
  if (inputAllotSearch) {
    inputAllotSearch.addEventListener("input", (e) => {
      allotmentViewState.search = e.target.value.trim();
      allotmentViewState.page = 1;
      renderAllotmentsTable(window.appState.allotmentResults);
    });
  }

  const selectAllotStatus = document.getElementById("allotmentStatusFilter");
  if (selectAllotStatus) {
    selectAllotStatus.addEventListener("change", (e) => {
      allotmentViewState.status = e.target.value;
      allotmentViewState.page = 1;
      renderAllotmentsTable(window.appState.allotmentResults);
    });
  }

  const selectAllotCat = document.getElementById("allotmentCategoryFilter");
  if (selectAllotCat) {
    selectAllotCat.addEventListener("change", (e) => {
      allotmentViewState.category = e.target.value;
      allotmentViewState.page = 1;
      renderAllotmentsTable(window.appState.allotmentResults);
    });
  }

  document.getElementById("btnAllotmentFirst")?.addEventListener("click", () => {
    allotmentViewState.page = 1;
    renderAllotmentsTable(window.appState.allotmentResults);
  });
  document.getElementById("btnAllotmentPrev")?.addEventListener("click", () => {
    if (allotmentViewState.page > 1) {
      allotmentViewState.page--;
      renderAllotmentsTable(window.appState.allotmentResults);
    }
  });
  document.getElementById("btnAllotmentNext")?.addEventListener("click", () => {
    allotmentViewState.page++;
    renderAllotmentsTable(window.appState.allotmentResults);
  });
  document.getElementById("btnAllotmentLast")?.addEventListener("click", () => {
    const rows = Array.isArray(window.appState.allotmentResults) ? window.appState.allotmentResults : Object.values(window.appState.allotmentResults || {});
    allotmentViewState.page = Math.ceil(rows.length / allotmentViewState.pageSize);
    renderAllotmentsTable(window.appState.allotmentResults);
  });

  // --- POPULATE DISTRICT & BRANCH DROPDOWNS ---
  function populateEamcetFilters() {
    const em = window.eamcetManager;
    if (!em || !em.isLoaded) return;

    // Districts
    const distSelects = [
      document.getElementById("cutoffDistrictFilter"),
      document.getElementById("capacityDistrictFilter")
    ];
    distSelects.forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value="ALL">All Districts (21)</option>';
      em.districts.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = `District: ${d}`;
        sel.appendChild(opt);
      });
    });

    // Branches
    const brSelects = [
      document.getElementById("cutoffBranchFilter"),
      document.getElementById("capacityBranchFilter")
    ];
    brSelects.forEach(sel => {
      if (!sel) return;
      sel.innerHTML = '<option value="ALL">All Branches (46)</option>';
      em.branches.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b;
        opt.textContent = `Branch: ${b}`;
        sel.appendChild(opt);
      });
    });
  }

  // --- RENDER STUDENTS DATASET TABLE ---
  function renderStudentsDatasetTable() {
    const tbody = document.getElementById("studentsDatasetTableBody");
    if (!tbody || !window.eamcetManager) return;

    let students = [...window.eamcetManager.students];

    // Filter by search
    if (studentViewState.search) {
      const q = studentViewState.search.toLowerCase();
      students = students.filter(s => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }

    // Filter by category
    if (studentViewState.category !== "ALL") {
      students = students.filter(s => s.category === studentViewState.category);
    }

    // Sorting
    if (studentViewState.sort === "rank-asc") {
      students.sort((a, b) => a.rank - b.rank);
    } else if (studentViewState.sort === "rank-desc") {
      students.sort((a, b) => b.rank - a.rank);
    } else if (studentViewState.sort === "marks-desc") {
      students.sort((a, b) => b.eamcetMarks - a.eamcetMarks);
    } else if (studentViewState.sort === "inter-desc") {
      students.sort((a, b) => b.interMarks - a.interMarks);
    }

    const totalFiltered = students.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / studentViewState.pageSize));
    studentViewState.page = Math.min(studentViewState.page, totalPages);

    const startIdx = (studentViewState.page - 1) * studentViewState.pageSize;
    const pageRows = students.slice(startIdx, startIdx + studentViewState.pageSize);

    // Update Counter & Pagination Info
    document.getElementById("studentCountBadge").textContent = `${totalFiltered.toLocaleString()} students`;
    const endIdx = Math.min(startIdx + studentViewState.pageSize, totalFiltered);
    document.getElementById("studentPaginationInfo").textContent = `Showing ${totalFiltered === 0 ? 0 : startIdx + 1}-${endIdx} of ${totalFiltered.toLocaleString()} students`;
    document.getElementById("studentPageDisplay").textContent = `Page ${studentViewState.page} of ${totalPages}`;

    document.getElementById("btnStudentFirst").disabled = studentViewState.page <= 1;
    document.getElementById("btnStudentPrev").disabled = studentViewState.page <= 1;
    document.getElementById("btnStudentNext").disabled = studentViewState.page >= totalPages;
    document.getElementById("btnStudentLast").disabled = studentViewState.page >= totalPages;

    if (pageRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No matching student records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = pageRows.map(s => `
      <tr>
        <td><strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${s.id}</strong></td>
        <td><strong style="color: var(--text-primary);">${s.name}</strong></td>
        <td>${s.interMarks}</td>
        <td>${s.eamcetMarks}</td>
        <td><strong style="color: #f8fafc; font-family: var(--font-mono);">${s.rank.toLocaleString()}</strong></td>
        <td><span class="badge badge-${s.category.toLowerCase().replace(/[^a-z]/g, '')}">${s.category}</span></td>
        <td style="max-width: 180px; font-size: 0.76rem;" title="${s.preferences[0] || ''}">${s.preferences[0] || '--'}</td>
        <td style="max-width: 180px; font-size: 0.76rem;" title="${s.preferences[1] || ''}">${s.preferences[1] || '--'}</td>
        <td style="max-width: 180px; font-size: 0.76rem;" title="${s.preferences[2] || ''}">${s.preferences[2] || '--'}</td>
        <td style="max-width: 180px; font-size: 0.76rem;" title="${s.preferences[3] || ''}">${s.preferences[3] || '--'}</td>
        <td style="max-width: 180px; font-size: 0.76rem;" title="${s.preferences[4] || ''}">${s.preferences[4] || '--'}</td>
      </tr>
    `).join("");
  }

  // Student table event listeners
  document.getElementById("studentSearchInput")?.addEventListener("input", (e) => {
    studentViewState.search = e.target.value.trim();
    studentViewState.page = 1;
    renderStudentsDatasetTable();
  });
  document.getElementById("studentCategoryFilter")?.addEventListener("change", (e) => {
    studentViewState.category = e.target.value;
    studentViewState.page = 1;
    renderStudentsDatasetTable();
  });
  document.getElementById("studentSortSelect")?.addEventListener("change", (e) => {
    studentViewState.sort = e.target.value;
    studentViewState.page = 1;
    renderStudentsDatasetTable();
  });
  document.getElementById("btnStudentFirst")?.addEventListener("click", () => { studentViewState.page = 1; renderStudentsDatasetTable(); });
  document.getElementById("btnStudentPrev")?.addEventListener("click", () => { if (studentViewState.page > 1) { studentViewState.page--; renderStudentsDatasetTable(); } });
  document.getElementById("btnStudentNext")?.addEventListener("click", () => { studentViewState.page++; renderStudentsDatasetTable(); });
  document.getElementById("btnStudentLast")?.addEventListener("click", () => {
    studentViewState.page = Math.ceil(window.eamcetManager.students.length / studentViewState.pageSize);
    renderStudentsDatasetTable();
  });

  // --- RENDER COLLEGE CUTOFFS DATASET TABLE ---
  function renderCutoffsDatasetTable() {
    const tbody = document.getElementById("cutoffsDatasetTableBody");
    if (!tbody || !window.eamcetManager) return;

    let cutoffs = [...window.eamcetManager.cutoffs];

    // Filter by search
    if (cutoffViewState.search) {
      const q = cutoffViewState.search.toLowerCase();
      cutoffs = cutoffs.filter(c => (c['INSTITUTE NAME'] || '').toLowerCase().includes(q) || (c['INST CODE'] || '').toLowerCase().includes(q) || (c['BRANCH'] || '').toLowerCase().includes(q));
    }

    // Filter by district
    if (cutoffViewState.district !== "ALL") {
      cutoffs = cutoffs.filter(c => (c['DIST'] || '').trim() === cutoffViewState.district);
    }

    // Filter by branch
    if (cutoffViewState.branch !== "ALL") {
      cutoffs = cutoffs.filter(c => (c['BRANCH'] || '').trim() === cutoffViewState.branch);
    }

    const totalFiltered = cutoffs.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / cutoffViewState.pageSize));
    cutoffViewState.page = Math.min(cutoffViewState.page, totalPages);

    const startIdx = (cutoffViewState.page - 1) * cutoffViewState.pageSize;
    const pageRows = cutoffs.slice(startIdx, startIdx + cutoffViewState.pageSize);

    // Update Counter & Pagination Info
    document.getElementById("cutoffCountBadge").textContent = `${totalFiltered.toLocaleString()} cutoffs`;
    const endIdx = Math.min(startIdx + cutoffViewState.pageSize, totalFiltered);
    document.getElementById("cutoffPaginationInfo").textContent = `Showing ${totalFiltered === 0 ? 0 : startIdx + 1}-${endIdx} of ${totalFiltered.toLocaleString()} cutoffs`;
    document.getElementById("cutoffPageDisplay").textContent = `Page ${cutoffViewState.page} of ${totalPages}`;

    document.getElementById("btnCutoffFirst").disabled = cutoffViewState.page <= 1;
    document.getElementById("btnCutoffPrev").disabled = cutoffViewState.page <= 1;
    document.getElementById("btnCutoffNext").disabled = cutoffViewState.page >= totalPages;
    document.getElementById("btnCutoffLast").disabled = cutoffViewState.page >= totalPages;

    if (pageRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="16" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No matching college cutoffs found.</td></tr>`;
      return;
    }

    tbody.innerHTML = pageRows.map(c => `
      <tr>
        <td><strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${c['INST CODE']}</strong></td>
        <td style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c['INSTITUTE NAME']}">${c['INSTITUTE NAME']}</td>
        <td><span class="status-pill">${c['DIST']}</span></td>
        <td><strong style="color: #67e8f9;">${c['BRANCH']}</strong></td>
        <td style="max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c['BRANCH NAME']}">${c['BRANCH NAME']}</td>
        <td>${c['OC BOYS'] || '--'}</td>
        <td>${c['BC_A BOYS'] || '--'}</td>
        <td>${c['BC_B BOYS'] || '--'}</td>
        <td>${c['BC_C BOYS'] || '--'}</td>
        <td>${c['BC_D BOYS'] || '--'}</td>
        <td>${c['BC_E BOYS'] || '--'}</td>
        <td>${c['SC BOYS'] || '--'}</td>
        <td>${c['ST BOYS'] || '--'}</td>
        <td>${c['EWS GEN OU'] || '--'}</td>
        <td>₹${parseInt(c['TUITION FEE'] || 0).toLocaleString()}</td>
        <td>${c['AFFILIATED'] || '--'}</td>
      </tr>
    `).join("");
  }

  // Cutoffs table event listeners
  document.getElementById("cutoffSearchInput")?.addEventListener("input", (e) => {
    cutoffViewState.search = e.target.value.trim();
    cutoffViewState.page = 1;
    renderCutoffsDatasetTable();
  });
  document.getElementById("cutoffDistrictFilter")?.addEventListener("change", (e) => {
    cutoffViewState.district = e.target.value;
    cutoffViewState.page = 1;
    renderCutoffsDatasetTable();
  });
  document.getElementById("cutoffBranchFilter")?.addEventListener("change", (e) => {
    cutoffViewState.branch = e.target.value;
    cutoffViewState.page = 1;
    renderCutoffsDatasetTable();
  });
  document.getElementById("btnCutoffFirst")?.addEventListener("click", () => { cutoffViewState.page = 1; renderCutoffsDatasetTable(); });
  document.getElementById("btnCutoffPrev")?.addEventListener("click", () => { if (cutoffViewState.page > 1) { cutoffViewState.page--; renderCutoffsDatasetTable(); } });
  document.getElementById("btnCutoffNext")?.addEventListener("click", () => { cutoffViewState.page++; renderCutoffsDatasetTable(); });
  document.getElementById("btnCutoffLast")?.addEventListener("click", () => {
    cutoffViewState.page = Math.ceil(window.eamcetManager.cutoffs.length / cutoffViewState.pageSize);
    renderCutoffsDatasetTable();
  });

  // --- RENDER CONFIGURABLE SEAT CAPACITY TABLE ---
  function renderCapacityDatasetTable() {
    const tbody = document.getElementById("capacityDatasetTableBody");
    if (!tbody || !window.eamcetManager) return;

    let items = Array.from(window.eamcetManager.seatCapacity.values());

    // Search filter
    if (capacityViewState.search) {
      const q = capacityViewState.search.toLowerCase();
      items = items.filter(it => it.collegeName.toLowerCase().includes(q) || it.instCode.toLowerCase().includes(q) || it.branch.toLowerCase().includes(q));
    }

    // District filter
    if (capacityViewState.district !== "ALL") {
      items = items.filter(it => it.dist === capacityViewState.district);
    }

    // Branch filter
    if (capacityViewState.branch !== "ALL") {
      items = items.filter(it => it.branch === capacityViewState.branch);
    }

    const totalFiltered = items.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / capacityViewState.pageSize));
    capacityViewState.page = Math.min(capacityViewState.page, totalPages);

    const startIdx = (capacityViewState.page - 1) * capacityViewState.pageSize;
    const pageRows = items.slice(startIdx, startIdx + capacityViewState.pageSize);

    // Counter & Pagination Info
    document.getElementById("capacityCountBadge").textContent = `${totalFiltered.toLocaleString()} programs`;
    const endIdx = Math.min(startIdx + capacityViewState.pageSize, totalFiltered);
    document.getElementById("capacityPaginationInfo").textContent = `Showing ${totalFiltered === 0 ? 0 : startIdx + 1}-${endIdx} of ${totalFiltered.toLocaleString()} programs`;
    document.getElementById("capacityPageDisplay").textContent = `Page ${capacityViewState.page} of ${totalPages}`;

    document.getElementById("btnCapacityFirst").disabled = capacityViewState.page <= 1;
    document.getElementById("btnCapacityPrev").disabled = capacityViewState.page <= 1;
    document.getElementById("btnCapacityNext").disabled = capacityViewState.page >= totalPages;
    document.getElementById("btnCapacityLast").disabled = capacityViewState.page >= totalPages;

    if (pageRows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No matching programs found.</td></tr>`;
      return;
    }

    tbody.innerHTML = pageRows.map(it => `
      <tr>
        <td><strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${it.instCode}</strong></td>
        <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${it.collegeName}">${it.collegeName}</td>
        <td><span class="status-pill">${it.dist}</span></td>
        <td><strong style="color: #67e8f9;">${it.branch}</strong></td>
        <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${it.branchName}">${it.branchName}</td>
        <td>
          <input type="number" min="0" max="1000" class="seat-input-inline" id="capInput_${it.instCode}_${it.branch}" value="${it.totalSeats}">
        </td>
        <td>
          <span class="status-pill" style="color: ${it.remainingSeats === 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; font-weight: 700;">
            ${it.remainingSeats} / ${it.totalSeats}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="saveIndividualCapacity('${it.instCode}', '${it.branch}')" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;">💾 Save</button>
        </td>
      </tr>
    `).join("");
  }

  // Inline Seat Save Handler
  window.saveIndividualCapacity = function(code, branch) {
    const input = document.getElementById(`capInput_${code}_${branch}`);
    if (!input) return;
    const count = parseInt(input.value, 10);
    if (isNaN(count) || count < 0) {
      alert("Please enter a valid seat capacity count (0 or greater).");
      return;
    }
    window.eamcetManager.setSeatCapacity(code, branch, count);
    renderCapacityDatasetTable();
    // Re-run allocation to reflect updated capacities
    runAllocationInstant();
  };

  // Global Capacity Apply
  document.getElementById("btnApplyGlobalCapacity")?.addEventListener("click", () => {
    const val = parseInt(document.getElementById("globalCapacityInput").value, 10);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid capacity count.");
      return;
    }
    window.eamcetManager.setDefaultCapacityAll(val);
    renderCapacityDatasetTable();
    runAllocationInstant();
    alert(`Applied default capacity of ${val} seats across all college branches!`);
  });

  // Capacity table event listeners
  document.getElementById("capacitySearchInput")?.addEventListener("input", (e) => {
    capacityViewState.search = e.target.value.trim();
    capacityViewState.page = 1;
    renderCapacityDatasetTable();
  });
  document.getElementById("capacityDistrictFilter")?.addEventListener("change", (e) => {
    capacityViewState.district = e.target.value;
    capacityViewState.page = 1;
    renderCapacityDatasetTable();
  });
  document.getElementById("capacityBranchFilter")?.addEventListener("change", (e) => {
    capacityViewState.branch = e.target.value;
    capacityViewState.page = 1;
    renderCapacityDatasetTable();
  });
  document.getElementById("btnCapacityFirst")?.addEventListener("click", () => { capacityViewState.page = 1; renderCapacityDatasetTable(); });
  document.getElementById("btnCapacityPrev")?.addEventListener("click", () => { if (capacityViewState.page > 1) { capacityViewState.page--; renderCapacityDatasetTable(); } });
  document.getElementById("btnCapacityNext")?.addEventListener("click", () => { capacityViewState.page++; renderCapacityDatasetTable(); });
  document.getElementById("btnCapacityLast")?.addEventListener("click", () => {
    capacityViewState.page = Math.ceil(window.eamcetManager.seatCapacity.size / capacityViewState.pageSize);
    renderCapacityDatasetTable();
  });

  // --- CSV UPLOAD HANDLERS ---
  document.getElementById("uploadStudentsCSVInput")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = EamcetManager.parseCSV(text);
        if (parsed.length > 0) {
          window.eamcetManager.processRawData(parsed, window.eamcetManager.cutoffs);
          renderStudentsDatasetTable();
          runAllocationInstant();
          alert(`Successfully loaded ${parsed.length} students from uploaded CSV!`);
        }
      } catch (err) {
        alert("Failed to parse student CSV: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById("uploadCutoffsCSVInput")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = EamcetManager.parseCSV(text);
        if (parsed.length > 0) {
          window.eamcetManager.processRawData(window.eamcetManager.students, parsed);
          populateEamcetFilters();
          renderCutoffsDatasetTable();
          renderCapacityDatasetTable();
          runAllocationInstant();
          alert(`Successfully loaded ${parsed.length} cutoff rows from uploaded CSV!`);
        }
      } catch (err) {
        alert("Failed to parse cutoffs CSV: " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // --- CSV EXPORT HANDLERS ---
  document.getElementById("btnExportStudentsCSV")?.addEventListener("click", () => {
    const students = window.eamcetManager.students;
    const headers = ["Student_ID", "Student_Name", "Inter_Marks", "EAMCET_Marks", "EAMCET_Rank", "Category", "Preference_1", "Preference_2", "Preference_3", "Preference_4", "Preference_5"];
    const rows = students.map(s => [
      s.id, `"${s.name}"`, s.interMarks, s.eamcetMarks, s.rank, s.category,
      `"${s.preferences[0] || ''}"`, `"${s.preferences[1] || ''}"`, `"${s.preferences[2] || ''}"`, `"${s.preferences[3] || ''}"`, `"${s.preferences[4] || ''}"`
    ]);
    downloadCSV("telangana_eamcet_students_1000.csv", [headers.join(","), ...rows.map(r => r.join(","))].join("\n"));
  });

  document.getElementById("btnExportCutoffsCSV")?.addEventListener("click", () => {
    const cutoffs = window.eamcetManager.cutoffs;
    if (cutoffs.length === 0) return;
    const headers = Object.keys(cutoffs[0]);
    const rows = cutoffs.map(c => headers.map(h => `"${(c[h] || '').replace(/"/g, '""')}"`).join(","));
    downloadCSV("2021_FinalPhase_Cutoffs.csv", [headers.join(","), ...rows].join("\n"));
  });

  document.getElementById("btnExportCSV")?.addEventListener("click", () => {
    const results = window.appState.allotmentResults;
    if (!results) {
      alert("No results to export. Run allocation first.");
      return;
    }
    const arr = Array.isArray(results) ? results : Object.values(results);
    const headers = ["Student ID", "Student Name", "EAMCET Rank", "Category", "Allocated College", "Branch", "Preference Number", "Closing Rank", "Allocation Status"];
    const rows = arr.map(r => [
      `"${r.studentId || r.candidateId || ''}"`,
      `"${r.studentName || r.candidateName || ''}"`,
      r.rank || '',
      `"${r.category || ''}"`,
      `"${r.allocatedCollege || r.collegeId || 'None'}"`,
      `"${r.branch || r.branchCode || '--'}"`,
      r.preferenceNumber || r.choiceNumber || '--',
      `"${r.closingRank || '--'}"`,
      `"${r.status || 'Not Allocated'}"`
    ]);
    downloadCSV("TS_EAMCET_2021_Allotment_Results.csv", [headers.join(","), ...rows.map(row => row.join(","))].join("\n"));
  });

  function downloadCSV(filename, content) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- PRINTABLE ALLOTMENT ORDER SLIP ---
  window.previewCandidateSlip = function(candidateId) {
    let cand = null;
    let alloc = null;

    if (window.appState.currentPresetKey === "ts_eamcet" && window.eamcetManager) {
      cand = window.eamcetManager.students.find(s => s.id === candidateId);
      const results = window.appState.allotmentResults;
      if (Array.isArray(results)) {
        alloc = results.find(r => r.studentId === candidateId);
      }
    } else {
      cand = window.appState.candidates.find(c => c.id === candidateId);
      alloc = (window.appState.allotmentResults || {})[candidateId];
    }

    if (!alloc) return;

    const studentName = alloc.studentName || cand?.name || "Candidate";
    const studentRank = alloc.rank || cand?.rank || "--";
    const category = alloc.category || cand?.category || "OC";
    const collegeName = alloc.allocatedCollege || alloc.collegeId || "Government Engineering College";
    const branchName = alloc.branchName || alloc.branch || alloc.branchCode || "Computer Science";
    const prefNum = alloc.preferenceNumber || alloc.choiceNumber || 1;
    const closingRank = alloc.closingRank || "N/A";
    const quotaUsed = alloc.quotaUsed || category;

    const modalContent = document.getElementById("slipModalContent");
    modalContent.innerHTML = `
      <div class="allotment-order-slip">
        <div class="official-seal">
          TSCHE<br>VERIFIED<br>2021
        </div>
        <div style="border-bottom: 2px solid #0f172a; padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; text-transform: uppercase;">Telangana State Council of Higher Education</h2>
            <div style="font-size: 0.85rem; color: #475569;">TS EAMCET Engineering Admissions 2021 • Final Phase Official Allotment</div>
          </div>
          <div style="text-align: right; font-family: monospace; font-size: 0.8rem; color: #475569;">
            REF: TSEAMCET-2021/${candidateId}<br>
            DATE: ${new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.05em;">
            Provisional Seat Allotment Order
          </h3>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem;">
          <tr>
            <td style="padding: 0.5rem; font-weight: 600; color: #475569; width: 35%;">Hall Ticket / Student ID:</td>
            <td style="padding: 0.5rem; font-weight: 700; color: #0f172a; font-family: monospace;">${candidateId}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 0.5rem; font-weight: 600; color: #475569;">Candidate Name:</td>
            <td style="padding: 0.5rem; font-weight: 700; color: #0f172a;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; font-weight: 600; color: #475569;">EAMCET State Rank:</td>
            <td style="padding: 0.5rem; font-weight: 800; color: #0284c7;">#${typeof studentRank === 'number' ? studentRank.toLocaleString() : studentRank}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 0.5rem; font-weight: 600; color: #475569;">Category / Quota:</td>
            <td style="padding: 0.5rem; font-weight: 600; color: #0f172a;">${category} (Allocated Quota: ${quotaUsed})</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; font-weight: 600; color: #475569;">Allotted Institute:</td>
            <td style="padding: 0.5rem; font-weight: 700; color: #0f172a;">${collegeName}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 0.5rem; font-weight: 600; color: #475569;">Allotted Academic Branch:</td>
            <td style="padding: 0.5rem; font-weight: 700; color: #0f172a;">${branchName}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem; font-weight: 600; color: #475569;">Preference Satisfied:</td>
            <td style="padding: 0.5rem; font-weight: 700; color: #059669;">Preference #${prefNum}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 0.5rem; font-weight: 600; color: #475569;">Institute Closing Rank:</td>
            <td style="padding: 0.5rem; font-weight: 600; color: #0f172a;">${typeof closingRank === 'number' ? closingRank.toLocaleString() : closingRank}</td>
          </tr>
        </table>

        <div style="background: #f1f5f9; padding: 1rem; border-radius: 6px; font-size: 0.8rem; color: #334155; line-height: 1.5; margin-bottom: 2rem;">
          <strong>Candidate Notice:</strong> The allotment is provisional subject to physical verification of original certificates (Inter Marks Memo, EAMCET Rank Card, Caste/Income Certificate) at the allotted institute.
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 2rem; border-top: 1px dashed #cbd5e1; padding-top: 1rem;">
          <div style="font-family: monospace; font-size: 0.75rem; color: #64748b;">
            ||||| | |||| ||||| |||| |||||||| |||||<br>
            SECURITY HASH: TS-CHE-2021-${candidateId}
          </div>
          <div style="text-align: center;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">Convener, TS EAMCET 2021</div>
            <div style="font-size: 0.75rem; color: #64748b;">Department of Technical Education, Telangana</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("allotmentSlipModal").classList.add("active");
  };

  document.getElementById("btnCloseSlipModal").addEventListener("click", () => {
    document.getElementById("allotmentSlipModal").classList.remove("active");
  });

  // --- PRINT ROSTER ---
  document.getElementById("btnPrintRoster").addEventListener("click", () => {
    window.print();
  });

  // --- SEAT MATRIX & OTHER TABS (Legacy Compatibility) ---
  function renderSeatMatrix() {
    const grid = document.getElementById("collegesListGrid");
    const colleges = window.appState.colleges;
    if (colleges.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-secondary);">Currently loaded: <strong>Telangana EAMCET Dataset (213 Colleges & 46 Branches)</strong>. Use the <strong>📁 Data Management</strong> tab to view and configure all college seats!</div>`;
      return;
    }
    const matrix = latestRunResult?.greedy?.seatMatrix || latestRunResult?.backtracking?.seatMatrix;

    grid.innerHTML = colleges.map(col => {
      const branchCards = Object.keys(col.branches).map(bCode => {
        const b = col.branches[bCode];
        const liveSeat = matrix && matrix[col.id] && matrix[col.id][bCode];
        const remaining = liveSeat ? liveSeat.remaining : b.total;
        const filled = b.total - remaining;
        const pct = Math.round((filled / b.total) * 100);

        return `
          <div class="branch-item">
            <div class="branch-item-top">
              <div>
                <span class="branch-code">${bCode}</span>
                <span style="font-size: 0.8rem; margin-left: 0.4rem; color: var(--text-secondary);">${b.name}</span>
              </div>
              <span class="branch-seats-count" style="color: ${remaining === 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">
                ${remaining} / ${b.total} vacant
              </span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
            <div class="quota-chips">
              <span class="quota-chip">GEN: ${liveSeat ? liveSeat.quotas.GEN : b.quotas.GEN}</span>
              <span class="quota-chip">OBC: ${liveSeat ? liveSeat.quotas.OBC : b.quotas.OBC}</span>
              <span class="quota-chip">SC: ${liveSeat ? liveSeat.quotas.SC : b.quotas.SC}</span>
              <span class="quota-chip">ST: ${liveSeat ? liveSeat.quotas.ST : b.quotas.ST}</span>
            </div>
          </div>
        `;
      }).join("");

      return `
        <div class="glass-panel college-card">
          <div class="college-header">
            <div>
              <div class="college-name">${col.name}</div>
              <div class="college-location">📍 ${col.city} • Rating: ⭐ ${col.rating}</div>
            </div>
            <span class="badge badge-gen">${col.id}</span>
          </div>
          <div class="branch-list">${branchCards}</div>
        </div>
      `;
    }).join("");
  }

  document.getElementById("btnRefreshMatrix")?.addEventListener("click", () => renderSeatMatrix());

  function renderCandidates() {
    const tbody = document.getElementById("candidatesTableBody");
    const candidates = window.appState.candidates;
    if (candidates.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">Currently running <strong>Telangana EAMCET (1,000 candidates)</strong>. Explore all candidates in the <strong>📁 Data Management</strong> tab.</td></tr>`;
      return;
    }

    tbody.innerHTML = candidates.sort((a, b) => a.rank - b.rank).map(cand => {
      const prefPills = cand.preferences.map((p, idx) => `
        <span class="status-pill" style="font-size: 0.72rem; margin: 0.1rem; display: inline-block;">
          <strong>#${idx + 1}</strong> ${p}
        </span>
      `).join("");

      return `
        <tr>
          <td><strong style="color: var(--accent-cyan); font-family: var(--font-mono);">#${cand.rank}</strong></td>
          <td><span class="status-pill">${cand.id}</span></td>
          <td><strong style="color: var(--text-primary);">${cand.name}</strong></td>
          <td><span class="badge badge-${cand.category.toLowerCase()}">${cand.category}</span></td>
          <td><span style="font-family: var(--font-mono); font-weight: 600;">${cand.score}</span></td>
          <td>${prefPills}</td>
        </tr>
      `;
    }).join("");
  }

  function renderRoundDecisions() {
    const roundNum = window.appState.currentRound;
    document.getElementById("currentRoundBadge").textContent = `Round ${roundNum}`;
    const tbody = document.getElementById("roundDecisionsTableBody");
    const currentAllotments = window.appState.roundData[roundNum]?.allotments || window.appState.allotmentResults || {};
    const candidates = window.appState.candidates;

    if (candidates.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">Multi-round simulation is active for JoSAA/NEET datasets. Switch dataset preset in header to simulate multi-round choices.</td></tr>`;
      return;
    }

    tbody.innerHTML = candidates.sort((a, b) => a.rank - b.rank).map(cand => {
      const alloc = currentAllotments[cand.id];
      const isAllotted = alloc && (alloc.status === "ALLOTTED" || alloc.status === "FROZEN" || alloc.status === "UPGRADED" || alloc.status === "RETAINED");

      let currentDesc = "Unallotted (Waiting for vacancies)";
      if (isAllotted) {
        const cName = window.appState.getCollege(alloc.collegeId)?.name || alloc.collegeId;
        const bName = window.appState.getBranchName(alloc.collegeId, alloc.branchCode);
        currentDesc = `<strong>${cName}</strong> — ${bName} (Choice #${alloc.choiceNumber})`;
      }

      return `
        <tr>
          <td><strong style="color: var(--accent-cyan); font-family: var(--font-mono);">#${cand.rank}</strong></td>
          <td>${cand.name}</td>
          <td><span class="badge badge-${cand.category.toLowerCase()}">${cand.category}</span></td>
          <td>${currentDesc}</td>
          <td>
            ${isAllotted ? `
              <select class="select-styled round-cand-decision" data-cand-id="${cand.id}" style="padding: 0.35rem 0.6rem; font-size: 0.82rem;">
                <option value="FLOAT" selected>FLOAT (Upgrade any college)</option>
                <option value="SLIDE">SLIDE (Upgrade same college)</option>
                <option value="FREEZE">FREEZE (Lock seat & exit)</option>
                <option value="WITHDRAW">WITHDRAW (Surrender seat)</option>
              </select>
            ` : `<span class="status-pill">Auto-Float (Eligible next round)</span>`}
          </td>
          <td>
            <span class="status-pill">${alloc?.status || 'PENDING'}</span>
          </td>
        </tr>
      `;
    }).join("");
  }

  document.getElementById("btnAdvanceRound")?.addEventListener("click", () => {
    const dropdowns = document.querySelectorAll(".round-cand-decision");
    const decisions = {};
    dropdowns.forEach(dd => {
      const candId = dd.getAttribute("data-cand-id");
      decisions[candId] = dd.value;
    });

    CounsellingRounds.submitDecisions(window.appState.currentRound, decisions);
    const success = CounsellingRounds.advanceToNextRound();
    if (success) {
      renderRoundDecisions();
      renderAllotmentsTable(window.appState.roundData[window.appState.currentRound].allotments);
      renderSeatMatrix();
      alert(`Round ${window.appState.currentRound} Allocation Completed!`);
    }
  });

  function updateAlgorithmComparison() {
    if (!latestRunResult || window.appState.currentPresetKey === "ts_eamcet") return;
    const candidates = window.appState.candidates;
    const colleges = window.appState.colleges;
    const benchmark = AlgorithmRunner.execute("both", candidates, colleges);

    const gMetrics = benchmark.greedy.metrics;
    const bMetrics = benchmark.backtracking.metrics;

    document.getElementById("compGreedyTime").textContent = `${gMetrics.durationMs} ms`;
    document.getElementById("compGreedyStability").textContent = benchmark.greedy.stability.isStable 
      ? "✅ Stable (0 blocking pairs)" 
      : `⚠️ ${benchmark.greedy.stability.blockingPairsCount} blocking pairs`;

    document.getElementById("compBtTime").textContent = `${bMetrics.durationMs} ms`;
    document.getElementById("compBtBacktracks").textContent = `${bMetrics.backtrackCount} undos`;
    document.getElementById("compBtStates").textContent = `${bMetrics.statesExplored} states`;
    document.getElementById("compBtPruned").textContent = `${bMetrics.prunedBranches} branches`;

    if (benchmark.backtracking.stateSpaceTree) {
      AllocationVisualizer.renderTree("stateTreeCanvas", benchmark.backtracking.stateSpaceTree);
    }
  }

  function renderAnalytics() {
    const tbody = document.getElementById("cutoffTableBody");
    if (!tbody) return;
    const colleges = window.appState.colleges;
    const allotments = window.appState.allotmentResults || {};

    if (colleges.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 2rem;">Opening and Closing analytics for Telangana EAMCET 2021 are actively browsable in <strong>📁 Data Management → College Cutoffs (2021)</strong>.</td></tr>`;
      return;
    }

    const branchStats = {};
    colleges.forEach(col => {
      Object.keys(col.branches).forEach(bCode => {
        const key = `${col.name} — ${bCode} (${col.branches[bCode].name})`;
        branchStats[key] = { openingRank: Infinity, closingRank: -Infinity, filled: 0, total: col.branches[bCode].total };
      });
    });

    Object.values(allotments).forEach(item => {
      if (item.status === "ALLOTTED" || item.status === "FROZEN" || item.status === "UPGRADED" || item.status === "RETAINED") {
        const col = window.appState.getCollege(item.collegeId);
        if (col && col.branches[item.branchCode]) {
          const key = `${col.name} — ${item.branchCode} (${col.branches[item.branchCode].name})`;
          if (branchStats[key]) {
            branchStats[key].filled++;
            if (item.rank < branchStats[key].openingRank) branchStats[key].openingRank = item.rank;
            if (item.rank > branchStats[key].closingRank) branchStats[key].closingRank = item.rank;
          }
        }
      }
    });

    tbody.innerHTML = Object.keys(branchStats).map(key => {
      const stat = branchStats[key];
      const opening = stat.openingRank === Infinity ? "N/A" : `#${stat.openingRank}`;
      const closing = stat.closingRank === -Infinity ? "N/A" : `#${stat.closingRank}`;
      return `
        <tr>
          <td><strong style="color: var(--text-primary);">${key}</strong></td>
          <td><span class="status-pill" style="color: var(--accent-cyan); font-weight: 700;">${opening}</span></td>
          <td><span class="status-pill" style="color: var(--accent-amber); font-weight: 700;">${closing}</span></td>
          <td>${stat.filled} / ${stat.total}</td>
        </tr>
      `;
    }).join("");
  }

  function updateLetterCandidateDropdown() {
    const select = document.getElementById("letterCandidateSelect");
    if (!select) return;
    select.innerHTML = "";
    const allotments = window.appState.allotmentResults || {};
    const arr = Array.isArray(allotments) ? allotments : Object.values(allotments);

    arr.filter(item => item.status === "Allocated" || item.status === "ALLOTTED")
      .slice(0, 50)
      .forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.studentId || item.candidateId;
        opt.textContent = `Rank #${item.rank}: ${item.studentName || item.candidateName} (${item.allocatedCollege || item.collegeId} - ${item.branch || item.branchCode})`;
        select.appendChild(opt);
      });
  }

  document.getElementById("btnPreviewLetter")?.addEventListener("click", () => {
    const candId = document.getElementById("letterCandidateSelect")?.value;
    if (!candId) {
      alert("No candidate selected or no allotments generated yet.");
      return;
    }
    window.previewCandidateSlip(candId);
  });

  // --- INITIAL RUN ON PAGE LOAD ---
  runAllocationInstant();
  renderStudentsDatasetTable();
  renderCutoffsDatasetTable();
  renderCapacityDatasetTable();
});
