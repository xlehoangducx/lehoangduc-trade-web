/**
 * TradeMatrix - Cyber Matrix Digital Rain Animation
 * Lightweight, high-performance canvas matrix rain
 */

function initMatrixRain(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Configuration options
  const fontSize = options.fontSize || 14;
  const chars = options.chars || "0101010189ABCDEFTRADEMATRIXBTCUSDTATRPNL%#$<>[]";
  const charArray = chars.split('');
  const speed = options.speed || 33; // ~30 fps
  const primaryColor = options.primaryColor || '#10b981'; // Emerald
  const accentColor = options.accentColor || '#f59e0b'; // Amber Gold
  const fadeAlpha = options.fadeAlpha || 0.08;

  let columns = 0;
  let drops = [];

  function resize() {
    canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      // Random start point
      drops[i] = Math.floor(Math.random() * -50);
    }
  }

  resize();
  window.addEventListener('resize', resize);

  let lastTime = 0;
  function draw(currentTime) {
    animationFrameId = requestAnimationFrame(draw);

    if (currentTime - lastTime < speed) return;
    lastTime = currentTime;

    // Fade the canvas slightly on each frame to create trails
    ctx.fillStyle = `rgba(7, 8, 13, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      
      // Lead character glowing gold/amber or bright emerald
      const isLead = Math.random() > 0.85;
      ctx.fillStyle = isLead ? accentColor : primaryColor;
      if (isLead) {
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }

      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      // Reset drop when off screen
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  animationFrameId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
  };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Author Matrix Rain on Index Page
  if (document.getElementById('authorMatrixCanvas')) {
    initMatrixRain('authorMatrixCanvas', {
      fontSize: 14,
      fadeAlpha: 0.09,
      primaryColor: 'rgba(16, 185, 129, 0.45)',
      accentColor: '#f59e0b',
      speed: 40
    });
  }

  // Mini Matrix Telemetry Banner on Dashboard Page
  if (document.getElementById('dashMatrixMiniCanvas')) {
    initMatrixRain('dashMatrixMiniCanvas', {
      fontSize: 12,
      fadeAlpha: 0.12,
      primaryColor: 'rgba(6, 182, 212, 0.35)',
      accentColor: '#10b981',
      speed: 45
    });
  }
});
