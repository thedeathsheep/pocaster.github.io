// ============================================
// Cyberpunk Effects JavaScript
// ============================================

(function() {
  'use strict';

  // Initialize all effects when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // initCustomCursor(); // Disabled - custom cursor removed
    initTypingEffect();
    initRippleEffect();
    // initGlitchEffects(); // Disabled - glitch effects causing instability
  });

  // ============================================
  // Custom Cursor Effect
  // ============================================
  function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cyberpunk-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Smooth cursor movement
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Style the cursor
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.border = '1px solid #00f3ff';
    cursor.style.borderRadius = '50%';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '99999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.mixBlendMode = 'difference';
    
    // Add dot
    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.top = '50%';
    dot.style.left = '50%';
    dot.style.width = '4px';
    dot.style.height = '4px';
    dot.style.background = '#00f3ff';
    dot.style.borderRadius = '50%';
    dot.style.transform = 'translate(-50%, -50%)';
    cursor.appendChild(dot);
  }

  // ============================================
  // Typing Effect for Hero Title
  // ============================================
  function initTypingEffect() {
    // Only on home page
    const heroTitle = document.querySelector('.main-title');
    if (!heroTitle) return;

    // Fade in effect for title
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    heroTitle.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';
    
    setTimeout(() => {
        heroTitle.style.opacity = '0.95';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
  }

  // ============================================
  // Ripple Effect on Click
  // ============================================
  function initRippleEffect() {
    document.addEventListener('click', function(e) {
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      document.body.appendChild(ripple);
      
      ripple.style.position = 'fixed';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.border = '1px solid #00f3ff';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';
      
      // Animate
      const animation = ripple.animate([
        { width: '10px', height: '10px', opacity: 1 },
        { width: '100px', height: '100px', opacity: 0 }
      ], {
        duration: 500,
        easing: 'ease-out'
      });
      
      animation.onfinish = () => ripple.remove();
    });
  }

  // ============================================
  // Random Glitch Effects for Data Blocks
  // ============================================
  function initGlitchEffects() {
    const dataBlocks = document.querySelectorAll('.data-block');
    
    if (dataBlocks.length === 0) return;
    
    // Random glitch on hover (occasional)
    dataBlocks.forEach(block => {
      let glitchTimeout;
      
      block.addEventListener('mouseenter', function() {
        // Random chance to trigger glitch (30% probability)
        if (Math.random() < 0.3) {
          // Delay glitch slightly for surprise effect
          glitchTimeout = setTimeout(() => {
            triggerGlitch(block);
          }, 100 + Math.random() * 200);
        }
      });
      
      block.addEventListener('mouseleave', function() {
        if (glitchTimeout) {
          clearTimeout(glitchTimeout);
        }
        // Remove glitch class if still active
        block.classList.remove('glitch-active');
      });
    });
    
    // Occasional random glitch even without hover (rare)
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        const randomBlock = dataBlocks[Math.floor(Math.random() * dataBlocks.length)];
        if (randomBlock && !randomBlock.matches(':hover')) {
          triggerGlitch(randomBlock);
        }
      }
    }, 5000); // Check every 5 seconds
  }
  
  function triggerGlitch(element) {
    // Add glitch class
    element.classList.add('glitch-active');
    
    // Remove after animation completes
    setTimeout(() => {
      element.classList.remove('glitch-active');
    }, 150);
    
    // Additional random effects
    const effects = [
      () => {
        // Horizontal shift
        element.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
        setTimeout(() => {
          element.style.transform = '';
        }, 50);
      },
      () => {
        // Color inversion flash
        element.style.filter = 'invert(1)';
        setTimeout(() => {
          element.style.filter = '';
        }, 30);
      },
      () => {
        // Brightness flash
        element.style.filter = 'brightness(2)';
        setTimeout(() => {
          element.style.filter = '';
        }, 40);
      }
    ];
    
    // Randomly apply one additional effect
    if (Math.random() < 0.5) {
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      randomEffect();
    }
  }

})();
