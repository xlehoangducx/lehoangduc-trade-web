// ============================================================================
// Distance-Based Pointer Trail Emitter
// Implemented directly from Meng To's `pointer-trail-emitter` skill
// ============================================================================

(function () {
  'use strict';

  const canvas = document.getElementById('candleCursorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Fixed Ring-Buffer Pool (Zero GC allocation during high-speed movement)
  const N = 120;
  const pool = new Array(N);
  for (let i = 0; i < N; i++) {
    pool[i] = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 45,
      type: 'ember', // 'candle_green', 'candle_red', 'symbol_usd', 'symbol_btc', 'ember'
      size: 1,
      wickTop: 4,
      wickBottom: 4,
      rot: 0,
      rotSpeed: 0
    };
  }

  // Emitter State
  const E = {
    x: -9999,
    y: -9999,
    lx: -9999, // Last position
    ly: -9999,
    acc: 0,    // Accumulated distance
    slot: 0,   // Ring buffer cursor
    lastTime: performance.now(),
    idleTimer: 0,
    hasMoved: false
  };

  const STEP = 14; // Distance in pixels between consecutive motes (Uniform density at any speed!)

  function spawnMote(x, y, vx, vy) {
    const i = E.slot;
    E.slot = (i + 1) % N; // Take slot before advancing

    const m = pool[i];
    m.active = true;
    m.x = x + (Math.random() - 0.5) * 4;
    m.y = y + (Math.random() - 0.5) * 4;

    // Coasting with gentle drift
    m.vx = vx * 0.22 + (Math.random() - 0.5) * 1.2;
    m.vy = vy * 0.22 - (0.4 + Math.random() * 0.8);

    m.life = 0;
    m.maxLife = 38 + Math.floor(Math.random() * 24);
    m.rot = (Math.random() - 0.5) * 0.4;
    m.rotSpeed = (Math.random() - 0.5) * 0.04;

    // Distribute mote types:
    // 40% Mini Candlestick, 30% Currency Symbol, 30% Glowing Spark
    const r = Math.random();
    if (r < 0.22) {
      m.type = 'candle_green';
      m.size = 5 + Math.random() * 4;
      m.wickTop = 3 + Math.random() * 3;
      m.wickBottom = 3 + Math.random() * 3;
    } else if (r < 0.44) {
      m.type = 'candle_red';
      m.size = 5 + Math.random() * 4;
      m.wickTop = 3 + Math.random() * 3;
      m.wickBottom = 3 + Math.random() * 3;
    } else if (r < 0.60) {
      m.type = 'symbol_usd';
      m.size = 11 + Math.random() * 4;
    } else if (r < 0.75) {
      m.type = 'symbol_btc';
      m.size = 12 + Math.random() * 4;
    } else {
      m.type = 'ember';
      m.size = 2.5 + Math.random() * 3.5;
    }
  }

  // Mouse Move Event Listener (Distance accumulator mechanism)
  window.addEventListener('mousemove', (e) => {
    const px = e.clientX;
    const py = e.clientY;

    if (!E.hasMoved) {
      E.x = E.lx = px;
      E.y = E.ly = py;
      E.hasMoved = true;
      return;
    }

    const dx = px - E.lx;
    const dy = py - E.ly;
    const moved = Math.hypot(dx, dy);

    if (moved > 0.5) {
      E.idleTimer = 0; // Reset idle breath
      E.acc += moved;

      // Sub-segment placement: motes laid along the line segment travelled
      let guard = 0;
      while (E.acc >= STEP && guard++ < 14) {
        E.acc -= STEP;
        const t = Math.min(1, (guard * STEP) / moved);
        const subX = E.lx + dx * t;
        const subY = E.ly + dy * t;
        spawnMote(subX, subY, dx, dy);
      }

      E.lx = px;
      E.ly = py;
    }
  }, { passive: true });

  // Touch Support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      const dx = t.clientX - E.lx;
      const dy = t.clientY - E.ly;
      const moved = Math.hypot(dx, dy);
      if (moved > 5) {
        spawnMote(t.clientX, t.clientY, dx * 0.5, dy * 0.5);
        E.lx = t.clientX;
        E.ly = t.clientY;
      }
    }
  }, { passive: true });

  // Animation Loop with Idle Breath & Decaying Coast
  function update() {
    requestAnimationFrame(update);

    ctx.clearRect(0, 0, width, height);

    // Idle Breath: If pointer is resting, occasionally emit a tiny gold wisp
    E.idleTimer++;
    if (E.hasMoved && E.idleTimer > 20 && E.idleTimer % 18 === 0) {
      spawnMote(E.lx, E.ly, (Math.random() - 0.5) * 1.5, -0.6);
    }

    // Render & Physics Loop
    for (let i = 0; i < N; i++) {
      const m = pool[i];
      if (!m.active) continue;

      m.life++;
      if (m.life >= m.maxLife) {
        m.active = false;
        continue;
      }

      // Physics update
      m.x += m.vx;
      m.y += m.vy;
      m.vx *= 0.95; // Air drag
      m.vy *= 0.95;
      m.rot += m.rotSpeed;

      const progress = m.life / m.maxLife;
      const alpha = Math.max(0, 1 - progress);

      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rot);

      if (m.type === 'candle_green') {
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.8})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -m.size - m.wickTop);
        ctx.lineTo(0, m.size + m.wickBottom);
        ctx.stroke();

        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.fillRect(-2.5, -m.size, 5, m.size * 2);

      } else if (m.type === 'candle_red') {
        ctx.strokeStyle = `rgba(244, 63, 94, ${alpha * 0.8})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -m.size - m.wickTop);
        ctx.lineTo(0, m.size + m.wickBottom);
        ctx.stroke();

        ctx.fillStyle = `rgba(244, 63, 94, ${alpha})`;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.fillRect(-2.5, -m.size, 5, m.size * 2);

      } else if (m.type === 'symbol_usd') {
        ctx.font = `900 ${m.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.95})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);

      } else if (m.type === 'symbol_btc') {
        ctx.font = `900 ${m.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.95})`;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₿', 0, 0);

      } else {
        // Glowing Ember Spark
        ctx.beginPath();
        ctx.arc(0, 0, m.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  update();
})();
