// visualizer.js - Step-by-Step Animated Visualizer & State-Space Tree Renderer

class AllocationVisualizer {
  constructor() {
    this.steps = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.playSpeedMs = 500;
    this.timerId = null;
    this.onStepChangeCallbacks = [];
  }

  loadSteps(steps) {
    this.pause();
    this.steps = steps || [];
    this.currentIndex = -1;
    this.triggerUpdate();
  }

  onStepChange(callback) {
    this.onStepChangeCallbacks.push(callback);
  }

  triggerUpdate() {
    const currentStep = this.steps[this.currentIndex] || null;
    this.onStepChangeCallbacks.forEach(cb => cb(currentStep, this.currentIndex, this.steps.length));
  }

  next() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      this.triggerUpdate();
      return true;
    } else {
      this.pause();
      return false;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.triggerUpdate();
      return true;
    }
    return false;
  }

  reset() {
    this.pause();
    this.currentIndex = -1;
    this.triggerUpdate();
  }

  jumpToEnd() {
    this.pause();
    if (this.steps.length > 0) {
      this.currentIndex = this.steps.length - 1;
      this.triggerUpdate();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (this.currentIndex >= this.steps.length - 1) {
      this.currentIndex = -1;
    }
    this.loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  setSpeed(ms) {
    this.playSpeedMs = ms;
  }

  loop() {
    if (!this.isPlaying) return;
    const hasMore = this.next();
    if (hasMore) {
      this.timerId = setTimeout(() => this.loop(), this.playSpeedMs);
    } else {
      this.pause();
    }
  }

  /**
   * Render State-Space Tree on HTML5 Canvas
   */
  static renderTree(canvasId, treeNodes, currentHighlightNodeId = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.parentElement.clientWidth || 800;
    const height = 420;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (!treeNodes || treeNodes.length === 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("State-Space Tree will appear after running Backtracking Algorithm", width / 2, height / 2);
      return;
    }

    // Organize nodes by level
    const levels = {};
    treeNodes.forEach(node => {
      const lvl = node.level || 0;
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(node);
    });

    const levelKeys = Object.keys(levels).sort((a, b) => a - b);
    const nodeCoords = {};

    // Compute coordinates
    const levelHeight = height / (levelKeys.length + 1);
    levelKeys.forEach((lvl, rowIdx) => {
      const rowNodes = levels[lvl];
      const spacing = width / (rowNodes.length + 1);
      const y = (rowIdx + 1) * levelHeight;

      rowNodes.forEach((node, colIdx) => {
        const x = (colIdx + 1) * spacing;
        nodeCoords[node.id] = { x, y, node };
      });
    });

    // Draw Edges
    Object.values(nodeCoords).forEach(({ x, y, node }) => {
      if (node.parentId && nodeCoords[node.parentId]) {
        const parent = nodeCoords[node.parentId];
        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = (node.id === currentHighlightNodeId) ? "#00f0ff" : "rgba(148, 163, 184, 0.25)";
        ctx.lineWidth = (node.id === currentHighlightNodeId) ? 2.5 : 1.2;
        ctx.stroke();
      }
    });

    // Draw Nodes
    Object.values(nodeCoords).forEach(({ x, y, node }) => {
      const isHighlighted = (node.id === currentHighlightNodeId);
      const radius = isHighlighted ? 18 : 13;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHighlighted ? "#06b6d4" : "#1e293b";
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? "#67e8f9" : "#475569";
      ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
      ctx.stroke();

      // Node label
      ctx.fillStyle = isHighlighted ? "#020617" : "#f8fafc";
      ctx.font = "bold 10px 'Outfit', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = node.rank ? `R${node.rank}` : "Root";
      ctx.fillText(label, x, y);
    });
  }
}

window.AllocationVisualizer = AllocationVisualizer;
