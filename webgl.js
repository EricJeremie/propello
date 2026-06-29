/* ============================================================
   Propello landing page — WebGL background
   A fixed, full-screen Three.js scene that sits behind all
   content. Renders an abstract torus knot under studio lighting,
   then uses GSAP ScrollTrigger to scrub its rotation, scale, and
   position to the page's scroll progress.

   Loaded after three.min.js, gsap.min.js and ScrollTrigger.min.js.
   Fails quietly (page still works) if WebGL/those libs are missing.
   ============================================================ */
(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas || !window.THREE || !window.gsap || !window.ScrollTrigger) return;

  const THREE = window.THREE;
  const gsap = window.gsap;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(window.ScrollTrigger);

  /* ---------- Renderer ---------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    // No WebGL support — leave the page as-is.
    console.warn('WebGL unavailable; skipping 3D background.', err && err.message);
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  /* ---------- Scene + camera ---------- */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  // Pull the camera back on smaller screens so the object never feels cramped.
  function cameraDistance() {
    const w = window.innerWidth;
    if (w < 600) return 19;
    if (w < 1024) return 16;
    return 13.5;
  }
  camera.position.set(0, 0, cameraDistance());
  camera.lookAt(0, 0, 0);

  /* ---------- Studio lighting ---------- */
  scene.add(new THREE.AmbientLight(0x4866a8, 0.85));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.0); // main studio key
  keyLight.position.set(6, 8, 7);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x90b4ff, 1.1); // cool fill
  fillLight.position.set(-7, 3, -4);
  scene.add(fillLight);

  const rimSky = new THREE.PointLight(0x3b82f6, 2.4, 60); // brand-blue rim
  rimSky.position.set(-8, -3, 6);
  scene.add(rimSky);

  const rimAccent = new THREE.PointLight(0x9ec5ff, 2.0, 60); // light-blue accent
  rimAccent.position.set(8, 4, -6);
  scene.add(rimAccent);

  /* ---------- The abstract object ---------- */
  const geometry = new THREE.TorusKnotGeometry(2.4, 0.62, 240, 36, 2, 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0x1f4f9e,
    metalness: 0.38,
    roughness: 0.26,
    emissive: 0x0b2a66,
    emissiveIntensity: 0.35,
  });
  const knot = new THREE.Mesh(geometry, material);
  scene.add(knot);

  /* ---------- Scroll-driven animation (GSAP ScrollTrigger) ---------- */
  // One timeline scrubbed across the whole document: as the page scrolls,
  // the knot spins, breathes (scale), and drifts side to side.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reduceMotion ? true : 1, // smooth catch-up while scrolling
    },
  });

  // The timeline spans 0 → 1 (top → bottom of the page). Rotation runs
  // continuously across the whole scroll; position and scale weave through
  // four explicit segments placed at 0, 0.25, 0.5, 0.75 so they stay in sync.
  const S = 0.25;
  const E = 'power1.inOut';

  tl.to(knot.rotation, { duration: 1, y: Math.PI * 6, x: Math.PI * 2.5, ease: 'none' }, 0);

  tl.to(knot.position, { x: 3.4, y: -1.4, duration: S, ease: E }, 0)
    .to(knot.position, { x: -3.6, y: 1.2, duration: S, ease: E }, S)
    .to(knot.position, { x: 2.6, y: -0.7, duration: S, ease: E }, S * 2)
    .to(knot.position, { x: 0, y: 0, duration: S, ease: E }, S * 3);

  tl.to(knot.scale, { x: 1.3, y: 1.3, z: 1.3, duration: S, ease: E }, 0)
    .to(knot.scale, { x: 0.85, y: 0.85, z: 0.85, duration: S, ease: E }, S)
    .to(knot.scale, { x: 1.15, y: 1.15, z: 1.15, duration: S, ease: E }, S * 2)
    .to(knot.scale, { x: 1, y: 1, z: 1, duration: S, ease: E }, S * 3);

  /* ---------- Subtle pointer parallax (desktop only) ---------- */
  let pointerX = 0, pointerY = 0;
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      pointerX = (e.clientX / window.innerWidth - 0.5);
      pointerY = (e.clientY / window.innerHeight - 0.5);
    }, { passive: true });
  }

  /* ---------- Render loop ---------- */
  const clock = new THREE.Clock();
  function render() {
    const dt = clock.getDelta();
    // Gentle idle spin so the object stays alive when not scrolling.
    if (!reduceMotion) knot.rotation.z += dt * 0.12;
    // Ease the camera toward the pointer for a soft parallax feel.
    const baseZ = camera.position.z;
    camera.position.x += (pointerX * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (-pointerY * 1.0 - camera.position.y) * 0.04;
    camera.position.z = baseZ;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  /* ---------- Auto-resize ---------- */
  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = cameraDistance();
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      window.ScrollTrigger.refresh();
    });
  }, { passive: true });
})();
