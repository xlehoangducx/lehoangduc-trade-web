// ============================================================================
// Distance-Based Pointer Trail Emitter (Enhanced: Vivid Candles, BTC & Gold Sparks)
// ============================================================================

(function () {
  'use strict';

  const canvas = document.getElementById('candleCursorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const N = 180;
  const pool = new Array(N);
  for (let i = 0; i < N; i++) {
    pool[i] = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 55,
      type: 'ember', // 'candle_green', 'candle_red', 'symbol_usd', 'symbol_btc', 'ember'
      size: 1,
      wickTop: 4,
      wickBottom: 4,
      rot: 0,
      rotSpeed: 0
    };
  }

  const E = {
    x: -9999,
    y: -9999,
    lx: -9999,
    ly: -9999,
    acc: 0,
    slot: 0,
    lastTime: performance.now(),
    idleTimer: 0,
    hasMoved: false
  };

  const STEP = 10; // Pixels between motes for dense, fluid trail

  function spawnMote(x, y, vx, vy) {
    const i = E.slot;
    E.slot = (i + 1) % N;

    const m = pool[i];
    m.active = true;
    m.x = x + (Math.random() - 0.5) * 5;
    m.y = y + (Math.random() - 0.5) * 5;

    m.vx = vx * 0.22 + (Math.random() - 0.5) * 1.4;
    m.vy = vy * 0.22 - (0.5 + Math.random() * 1.0);

    m.life = 0;
    m.maxLife = 45 + Math.floor(Math.random() * 30);
    m.rot = (Math.random() - 0.5) * 0.4;
    m.rotSpeed = (Math.random() - 0.5) * 0.04;

    const r = Math.random();
    if (r < 0.25) {
      m.type = 'candle_green';
      m.size = 7 + Math.random() * 4;
      m.wickTop = 4 + Math.random() * 3;
      m.wickBottom = 4 + Math.random() * 3;
    } else if (r < 0.50) {
      m.type = 'candle_red';
      m.size = 7 + Math.random() * 4;
      m.wickTop = 4 + Math.random() * 3;
      m.wickBottom = 4 + Math.random() * 3;
    } else if (r < 0.70) {
      m.type = 'symbol_btc';
      m.size = 18 + Math.random() * 5;
    } else if (r < 0.85) {
      m.type = 'symbol_usd';
      m.size = 16 + Math.random() * 4;
    } else {
      m.type = 'ember';
      m.size = 4 + Math.random() * 4;
    }
  }

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
      E.idleTimer = 0;
      E.acc += moved;

      let guard = 0;
      while (E.acc >= STEP && guard++ < 16) {
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

  function update() {
    requestAnimationFrame(update);

    ctx.clearRect(0, 0, width, height);

    E.idleTimer++;
    if (E.hasMoved && E.idleTimer > 20 && E.idleTimer % 18 === 0) {
      spawnMote(E.lx, E.ly, (Math.random() - 0.5) * 1.5, -0.6);
    }

    for (let i = 0; i < N; i++) {
      const m = pool[i];
      if (!m.active) continue;

      m.life++;
      if (m.life >= m.maxLife) {
        m.active = false;
        continue;
      }

      m.x += m.vx;
      m.y += m.vy;
      m.vx *= 0.95;
      m.vy *= 0.95;
      m.rot += m.rotSpeed;

      const progress = m.life / m.maxLife;
      const alpha = Math.max(0, 1 - progress);

      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rot);

      if (m.type === 'candle_green') {
        ctx.strokeStyle = `rgba(0, 255, 136, ${alpha * 0.95})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -m.size - m.wickTop);
        ctx.lineTo(0, m.size + m.wickBottom);
        ctx.stroke();

        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 12;
        ctx.fillRect(-3.5, -m.size, 7, m.size * 2);

      } else if (m.type === 'candle_red') {
        ctx.strokeStyle = `rgba(255, 51, 102, ${alpha * 0.95})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -m.size - m.wickTop);
        ctx.lineTo(0, m.size + m.wickBottom);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 51, 102, ${alpha})`;
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 12;
        ctx.fillRect(-3.5, -m.size, 7, m.size * 2);

      } else if (m.type === 'symbol_btc') {
        ctx.font = `900 ${m.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 16;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₿', 0, 0);

      } else if (m.type === 'symbol_usd') {
        ctx.font = `900 ${m.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(255, 204, 0, ${alpha})`;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 14;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);

      } else {
        ctx.beginPath();
        ctx.arc(0, 0, m.size * (1 - progress * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 170, 0, ${alpha})`;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 14;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  update();
})();
