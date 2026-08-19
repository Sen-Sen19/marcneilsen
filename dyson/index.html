<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Dyson Sphere</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      background: #000;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    canvas {
      display: block;
      width: 100%;
      height: 80%;
    }

    .controls {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      width: 100%;
    }

    .slider-container {
      margin: 0 10px;
      color: white;
    }

    label {
      display: block;
      text-align: center;
      margin-bottom: 5px;
    }

    input[type="range"] {
      width: 200px;
    }
  </style>
</head>
<body>

  <script type="module">
    import * as THREE from 'https://unpkg.com/three@0.171.0/build/three.module.js';

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create central star (sun) with emissive glow effect
    const sunGeometry = new THREE.SphereGeometry(8, 32, 32);  // Increased size of sun
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFF00, 
      emissive: 0xFFFF00, // Adds glow to the sun
      emissiveIntensity: 0.5 // Intensity of the glow
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Function to create a rotating ring with smaller dimensions and glow effect
    function createRing(radius, thickness, color) {
      const ringGeometry = new THREE.TorusGeometry(radius, thickness, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: color, 
        wireframe: true,
        emissive: color, // Adds glow to the ring
        emissiveIntensity: 0.2  // Glow intensity for the rings
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      return ring;
    }

    // Create rotating rings with smaller dimensions and glow effects
    const rings = [];
    const numRings = 4;  // Reduced number of rings to 4
    for (let i = 1; i <= numRings; i++) {
      const ring = createRing(6 + i * 4, 0.5, Math.random() * 0xffffff);  // Smaller radius and thickness
      ring.rotationSpeed = 0.01 + Math.random() * 0.05;  // Random initial speed
      ring.rotationDirection = 1;  // 1 for clockwise, -1 for counterclockwise
      rings.push(ring);
      scene.add(ring);
    }

    // Position the camera
    camera.position.z = 60;

    // Add spotlight for glow effects
    const spotlight = new THREE.SpotLight(0xFFFFFF, 1, 200, Math.PI / 4, 0.25, 1);
    spotlight.position.set(0, 0, 50); // Position spotlight above the scene
    spotlight.target = sun; // Point spotlight at the sun
    scene.add(spotlight);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate the rings around the central sun
      rings.forEach((ring) => {
        ring.rotation.x += ring.rotationSpeed * ring.rotationDirection;
        ring.rotation.y += ring.rotationSpeed * ring.rotationDirection;
      });

      // Rotate the sun slightly to give a dynamic effect
      sun.rotation.y += 0.005;

      // Render the scene
      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Slider controls to adjust the rotation speed of rings
    function createSlider(label, min, max, step, value, callback) {
      const container = document.createElement('div');
      container.className = 'slider-container';

      const sliderLabel = document.createElement('label');
      sliderLabel.innerHTML = label;
      container.appendChild(sliderLabel);

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.value = value;
      container.appendChild(slider);

      slider.addEventListener('input', (event) => {
        callback(event.target.value);
      });

      document.querySelector('.controls').appendChild(container);
    }

    // Add controls for each ring
    rings.forEach((ring, index) => {
      createSlider(`Ring ${index + 1} Rotation Speed`, 0, 0.2, 0.001, ring.rotationSpeed, (value) => {
        ring.rotationSpeed = parseFloat(value);
      });
    });

    // Drag functionality for the rings to change rotation direction
    let isDragging = false;
    let selectedRing = null;

    renderer.domElement.addEventListener('mousedown', (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.update();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(rings);
      if (intersects.length > 0) {
        isDragging = true;
        selectedRing = intersects[0].object;
      }
    });

    window.addEventListener('mousemove', (event) => {
      if (isDragging && selectedRing) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([selectedRing]);
        if (intersects.length > 0) {
          const direction = intersects[0].point.x > 0 ? -1 : 1;
          selectedRing.rotationDirection = direction;  // Change direction based on mouse movement
        }
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      selectedRing = null;
    });

  </script>

  <div class="controls"></div>

</body>
</html>
