// ===== PURA — Three.js Hero Scene =====
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xc9a84c, 1.2);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);
  const pointGreen = new THREE.PointLight(0x2e8b57, 2, 12);
  pointGreen.position.set(-4, 2, 2);
  scene.add(pointGreen);
  const pointGold = new THREE.PointLight(0xc9a84c, 1.5, 10);
  pointGold.position.set(4, -2, 2);
  scene.add(pointGold);

  // Floating orbs
  const orbData = [
    { r: 0.55, color: 0x2e8b57, x: -2.2, y: 1.2, z: -1.5, speed: 0.7 },
    { r: 0.38, color: 0xc9a84c, x: 2.4, y: -0.8, z: -0.8, speed: 0.9 },
    { r: 0.28, color: 0x5db88a, x: 1.0, y: 1.8, z: -2.0, speed: 1.1 },
    { r: 0.22, color: 0xe8d5a3, x: -1.6, y: -1.5, z: -1.0, speed: 0.6 },
    { r: 0.18, color: 0x2e8b57, x: 3.0, y: 0.5, z: -2.5, speed: 1.3 },
    { r: 0.14, color: 0xc9a84c, x: -3.2, y: -0.4, z: -1.8, speed: 0.8 },
  ];

  const orbs = orbData.map(d => {
    const geo = new THREE.SphereGeometry(d.r, 32, 32);
    const mat = new THREE.MeshPhysicalMaterial({
      color: d.color,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 1.2,
      transparent: true,
      opacity: 0.82,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(d.x, d.y, d.z);
    mesh.userData = { ox: d.x, oy: d.y, speed: d.speed, phase: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    return mesh;
  });

  // Particle field
  const particleCount = 120;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 3;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.04, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  function animate(t) {
    requestAnimationFrame(animate);
    const time = t * 0.001;

    orbs.forEach(orb => {
      const { ox, oy, speed, phase } = orb.userData;
      orb.position.x = ox + Math.sin(time * speed + phase) * 0.35 + mx * 0.18;
      orb.position.y = oy + Math.cos(time * speed * 0.7 + phase) * 0.25 - my * 0.12;
      orb.rotation.y = time * 0.3 * speed;
    });

    particles.rotation.y = time * 0.02;
    particles.rotation.x = time * 0.01;
    camera.position.x += (mx * 0.3 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate(0);
})();
