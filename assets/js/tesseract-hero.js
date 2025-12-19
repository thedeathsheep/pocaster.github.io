// ============================================
// Advanced 3D Tesseract with CSS Filter Glow
// ============================================

(function() {
  'use strict';

  let tesseractGroup;
  // Increased rotation speed for faster animation
  let rotationSpeed = { x: 0.008, y: 0.012, z: 0.004 };
  let baseColor = 0x00f3ff; // Neon Cyan
  let activeColor = 0xbc13fe; // Electric Purple (for interaction)
  let materials = [];
  let colorTransitionTime = 0;
  let scene, camera, renderer;
  let containerElement;

  function initTesseract() {
    // Only run on home page (cyberpunk-page)
    if (!document.body.classList.contains('cyberpunk-page')) {
      return;
    }
    
    const container = document.getElementById('tesseract-container');
    if (!container) {
      // Silently return if container not found (not on home page)
      return;
    }

    // Wait for Three.js to be available
    waitForThreeJS().then(() => {
      createTesseract();
    }).catch(err => {
      console.error('Failed to load Three.js:', err);
      // Try alternative CDN
      loadThreeJSAlternative().then(() => {
        createTesseract();
      });
    });
  }

  // Wait for Three.js to be loaded (check if already in HTML)
  function waitForThreeJS() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof THREE !== 'undefined') {
        resolve();
        return;
      }

      // Wait up to 5 seconds for script to load
      let attempts = 0;
      const maxAttempts = 50;
      const checkInterval = setInterval(() => {
        attempts++;
        if (typeof THREE !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Three.js timeout'));
        }
      }, 100);
    });
  }

  // Load Three.js from CDN (primary)
  function loadThreeJS() {
    return new Promise((resolve, reject) => {
      if (typeof THREE !== 'undefined') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => {
        // Wait a bit for THREE to be available
        setTimeout(() => {
          if (typeof THREE !== 'undefined') {
            resolve();
          } else {
            reject(new Error('THREE not available after load'));
          }
        }, 100);
      };
      script.onerror = () => reject(new Error('Failed to load Three.js from cdnjs'));
      document.head.appendChild(script);
    });
  }

  // Alternative CDN fallback
  function loadThreeJSAlternative() {
    return new Promise((resolve, reject) => {
      if (typeof THREE !== 'undefined') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
      script.onload = () => {
        setTimeout(() => {
          if (typeof THREE !== 'undefined') {
            resolve();
          } else {
            reject(new Error('THREE not available after alternative load'));
          }
        }, 100);
      };
      script.onerror = () => reject(new Error('Failed to load Three.js from jsdelivr'));
      document.head.appendChild(script);
    });
  }

  function createTesseract() {
    const container = document.getElementById('tesseract-container');
    containerElement = container;
    
    // 1. Scene setup
    scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    // 3. Renderer setup (optimized for performance)
    renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: false, // Disable antialiasing for performance
      powerPreference: "high-performance"
    });
    
    // Ensure container has dimensions
    const width = container.clientWidth || window.innerWidth * 0.7;
    const height = container.clientHeight || window.innerHeight;
    
    renderer.setSize(width, height);
    // Force low DPI rendering for maximum performance
    renderer.setPixelRatio(1); // Fixed to 1 for 60fps
    container.appendChild(renderer.domElement);
    
    console.log('Renderer initialized:', width, 'x', height);

    // 4. Create True Tesseract (4D Hypercube) Structure
    tesseractGroup = new THREE.Group();

    // Enhanced Tesseract: More complex 4D structure
    // Create multiple nested cubes for complexity
    const size = 2.5;
    const scales = [1.0, 0.75, 0.5, 0.3]; // Multiple nested cubes
    const cubes = [];

    // Create 4 nested cubes at different scales
    scales.forEach((scale, cubeIndex) => {
      const cubeVertices = [
        new THREE.Vector3(-size * scale, -size * scale, -size * scale), // 0
        new THREE.Vector3(size * scale, -size * scale, -size * scale),  // 1
        new THREE.Vector3(size * scale, size * scale, -size * scale),   // 2
        new THREE.Vector3(-size * scale, size * scale, -size * scale),  // 3
        new THREE.Vector3(-size * scale, -size * scale, size * scale),  // 4
        new THREE.Vector3(size * scale, -size * scale, size * scale),   // 5
        new THREE.Vector3(size * scale, size * scale, size * scale),    // 6
        new THREE.Vector3(-size * scale, size * scale, size * scale)    // 7
      ];
      cubes.push(cubeVertices);
    });

    // Use first two cubes as main structure (outer and inner)
    const cube1Vertices = cubes[0]; // Largest
    const cube2Vertices = cubes[1]; // Second largest
    const cube3Vertices = cubes[2]; // Medium
    const cube4Vertices = cubes[3]; // Smallest

    // Edge definition (same for all cubes)
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Front face
      [4, 5], [5, 6], [6, 7], [7, 4], // Back face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
    ];

    // Additional diagonal edges for complexity (within each cube)
    const diagonalEdges = [
      [0, 6], [1, 7], [2, 4], [3, 5] // Space diagonals
    ];

    // Material 1: Main lines (will flow between cyan and purple) - Brightened
    const mat1 = new THREE.LineBasicMaterial({ 
      color: baseColor,
      transparent: true,
      opacity: 0.8 // Increased brightness
    });
    materials.push(mat1);
    
    // Single optimized glow layer for performance
    const mat1Glow = new THREE.LineBasicMaterial({ 
      color: baseColor,
      transparent: true,
      opacity: 0.4 // Single glow layer - balanced performance and effect
    });
    materials.push(mat1Glow);

    // Material 2: Inner cube lines - Brightened
    const mat2 = new THREE.LineBasicMaterial({ 
      color: 0xbc13fe, // Purple
      transparent: true,
      opacity: 0.8 // Increased brightness
    });
    materials.push(mat2);

    // Create Cube 1 (outermost) - with glow
    cubeEdges.forEach(edge => {
      const points = [cube1Vertices[edge[0]], cube1Vertices[edge[1]]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, mat1);
      tesseractGroup.add(line);
      
      // Single optimized glow layer for performance
      const glowGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const glowLine = new THREE.Line(glowGeometry, mat1Glow);
      glowLine.scale.set(1.2, 1.2, 1.2); // Slightly larger for glow effect
      tesseractGroup.add(glowLine);
      
    });
    
    // Add diagonal edges to Cube 1 for complexity
    diagonalEdges.forEach(edge => {
      const points = [cube1Vertices[edge[0]], cube1Vertices[edge[1]]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, mat1);
      line.material.opacity = 0.7; // Increased brightness to match main lines
      tesseractGroup.add(line);
      
      // Single glow layer for diagonals (optimized for performance)
      const glowGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const glowLine = new THREE.Line(glowGeometry, mat1Glow);
      glowLine.scale.set(1.2, 1.2, 1.2);
      tesseractGroup.add(glowLine);
    });

    // Create Cube 2 (inner) - with glow
    cubeEdges.forEach(edge => {
      const points = [cube2Vertices[edge[0]], cube2Vertices[edge[1]]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, mat2);
      tesseractGroup.add(line);
    });
    
    // Add diagonal edges to Cube 2
    diagonalEdges.forEach(edge => {
      const points = [cube2Vertices[edge[0]], cube2Vertices[edge[1]]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, mat2);
      line.material.opacity = 0.6;
      tesseractGroup.add(line);
    });

    // Create Cube 3 (medium) - additional complexity
    cubeEdges.forEach(edge => {
      const points = [cube3Vertices[edge[0]], cube3Vertices[edge[1]]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const mat3 = new THREE.LineBasicMaterial({ 
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.5
      });
      const line = new THREE.Line(geometry, mat3);
      tesseractGroup.add(line);
    });

    // Create Cube 4 (innermost) - core
    cubeEdges.forEach(edge => {
      const points = [cube4Vertices[edge[0]], cube4Vertices[edge[1]]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const mat4 = new THREE.LineBasicMaterial({ 
        color: 0xff00ff,
        transparent: true,
        opacity: 0.7
      });
      const line = new THREE.Line(geometry, mat4);
      tesseractGroup.add(line);
    });

    // Connecting edges between all cubes (4D dimension connections)
    // Connect Cube 1 to Cube 2
    for (let i = 0; i < 8; i++) {
      const points = [cube1Vertices[i], cube2Vertices[i]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, mat1);
      line.material.opacity = 0.7;
      tesseractGroup.add(line);
    }
    
    // Connect Cube 2 to Cube 3
    for (let i = 0; i < 8; i++) {
      const points = [cube2Vertices[i], cube3Vertices[i]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, mat2);
      line.material.opacity = 0.5;
      tesseractGroup.add(line);
    }
    
    // Connect Cube 3 to Cube 4
    for (let i = 0; i < 8; i++) {
      const points = [cube3Vertices[i], cube4Vertices[i]];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const mat3 = new THREE.LineBasicMaterial({ 
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.4
      });
      const line = new THREE.Line(geometry, mat3);
      tesseractGroup.add(line);
    }

    scene.add(tesseractGroup);
    
    console.log('Tesseract created with', tesseractGroup.children.length, 'lines');

    // 5. Setup CSS Filter Glow Effect - after materials are created
    setTimeout(() => {
      setupBloom();
    }, 100); // Small delay to ensure renderer is ready

    // 6. Interaction Logic (Color change only, no speed change)
    const dataBlocks = document.querySelectorAll('.data-block');
    dataBlocks.forEach(block => {
      block.addEventListener('mouseenter', () => {
        // Update all materials to purple on hover
        materials.forEach(m => {
          m.color.setHex(activeColor);
        });
      });
      block.addEventListener('mouseleave', () => {
        // Color will be restored by the color flow animation
      });
    });

    // 7. Animation Loop - Full frame rate for smooth animation
    let frameCount = 0;
    const COLOR_UPDATE_EVERY_N_FRAMES = 2; // Update colors every 2 frames (still smooth but saves some performance)
    
    // Pre-create color objects to avoid allocation in loop
    const cyan = new THREE.Color(0x00f3ff);
    const purple = new THREE.Color(0xbc13fe);
    const flowColor = new THREE.Color();
    const inverseColor = new THREE.Color();
    
    function animate() {
      requestAnimationFrame(animate);
      frameCount++;

      // Simple rotation - no mouse interaction, just constant speed
      tesseractGroup.rotation.x += rotationSpeed.x;
      tesseractGroup.rotation.y += rotationSpeed.y;
      tesseractGroup.rotation.z += rotationSpeed.z;

      // Color Flow Animation - Update every N frames for performance (still smooth)
      if (frameCount % COLOR_UPDATE_EVERY_N_FRAMES === 0) {
        colorTransitionTime += 0.005; // Slightly faster for smoother color flow
        const t = (Math.sin(colorTransitionTime) + 1) / 2; // 0 to 1 oscillation
        
        // Reuse color objects instead of creating new ones
        flowColor.copy(cyan).lerp(purple, t);
        inverseColor.copy(purple).lerp(cyan, t);
        
        // Apply to main material (outer cube and connections) and single glow layer
        if (materials[0]) {
          materials[0].color.copy(flowColor);
          // Update single glow layer (materials[1])
          if (materials[1]) materials[1].color.copy(flowColor);
        }
        
        // Inner cube uses inverse flow (mat2 is now at index 2 after single glow layer)
        if (materials[2]) {
          materials[2].color.copy(inverseColor);
        }
      }

      // Render scene every frame for smooth 60fps animation
      renderer.render(scene, camera);
    }

    // Handle Resize
    function onWindowResize() {
      if (!container) return;
      const width = container.clientWidth || window.innerWidth * 0.7;
      const height = container.clientHeight || window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      // Post-processing removed - no resize needed for composer
    }
    window.addEventListener('resize', onWindowResize);

    animate();
  }

  // Mouse interaction removed - using constant rotation speed only

  // Setup Bloom Post-Processing / Enhanced Glow
  function setupBloom() {
    // Primary approach: CSS Filter + Enhanced Multi-layer Rendering
    // This is more reliable than post-processing libraries, especially for r128
    enhanceMaterialGlow();
    
    // Post-processing disabled for r128 compatibility
    // Three.js r128 requires additional dependencies (ShaderPass, CopyShader) 
    // that are complex to load. CSS filter + multi-layer rendering provides
    // excellent glow effects without these dependencies.
    console.log('Using CSS filter + multi-layer rendering for glow effect (r128 compatible)');
  }

  // Post-processing functions removed - using CSS filter + multi-layer rendering instead
  // Three.js r128 post-processing requires ShaderPass and other dependencies
  // that are complex to load. Our CSS filter approach is more reliable.

  // Enhanced material glow with CSS filter (Primary method - more reliable)
  function enhanceMaterialGlow() {
    console.log('Setting up enhanced glow with CSS filter and multi-layer rendering');
    
    // Apply CSS filter to canvas for strong glow effect
    // Use multiple attempts to ensure canvas is ready
    function applyGlowFilter() {
      const canvas = renderer?.domElement;
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        // Minimal CSS filter for performance - Single layer
        canvas.style.filter = `drop-shadow(0 0 8px rgba(0, 243, 255, 0.6))`;
        canvas.style.transition = 'filter 0.3s ease';
        canvas.style.willChange = 'filter'; // Optimize for performance
        console.log('✅ CSS filter glow applied to canvas with enhanced intensity');
        return true;
      }
      return false;
    }
    
    // Try immediately
    if (!applyGlowFilter()) {
      // Retry after a short delay
      setTimeout(() => {
        if (!applyGlowFilter()) {
          // Final retry after longer delay
          setTimeout(applyGlowFilter, 300);
        }
      }, 100);
    }
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTesseract);
  } else {
    initTesseract();
  }

})();
