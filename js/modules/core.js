/**
 * Core Module - Essential functionality that should be loaded first
 */

// Detect browser features and set flags
export const features = {
  supportsIntersectionObserver: 'IntersectionObserver' in window,
  supportsModules: 'noModule' in document.createElement('script'),
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isMobile: window.innerWidth <= 768
};

// Utility functions
export function isSubpage() {
  return window.location.pathname.includes('/paginas/');
}

// Get current page
export function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

// DOM ready helper
export function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Initialize core functionality
onDOMReady(() => {
  // Create loading indicator (critical for UX)
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  document.body.appendChild(loadingIndicator);

  // Show loading indicator on navigation
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (link.href && !link.href.includes('#') && !link.href.includes('javascript:')) {
        loadingIndicator.classList.add('active');
      }
    });
  });

  // Hide loading indicator when page loads
  window.addEventListener('load', () => {
    loadingIndicator.classList.remove('active');
  });

  // Load non-critical modules asynchronously
  if (features.supportsModules) {
    // Dynamic imports for modern browsers
    import('./lazy-loading.js').then(module => module.initialize());
    import('./theme.js').then(module => module.initialize());
    
    // Load page-specific modules based on current page
    const currentPage = getCurrentPage();
    
    // Common UI elements for all pages
    import('./ui.js').then(module => module.initialize());
    
    // Load animation module if reduced motion is not preferred
    if (!features.prefersReducedMotion) {
      import('./animations.js').then(module => module.initialize());
    }
  } else {
    // Fallback for browsers that don't support ES modules
    // Load the bundled version that includes all functionality
    const script = document.createElement('script');
    script.src = isSubpage() ? '../js/bundle.js' : './js/bundle.js';
    document.body.appendChild(script);
  }
});
