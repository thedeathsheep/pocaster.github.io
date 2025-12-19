// Fix scroll issue for non-home pages
// This script ensures that body and html elements can scroll on article and page layouts
(function() {
  'use strict';
  
  // Only run on non-home pages
  if (document.body.classList.contains('cyberpunk-page')) {
    return;
  }
  
  // Function to fix scroll
  function fixScroll() {
    const body = document.body;
    const html = document.documentElement;
    
    // Remove overflow-hidden class if present
    body.classList.remove('overflow-hidden');
    
    // Force set styles
    body.style.overflow = 'visible';
    body.style.overflowX = 'visible';
    body.style.overflowY = 'visible';
    body.style.height = 'auto';
    body.style.maxHeight = 'none';
    
    html.style.overflow = 'visible';
    html.style.overflowX = 'visible';
    html.style.overflowY = 'visible';
    html.style.height = 'auto';
    html.style.maxHeight = 'none';
  }
  
  // Run immediately
  fixScroll();
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixScroll);
  } else {
    fixScroll();
  }
  
  // Run after page load
  window.addEventListener('load', fixScroll);
  
  // Monitor for any changes that might add overflow-hidden
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (document.body.classList.contains('overflow-hidden')) {
          fixScroll();
        }
      }
    });
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'style']
  });
})();

