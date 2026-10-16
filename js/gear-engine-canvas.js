/**
 * TradeMatrix Live 3-Gear Electric Lightning & Matrix Canvas Engine
 * - Dynamic Breathing / Surging Energy Modulation (mạnh nhẹ lúc ít lúc nhiều)
 * - Bi-directional high-speed Matrix streams (chạy nhanh qua lại, lúc ít lúc nhiều)
 * - Continuous rotating plasma lightning & explosive spark showers
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
    
    // Dynamic Energy Surge State (modulates between 0.1 = calm and 1.0 = super storm)
    this.energyIntensity = 0.5;
    
    // Electric sparks pool
    this.sparks = [];
    this.maxSparks = 100;
    
    // Matrix data streams drifting across back and forth
    this.matrixStreams = [];
    this.maxMatrixStreams = 28;
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
    const glyphs = '01TRADEMATRIXQUANT1010101089ABCDEF01⚡';
    
    for (let i = 0; i < this.maxMatrixStreams; i++) {
      // Half streams go Left-to-Right, half streams go Right-to-Left (chạy qua lại)
      const direction = i % 2 === 0 ? 1 : -1;
      const baseSpeed = 1.8 + Math.random() * 3.2;
      
      this.matrixStreams.push({
        x: Math.random() * (this.width || 600),
        y: Math.random() * (this.height || 360),
        direction: direction,
        baseSpeed: baseSpeed * direction,
        vy: (Math.random() - 0.5) * 0.6,
        chars: Array.from({ length: 5 + Math.floor(Math.random() * 9) }, () => glyphs[Math.floor(Math.random() * glyphs.length)]),
        color: i % 3 === 0 ? '#00f3ff' : (i % 3 === 1 ? '#10b981' : '#fbbf24'),
        size: 10 + Math.random() * 4,
        baseAlpha: 0.25 + Math.random() * 0.45,
        changeTick: 0
      });
    }
  }

  // Update dynamic energy surge cycle (dao động mạnh nhẹ tự nhiên)
  updateEnergyCycle() {
    const cycleTime = this.time * 0.028; // ~7-8s per full surge cycle
    // Complex wave combining two sinusoidal harmonics + subtle noise
    const raw = Math.sin(cycleTime) * 0.65 + Math.sin(cycleTime * 2.2) * 0.35;
    // Map to 0.1 (calm/whisper) -> 1.0 (violent super-charged thunderstorm)
    this.energyIntensity = Math.max(0.12, Math.min(1.0, (raw + 1) * 0.5));
  }

  // Generate fractal electric lightning bolt between two points
  drawLightning(x1, y1, x2, y2, displacement, branchChance = 0.35, color = '#00f3ff', powerScale = 1.0) {
    const points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
    let currentDisplacement = displacement * powerScale;
    
    // Recursive subdivision for realistic jagged lightning
    const iterations = powerScale > 0.6 ? 4 : 3;
    for (let iter = 0; iter < iterations; iter++) {
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
    this.ctx.lineWidth = (2.5 + powerScale * 4.0);
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 12 + powerScale * 20;
    this.ctx.globalAlpha = 0.3 + powerScale * 0.55;
    this.ctx.stroke();

    // Hot White Core Arc
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1.2 + powerScale * 1.8;
    this.ctx.shadowColor = '#ffffff';
    this.ctx.shadowBlur = 8 + powerScale * 12;
    this.ctx.globalAlpha = 0.85 + powerScale * 0.15;
    this.ctx.stroke();

    // Reset shadow
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1.0;

    // Fork branches when power is high
    if (Math.random() < branchChance * powerScale && points.length > 4) {
      const forkIdx = Math.floor(points.length / 2);
      const start = points[forkIdx];
      const endX = start.x + (Math.random() - 0.5) * (60 * powerScale);
      const endY = start.y + (Math.random() - 0.5) * (60 * powerScale);
      this.drawLightning(start.x, start.y, endX, endY, displacement * 0.5, 0, color, powerScale * 0.7);
    }
  }

  // Spawn bursting electrical sparks at gear contact points
  emitSparks(x, y, count = 2) {
    const actualCount = Math.round(count * (0.4 + this.energyIntensity * 1.6));
    for (let i = 0; i < actualCount; i++) {
      if (this.sparks.length >= this.maxSparks) this.sparks.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = (1.5 + Math.random() * 4.5) * (0.7 + this.energyIntensity * 0.8);
      this.sparks.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.025 + Math.random() * 0.035,
        size: (1.5 + Math.random() * 2.5) * (0.8 + this.energyIntensity * 0.5),
        color: Math.random() > 0.4 ? '#00f3ff' : '#ffd700'
      });
    }
  }

  updateSparks() {
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.life * (0.4 + this.energyIntensity * 0.6);
      this.ctx.fillStyle = s.color;
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  // Draw matrix code streams running fast and slow, few or many (chạy nhanh qua lại, lúc ít lúc nhiều)
  updateMatrixStreams() {
    this.ctx.save();
    this.ctx.font = 'bold 12px "JetBrains Mono", monospace';

    // Modulate visible stream count based on energy intensity (lúc ít lúc nhiều: 6 -> 28 streams)
    const activeCount = Math.floor(6 + this.energyIntensity * (this.maxMatrixStreams - 6));
    
    // High energy boosts stream velocity significantly (chạy nhanh qua lại)
    const speedBoost = 0.8 + this.energyIntensity * 2.5;

    for (let i = 0; i < activeCount; i++) {
      const stream = this.matrixStreams[i];
      stream.x += stream.baseSpeed * speedBoost;
      stream.y += stream.vy;

      // Wrap around bounds (Left to Right and Right to Left)
      if (stream.direction > 0 && stream.x > this.width + 120) {
        stream.x = -80;
        stream.y = Math.random() * this.height;
      } else if (stream.direction < 0 && stream.x < -120) {
        stream.x = this.width + 80;
        stream.y = Math.random() * this.height;
      }

      stream.changeTick++;
      if (stream.changeTick > 6) {
        stream.changeTick = 0;
        const glyphs = '010101TRADEMATRIXQUANT89';
        const randIdx = Math.floor(Math.random() * stream.chars.length);
        stream.chars[randIdx] = glyphs[Math.floor(Math.random() * glyphs.length)];
      }

      // Draw streaming string
      for (let j = 0; j < stream.chars.length; j++) {
        const char = stream.chars[j];
        // Offset character based on direction
        const cx = stream.x - (stream.direction * j * 14);
        const cy = stream.y;
        const charAlpha = Math.max(0, stream.baseAlpha * (1 - j / stream.chars.length) * (0.5 + this.energyIntensity * 0.7));

        if (j === 0) {
          // Leading bright white/cyan head
          this.ctx.fillStyle = '#ffffff';
          this.ctx.shadowColor = stream.color;
          this.ctx.shadowBlur = 12 + this.energyIntensity * 10;
        } else {
          this.ctx.fillStyle = stream.color;
          this.ctx.shadowBlur = 4 + this.energyIntensity * 6;
        }

        this.ctx.globalAlpha = Math.min(1.0, charAlpha);
        this.ctx.fillText(char, cx, cy);
      }
    }

    this.ctx.restore();
  }

  // Rotating electric orbital halo encircling the gears
  drawRotatingElectricHalo(cx, cy, radius, speedMultiplier = 1, color = '#00f3ff') {
    const speed = (0.02 + this.energyIntensity * 0.04) * speedMultiplier;
    const angle = (this.time * speed) % (Math.PI * 2);
    const arcLength = (0.6 + Math.sin(this.time * 0.05) * 0.4) * (0.7 + this.energyIntensity * 0.6);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, angle, angle + arcLength);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.5 + this.energyIntensity * 3.0;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 10 + this.energyIntensity * 18;
    this.ctx.globalAlpha = 0.35 + this.energyIntensity * 0.55;
    this.ctx.stroke();

    // Spark dot at lead of arc
    if (this.energyIntensity > 0.3) {
      const sparkX = cx + Math.cos(angle + arcLength) * radius;
      const sparkY = cy + Math.sin(angle + arcLength) * radius;
      this.ctx.beginPath();
      this.ctx.arc(sparkX, sparkY, 2.5 + this.energyIntensity * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#ffffff';
      this.ctx.shadowBlur = 12;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  animate() {
    if (!this.isRunning) return;
    this.time++;

    // 1. Update dynamic energy surge wave (mạnh nhẹ lúc ít lúc nhiều)
    this.updateEnergyCycle();

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

    // 2. Matrix digital data streams running back and forth, fast/slow, few/many
    this.updateMatrixStreams();

    // 3. Rotating continuous electric halos orbiting each gear (intensity dynamically scales)
    this.drawRotatingElectricHalo(gear1X, centerY, gearRadius1 * 1.05, 1.2, '#00f3ff');
    this.drawRotatingElectricHalo(gear2X, centerY, gearRadius2 * 1.05, -1.6, '#38bdf8');
    this.drawRotatingElectricHalo(gear3X, centerY, gearRadius3 * 1.05, 1.1, '#ffd700');

    // 4. Electric Lightning bolts arcing between meshing gears (mạnh nhẹ lúc ít lúc nhiều)
    const pScale = this.energyIntensity;

    // Strike chance increases with energy intensity
    const strikeInterval1 = pScale > 0.6 ? 1 : (pScale > 0.3 ? 2 : 4);
    if (this.time % strikeInterval1 === 0) {
      const contact1X = (gear1X + gear2X) * 0.5 + (Math.random() - 0.5) * 10;
      const contact1Y = centerY + (Math.random() - 0.5) * 22;
      
      const g1EdgeX = gear1X + Math.cos(0.1) * (gearRadius1 * 0.95);
      const g1EdgeY = centerY + Math.sin(0.1) * (gearRadius1 * 0.95);
      const g2EdgeX = gear2X - Math.cos(0.1) * (gearRadius2 * 0.95);
      const g2EdgeY = centerY - Math.sin(0.1) * (gearRadius2 * 0.95);
      
      this.drawLightning(g1EdgeX, g1EdgeY, g2EdgeX, g2EdgeY, 24, 0.45, '#00f3ff', pScale);
      this.emitSparks(contact1X, contact1Y, 1);
    }

    const strikeInterval2 = pScale > 0.6 ? 1 : (pScale > 0.3 ? 3 : 5);
    if (this.time % strikeInterval2 === 0) {
      const contact2X = (gear2X + gear3X) * 0.5 + (Math.random() - 0.5) * 10;
      const contact2Y = centerY + (Math.random() - 0.5) * 22;
      
      const g2EdgeX = gear2X + Math.cos(-0.1) * (gearRadius2 * 0.95);
      const g2EdgeY = centerY - Math.sin(-0.1) * (gearRadius2 * 0.95);
      const g3EdgeX = gear3X - Math.cos(-0.1) * (gearRadius3 * 0.95);
      const g3EdgeY = centerY - Math.sin(-0.1) * (gearRadius3 * 0.95);
      
      this.drawLightning(g2EdgeX, g2EdgeY, g3EdgeX, g3EdgeY, 22, 0.4, '#ffd700', pScale);
      this.emitSparks(contact2X, contact2Y, 1);
    }

    // High-voltage lightning storm bridging all 3 gears during peak energy
    if (pScale > 0.65 && (this.time % 20 < 4)) {
      this.drawLightning(gear1X, centerY - 18, gear3X, centerY - 18, 42, 0.6, '#38bdf8', pScale * 1.15);
      this.drawLightning(gear1X, centerY + 18, gear3X, centerY + 18, 40, 0.55, '#00f3ff', pScale * 1.05);
    }

    // 5. Update and render bursting sparks
    this.updateSparks();

    requestAnimationFrame(() => this.animate());
  }
}

// Auto instantiate on load
document.addEventListener('DOMContentLoaded', () => {
  new GearEngineCanvas('gearEngineCanvas');
});
