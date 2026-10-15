// ============================================================================
// 3D Cyber Trading World - Three.js Scrollytelling Engine
// Inspired by Meng To (Kage / build-threejs-scroll-worlds)
// ============================================================================

(function () {
  'use strict';

  // Check if browser prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('threeWorldCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene & Atmosphere
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080d, 0.016);

  // Camera
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 3.5, 16);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0e1726, 2.0);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
  mainLight.position.set(5, 12, 8);
  scene.add(mainLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 3.0, 45, 2);
  cyanLight.position.set(-8, 3, -4);
  scene.add(cyanLight);

  const amberLight = new THREE.PointLight(0xf59e0b, 3.5, 50, 2);
  amberLight.position.set(8, -2, -12);
  scene.add(amberLight);

  // 1. Infinite 3D Cyber Floor Grid
  const gridHelper = new THREE.GridHelper(180, 72, 0x06b6d4, 0x141f33);
  gridHelper.position.y = -4.5;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.55;
  scene.add(gridHelper);

  // 2. Floating 3D Holographic Japanese Candlesticks
  const candleGroup = new THREE.Group();
  scene.add(candleGroup);

  const candleCount = 28;
  const candles = [];

  const greenMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    emissive: 0xe11d48,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  const wickMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.7
  });

  for (let i = 0; i < candleCount; i++) {
    const isBull = Math.random() > 0.45;
    const bodyHeight = 0.8 + Math.random() * 2.2;
    const wickTop = bodyHeight * 0.5 + 0.3 + Math.random() * 0.9;
    const wickBottom = -bodyHeight * 0.5 - 0.3 - Math.random() * 0.9;

    const bodyGeo = new THREE.BoxGeometry(0.55, bodyHeight, 0.55);
    const bodyMesh = new THREE.Mesh(bodyGeo, isBull ? greenMat : redMat);

    // Wicks
    const wickPoints = [
      new THREE.Vector3(0, wickBottom, 0),
      new THREE.Vector3(0, wickTop, 0)
    ];
    const wickGeo = new THREE.BufferGeometry().setFromPoints(wickPoints);
    const wickLine = new THREE.Line(wickGeo, wickMat);

    const singleCandle = new THREE.Group();
    singleCandle.add(bodyMesh);
    singleCandle.add(wickLine);

    // Stagger in 3D Space (corridor effect)
    const side = (i % 2 === 0 ? 1 : -1);
    const x = side * (3.8 + Math.random() * 8.5);
    const y = -2.5 + Math.random() * 6.5;
    const z = 8 - (i * 2.8) + (Math.random() * 1.5);

    singleCandle.position.set(x, y, z);
    singleCandle.rotation.y = (Math.random() - 0.5) * 0.5;

    candleGroup.add(singleCandle);
    candles.push({
      group: singleCandle,
      baseY: y,
      speed: 0.8 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2
    });
  }

  // 3. Stardust Financial Data Particles (Golden & Cyan Orbs)
  const particleCount = 750;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 60;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 35;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 90;

    // 60% Gold / Amber, 40% Cyan
    if (Math.random() > 0.4) {
      particleColors[i3] = 0.96;     // R
      particleColors[i3 + 1] = 0.62; // G
      particleColors[i3 + 2] = 0.04; // B
    } else {
      particleColors[i3] = 0.02;     // R
      particleColors[i3 + 1] = 0.71; // G
      particleColors[i3 + 2] = 0.83; // B
    }
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 4. Scroll Conductor (Meng To Scrollytelling Pattern)
  // Maps normalized scroll progress [0.0 -> 1.0] to a camera journey
  let scrollProgress = 0;
  let smoothProgress = 0;

  function updateScroll() {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = scrollMax > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollMax)) : 0;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Mouse Parallax Tilt
  let mouseX = 0, mouseY = 0;
  let targetTiltX = 0, targetTiltY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetTiltX = mouseX * 0.7;
    targetTiltY = -mouseY * 0.4;
  }, { passive: true });

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateScroll();
  });

  // Math Damp Helper (Spring Smoothing)
  function damp(current, target, lambda, dt) {
    return current + (target - current) * (1 - Math.exp(-lambda * dt));
  }

  // Animation Loop
  let clock = new THREE.Clock();
  let isPageVisible = true;

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  function render() {
    requestAnimationFrame(render);
    if (!isPageVisible) return;

    const dt = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // 1. Smooth Camera Scroll Interpolation
    smoothProgress = damp(smoothProgress, scrollProgress, 4.5, dt);

    if (!prefersReduced) {
      // Camera Flight Path:
      // Hero (0.0): Wide view (z: 16, y: 3.5)
      // Features (0.3): Descending closer (z: 8, y: 1.5)
      // Matrix (0.6): Flying through candle corridor (z: -4, y: 0.2)
      // Bottom (1.0): Deep terminal look (z: -14, y: -0.5)
      const targetCamZ = 16 - (smoothProgress * 30);
      const targetCamY = 3.5 - (smoothProgress * 4.2) + targetTiltY;
      const targetCamX = Math.sin(smoothProgress * Math.PI) * 2.5 + targetTiltX;

      camera.position.x = damp(camera.position.x, targetCamX, 4.0, dt);
      camera.position.y = damp(camera.position.y, targetCamY, 4.0, dt);
      camera.position.z = damp(camera.position.z, targetCamZ, 4.0, dt);

      const lookTargetZ = camera.position.z - 15;
      camera.lookAt(targetTiltX * 1.5, -0.5, lookTargetZ);
    }

    // 2. Floating Candlestick Gentle Bobbing
    candles.forEach((c) => {
      c.group.position.y = c.baseY + Math.sin(elapsedTime * c.speed + c.phase) * 0.28;
      c.group.rotation.y += 0.003;
    });

    // 3. Grid Slow Drift
    gridHelper.position.z = (elapsedTime * 1.2) % 2.5;

    // 4. Stardust Gentle Orbit
    particleSystem.rotation.y = elapsedTime * 0.02;

    renderer.render(scene, camera);
  }

  render();
})();
