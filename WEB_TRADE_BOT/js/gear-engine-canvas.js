/**
 * TradeMatrix Live 3-Gear Electric Lightning & Matrix Canvas Engine
 * Procedural continuous lightning arcs, sparks, and streaming matrix code
 * 100% Transparent background - 60 FPS Canvas Animation
 */

class GearEngineCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.width = 0;
    this.height = 0;
    this.isRunning = true;
    this.time = 0;
    
    // Electric sparks pool
    this.sparks = [];
    this.maxSparks = 60;
    
    // Matrix data streams drifting across
    this.matrixStreams = [];
    this.initMatrixStreams();
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Pause animation when out of viewport for max performance
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          this.isRunning = e.isIntersecting;
          if (this.isRunning) this.animate();
        });
      }, { threshold: 0.05 });
      obs.observe(this.canvas);
    }
    
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.initMatrixStreams();
  }

  initMatrixStreams() {
    this.matrixStreams = [];
    const count = 12;
    const glyphs = '01TRADEMATRIXQUANT1010101089ABCDEF01';
    
    for (let i = 0; i < count; i++) {
      this.matrixStreams.push({
        x: Math.random() * (this.width || 600),
        y: Math.random() * (this.height || 360),
        vx: 1.2 + Math.random() * 2.2, // Drifting horizontally across
        vy: (Math.random() - 0.4) * 0.8,
        chars: Array.from({ length: 6 + Math.floor(Math.random() * 8) }, () => glyphs[Math.floor(Math.random() * glyphs.length)]),
        color: i % 2 === 0 ? '#00f3ff' : '#10b981',
        size: 11 + Math.random() * 4,
        alpha: 0.3 + Math.random() * 0.5,
        changeTick: 0
      });
    }
  }

  // Generate fractal electric lightning bolt between two points
  drawLightning(x1, y1, x2, y2, displacement, branchChance = 0.35, color = '#00f3ff') {
    const points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
    let currentDisplacement = displacement;
    
    // Recursive subdivision for realistic jagged lightning
    for (let iter = 0; iter < 4; iter++) {
      for (let i = points.length - 1; i > 0; i--) {
        const p1 = points[i - 1];
        const p2 = points[i];
        const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * currentDisplacement;
        const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * currentDisplacement;
        points.splice(i, 0, { x: midX, y: midY });
      }
      currentDisplacement *= 0.52;
    }

    // Outer Glow Corona
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 4.5;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 18;
    this.ctx.globalAlpha = 0.4;
    this.ctx.stroke();

    // Hot White Core Arc
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.8;
    this.ctx.shadowColor = '#ffffff';
    this.ctx.shadowBlur = 10;
    this.ctx.globalAlpha = 0.95;
    this.ctx.stroke();

    // Reset shadow
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1.0;

    // Optional branch fork
    if (Math.random() < branchChance && points.length > 4) {
      const forkIdx = Math.floor(points.length / 2);
      const start = points[forkIdx];
      const endX = start.x + (Math.random() - 0.5) * 50;
      const endY = start.y + (Math.random() - 0.5) * 50;
      this.drawLightning(start.x, start.y, endX, endY, displacement * 0.5, 0, color);
    }
  }

  // Spawn bursting electrical sparks at gear contact points
  emitSparks(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      if (this.sparks.length >= this.maxSparks) this.sparks.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.sparks.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.03 + Math.random() * 0.04,
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#00f3ff' : '#ffd700'
      });
    }
  }

  updateSparks() {
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08; // Gravity drift
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.life;
      this.ctx.fillStyle = s.color;
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // Draw matrix code streams drifting across
  updateMatrixStreams() {
    this.ctx.save();
    this.ctx.font = 'bold 12px "JetBrains Mono", monospace';

    for (const stream of this.matrixStreams) {
      stream.x += stream.vx;
      stream.y += stream.vy;

      // Wrap around screen
      if (stream.x > this.width + 120) {
        stream.x = -100;
        stream.y = Math.random() * this.height;
      }

      stream.changeTick++;
      if (stream.changeTick > 8) {
        stream.changeTick = 0;
        const glyphs = '010101ABCDEF9';
        const randIdx = Math.floor(Math.random() * stream.chars.length);
        stream.chars[randIdx] = glyphs[Math.floor(Math.random() * glyphs.length)];
      }

      // Draw streaming string
      for (let j = 0; j < stream.chars.length; j++) {
        const char = stream.chars[j];
        const cx = stream.x - j * 14;
        const cy = stream.y;
        const charAlpha = Math.max(0, stream.alpha * (1 - j / stream.chars.length));

        if (j === 0) {
          // Leading bright white/cyan head
          this.ctx.fillStyle = '#ffffff';
          this.ctx.shadowColor = stream.color;
          this.ctx.shadowBlur = 12;
        } else {
          this.ctx.fillStyle = stream.color;
          this.ctx.shadowBlur = 6;
        }

        this.ctx.globalAlpha = charAlpha;
        this.ctx.fillText(char, cx, cy);
      }
    }

    this.ctx.restore();
  }

  // Rotating electric orbital halo encircling the gears
  drawRotatingElectricHalo(cx, cy, radius, speedMultiplier = 1, color = '#00f3ff') {
    const angle = (this.time * 0.03 * speedMultiplier) % (Math.PI * 2);
    const arcLength = 0.8 + Math.sin(this.time * 0.05) * 0.3;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, angle, angle + arcLength);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 14;
    this.ctx.globalAlpha = 0.75;
    this.ctx.stroke();

    // Spark dot at lead of arc
    const sparkX = cx + Math.cos(angle + arcLength) * radius;
    const sparkY = cy + Math.sin(angle + arcLength) * radius;
    this.ctx.beginPath();
    this.ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = '#ffffff';
    this.ctx.shadowBlur = 10;
    this.ctx.fill();

    this.ctx.restore();
  }

  animate() {
    if (!this.isRunning) return;
    this.time++;

    // Clear with transparent alpha so 3D candlesticks behind shine through!
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Compute approximate centers of 3 gears relative to container
    const isMobile = this.width < 500;
    const centerY = this.height * 0.5;
    
    const gear1X = this.width * (isMobile ? 0.22 : 0.24);
    const gear2X = this.width * 0.50;
    const gear3X = this.width * (isMobile ? 0.78 : 0.76);
    
    const gearRadius1 = isMobile ? 65 : 105;
    const gearRadius2 = isMobile ? 55 : 85;
    const gearRadius3 = isMobile ? 65 : 105;

    // 1. Matrix digital data streams drifting across
    this.updateMatrixStreams();

    // 2. Rotating continuous electric halos orbiting each gear
    this.drawRotatingElectricHalo(gear1X, centerY, gearRadius1 * 1.05, 1.2, '#00f3ff');
    this.drawRotatingElectricHalo(gear2X, centerY, gearRadius2 * 1.05, -1.6, '#38bdf8');
    this.drawRotatingElectricHalo(gear3X, centerY, gearRadius3 * 1.05, 1.1, '#ffd700');

    // 3. Electric Lightning bolts arcing between meshing gears
    // Arc between Gear 1 (Left Steel) & Gear 2 (Center Titanium)
    if (this.time % 2 === 0) {
      const contact1X = (gear1X + gear2X) * 0.5 + (Math.random() - 0.5) * 8;
      const contact1Y = centerY + (Math.random() - 0.5) * 20;
      
      const g1EdgeX = gear1X + Math.cos(0.1) * (gearRadius1 * 0.95);
      const g1EdgeY = centerY + Math.sin(0.1) * (gearRadius1 * 0.95);
      const g2EdgeX = gear2X - Math.cos(0.1) * (gearRadius2 * 0.95);
      const g2EdgeY = centerY - Math.sin(0.1) * (gearRadius2 * 0.95);
      
      this.drawLightning(g1EdgeX, g1EdgeY, g2EdgeX, g2EdgeY, 22, 0.4, '#00f3ff');
      this.emitSparks(contact1X, contact1Y, 1);
    }

    // Arc between Gear 2 (Center Titanium) & Gear 3 (Right Gold)
    if (this.time % 3 === 0 || this.time % 2 === 1) {
      const contact2X = (gear2X + gear3X) * 0.5 + (Math.random() - 0.5) * 8;
      const contact2Y = centerY + (Math.random() - 0.5) * 20;
      
      const g2EdgeX = gear2X + Math.cos(-0.1) * (gearRadius2 * 0.95);
      const g2EdgeY = centerY + Math.sin(-0.1) * (gearRadius2 * 0.95);
      const g3EdgeX = gear3X - Math.cos(-0.1) * (gearRadius3 * 0.95);
      const g3EdgeY = centerY - Math.sin(-0.1) * (gearRadius3 * 0.95);
      
      this.drawLightning(g2EdgeX, g2EdgeY, g3EdgeX, g3EdgeY, 20, 0.35, '#ffd700');
      this.emitSparks(contact2X, contact2Y, 1);
    }

    // High-voltage lightning flash bridging all 3 gears occasionally
    if (this.time % 45 < 4) {
      this.drawLightning(gear1X, centerY - 15, gear3X, centerY - 15, 38, 0.5, '#38bdf8');
    }

    // 4. Update and render bursting sparks
    this.updateSparks();

    requestAnimationFrame(() => this.animate());
  }
}

// Auto instantiate on load
document.addEventListener('DOMContentLoaded', () => {
  new GearEngineCanvas('gearEngineCanvas');
});
