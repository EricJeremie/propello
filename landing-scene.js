const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

function setupReveals() {
  if (!revealItems.length) return;

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
}

function supportsWebGL() {
  const probe = document.createElement("canvas");
  return Boolean(probe.getContext("webgl") || probe.getContext("experimental-webgl"));
}

setupReveals();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  document.body.classList.add("scene-reduced");
} else if (!supportsWebGL()) {
  document.body.classList.add("scene-no-webgl");
} else {
  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js");
    setupScene(THREE);
  } catch (error) {
    console.warn("Propello scene disabled:", error);
    document.body.classList.add("scene-no-webgl");
  }
}

function setupScene(THREE) {
  const canvas = document.getElementById("propelloScene");
  if (!canvas) return;

  const isCompact = () => window.innerWidth < 760;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const smoothstep = (edge0, edge1, value) => {
    const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return x * x * (3 - 2 * x);
  };
  const pulse = (value, start, end) => {
    return smoothstep(start, start + 0.12, value) * (1 - smoothstep(end - 0.12, end, value));
  };

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !isCompact(),
    canvas,
    powerPreference: "high-performance"
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const colors = {
    ink: 0x14161a,
    muted: 0x5b636f,
    blue: 0x1a56b0,
    navy: 0x0f2d6b,
    sky: 0x3b82f6,
    light: 0x60a5fa,
    tint: 0xeff6ff,
    border: 0xbfdbfe,
    white: 0xffffff
  };

  const root = new THREE.Group();
  scene.add(root);

  const makeMaterial = (color, opacity = 1, options = {}) => new THREE.MeshPhysicalMaterial({
    color,
    metalness: options.metalness ?? 0.04,
    roughness: options.roughness ?? 0.48,
    clearcoat: options.clearcoat ?? 0.2,
    transparent: true,
    opacity,
    side: THREE.DoubleSide
  });

  const materials = {
    page: makeMaterial(colors.white, 0.92, { roughness: 0.34, clearcoat: 0.55 }),
    pageBack: makeMaterial(colors.tint, 0.58, { roughness: 0.42 }),
    blue: makeMaterial(colors.blue, 0.88, { roughness: 0.35, clearcoat: 0.6 }),
    navy: makeMaterial(colors.navy, 0.88, { roughness: 0.46 }),
    sky: makeMaterial(colors.sky, 0.78, { roughness: 0.38, clearcoat: 0.5 }),
    light: makeMaterial(colors.light, 0.72, { roughness: 0.4 }),
    muted: makeMaterial(colors.muted, 0.28),
    wire: makeMaterial(colors.border, 0.18, { metalness: 0, roughness: 0.7 })
  };

  const ambient = new THREE.AmbientLight(0xffffff, 1.7);
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(3.5, 5, 5);
  const rim = new THREE.PointLight(colors.sky, 16, 14);
  rim.position.set(-4, 1.5, 2.5);
  scene.add(ambient, key, rim);

  const docGroup = new THREE.Group();
  const scopeGroup = new THREE.Group();
  const pricingGroup = new THREE.Group();
  const trustGroup = new THREE.Group();
  const particleGroup = new THREE.Group();
  root.add(particleGroup, docGroup, scopeGroup, pricingGroup, trustGroup);

  function addBar(parent, width, height, x, y, z, material) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.035), material);
    bar.position.set(x, y, z);
    parent.add(bar);
    return bar;
  }

  function createDocument(offsetX, offsetY, offsetZ, scale, material) {
    const group = new THREE.Group();
    const page = new THREE.Mesh(new THREE.BoxGeometry(2.35, 3.25, 0.06), material);
    page.position.z = 0;
    group.add(page);

    addBar(group, 1.5, 0.12, -0.2, 0.92, 0.06, materials.blue);
    addBar(group, 1.75, 0.07, -0.03, 0.48, 0.07, materials.muted);
    addBar(group, 1.35, 0.07, -0.23, 0.25, 0.07, materials.muted);
    addBar(group, 1.65, 0.07, -0.08, 0.02, 0.07, materials.muted);

    for (let index = 0; index < 3; index += 1) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.62, 0.04), index === 1 ? materials.sky : materials.pageBack);
      tile.position.set(-0.62 + index * 0.62, -0.82, 0.07);
      group.add(tile);
    }

    group.position.set(offsetX, offsetY, offsetZ);
    group.scale.setScalar(scale);
    return group;
  }

  const backDoc = createDocument(-0.35, -0.1, -0.42, 0.92, materials.pageBack);
  backDoc.rotation.set(0.18, -0.4, 0.1);
  const mainDoc = createDocument(0.18, 0.08, 0.18, 1, materials.page);
  mainDoc.rotation.set(0.08, -0.18, -0.07);
  docGroup.add(backDoc, mainDoc);

  const arrowShape = new THREE.Shape();
  arrowShape.moveTo(-0.2, -0.48);
  arrowShape.lineTo(0.2, -0.48);
  arrowShape.lineTo(0.2, 0.18);
  arrowShape.lineTo(0.48, 0.18);
  arrowShape.lineTo(0, 0.62);
  arrowShape.lineTo(-0.48, 0.18);
  arrowShape.lineTo(-0.2, 0.18);
  arrowShape.lineTo(-0.2, -0.48);
  const arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, {
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    depth: 0.12
  });
  arrowGeometry.center();
  const arrow = new THREE.Mesh(arrowGeometry, materials.light);
  arrow.position.set(0.94, -1.08, 0.42);
  arrow.rotation.set(0.3, -0.24, -0.1);
  arrow.scale.setScalar(0.82);
  docGroup.add(arrow);

  for (let index = 0; index < 4; index += 1) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.44, 0.16), index % 2 ? materials.sky : materials.blue);
    block.position.set(-0.25 + (index % 2) * 0.6, 0.78 - index * 0.55, 0);
    block.rotation.set(0.04 * index, -0.2 + index * 0.08, -0.08);
    scopeGroup.add(block);
  }

  for (let index = 0; index < 5; index += 1) {
    const chip = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.32, 0.15), index % 2 ? materials.light : materials.navy);
    chip.position.set(-1.55 + index * 0.78, Math.sin(index) * 0.26, 0);
    chip.rotation.set(0.2, -0.28 + index * 0.08, 0.06 * index);
    pricingGroup.add(chip);
  }
  const totalRing = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.035, 12, 80), materials.sky);
  totalRing.position.set(0, -0.15, -0.2);
  totalRing.rotation.set(0.8, 0.1, 0.2);
  pricingGroup.add(totalRing);

  const trustCube = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), materials.wire);
  trustCube.rotation.set(0.3, 0.7, 0.1);
  trustGroup.add(trustCube);
  const trustCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 2), materials.blue);
  trustCore.position.set(0, 0.02, 0.05);
  trustGroup.add(trustCore);
  for (let index = 0; index < 6; index += 1) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), materials.light);
    const angle = index * Math.PI / 3;
    dot.position.set(Math.cos(angle) * 1.45, Math.sin(angle) * 0.82, Math.sin(angle) * 0.55);
    trustGroup.add(dot);
  }

  const particleCount = isCompact() ? 180 : 360;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const radius = 3 + Math.random() * 4.5;
    const angle = Math.random() * Math.PI * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = -2.7 + Math.random() * 5.3;
    particlePositions[index * 3 + 2] = Math.sin(angle) * radius - 2.5;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: colors.blue,
    size: 0.025,
    transparent: true,
    opacity: 0.36,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particleGroup.add(particles);

  const grid = new THREE.GridHelper(12, 24, colors.border, colors.border);
  grid.position.y = -2.4;
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMaterials.forEach((material) => {
    material.transparent = true;
    material.opacity = 0.16;
  });
  root.add(grid);

  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
  let scrollProgress = 0;
  let targetScroll = 0;
  let rafId = 0;
  let running = true;
  let baseX = 1.45;

  function setGroupOpacity(group, opacity) {
    group.traverse((object) => {
      if (!object.material) return;
      const mats = Array.isArray(object.material) ? object.material : [object.material];
      mats.forEach((material) => {
        material.transparent = true;
        material.opacity = opacity;
      });
    });
  }

  function updateScrollTarget() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = maxScroll > 0 ? clamp(window.scrollY / maxScroll, 0, 1) : 0;
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isCompact() ? 1.25 : 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    baseX = isCompact() ? 0.2 : 1.55;
    root.scale.setScalar(isCompact() ? 0.72 : 1);
    updateScrollTarget();
  }

  function animate() {
    if (!running) return;
    rafId = window.requestAnimationFrame(animate);

    const elapsed = performance.now() * 0.001;
    scrollProgress += (targetScroll - scrollProgress) * 0.065;
    pointer.x += (pointerTarget.x - pointer.x) * 0.055;
    pointer.y += (pointerTarget.y - pointer.y) * 0.055;

    const p = scrollProgress;
    const scopeOpacity = pulse(p, 0.12, 0.56);
    const pricingOpacity = pulse(p, 0.34, 0.78);
    const trustOpacity = smoothstep(0.56, 0.76, p);
    const docOpacity = 1 - smoothstep(0.82, 0.98, p) * 0.28;

    setGroupOpacity(docGroup, docOpacity);
    setGroupOpacity(scopeGroup, scopeOpacity);
    setGroupOpacity(pricingGroup, pricingOpacity);
    setGroupOpacity(trustGroup, trustOpacity);

    root.position.x = THREE.MathUtils.lerp(baseX, isCompact() ? 0 : 0.35, smoothstep(0.66, 0.96, p));
    root.position.y = THREE.MathUtils.lerp(0, 0.42, smoothstep(0.78, 1, p));
    root.rotation.x = pointer.y * 0.1 - 0.1 + Math.sin(elapsed * 0.6) * 0.025;
    root.rotation.y = -0.2 + pointer.x * 0.18 + p * 0.95;

    docGroup.position.set(Math.sin(p * Math.PI) * -0.25, 0.1 - p * 0.35, 0);
    docGroup.rotation.y = -0.22 + p * 0.7;
    docGroup.rotation.z = Math.sin(elapsed * 0.5) * 0.025;

    scopeGroup.position.set(-1.45 + p * 1.8, -0.18 + Math.sin(elapsed * 0.85) * 0.05, 0.72);
    scopeGroup.rotation.y = -0.35 + p * 0.45;

    pricingGroup.position.set(0.08, -0.58 + Math.sin(elapsed * 0.7) * 0.06, 0.95);
    pricingGroup.rotation.y = 0.25 + p * 0.6;
    pricingGroup.rotation.z = -0.08;

    trustGroup.position.set(0.05, 0.04, 0.7);
    trustGroup.rotation.x += 0.002;
    trustGroup.rotation.y += 0.004;

    particles.rotation.y = elapsed * 0.025 + p * 0.45;
    particles.rotation.x = p * 0.08;
    particleMaterial.opacity = isCompact() ? 0.22 : 0.32 + Math.sin(elapsed * 0.5) * 0.04;

    grid.position.z = THREE.MathUtils.lerp(-1.3, 1.4, p);
    gridMaterials.forEach((material) => {
      material.opacity = 0.1 + smoothstep(0.2, 0.7, p) * 0.1;
    });

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateScrollTarget, { passive: true });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * -2;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) {
      animate();
    } else {
      window.cancelAnimationFrame(rafId);
    }
  });

  resize();
  updateScrollTarget();
  setGroupOpacity(scopeGroup, 0);
  setGroupOpacity(pricingGroup, 0);
  setGroupOpacity(trustGroup, 0);
  document.body.classList.add("scene-ready");
  animate();
}
