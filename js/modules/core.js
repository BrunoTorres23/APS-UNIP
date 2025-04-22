/**
 * Core Module - Essential functionality that should be loaded first
 */

// Detect browser features and set flags
export const features = {
  supportsIntersectionObserver: 'IntersectionObserver' in window,
  supportsModules: 'noModule' in document.createElement('script'),
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isMobile: checkIfMobile()
};

// Better mobile detection
function checkIfMobile() {
  // Check for touch capability and screen size
  const hasTouchScreen = (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  );

  // Consider both touch capability and screen width
  return hasTouchScreen && window.innerWidth <= 768;
}

// Update mobile detection on resize
window.addEventListener('resize', () => {
  features.isMobile = checkIfMobile();
});

// Utility functions
export function isSubpage() {
  // Check for both Unix-style and Windows-style paths
  return window.location.pathname.includes('/paginas/') ||
         window.location.pathname.includes('\\paginas\\') ||
         window.location.pathname.includes('/paginas') ||
         window.location.pathname.includes('\\paginas');
}

// Get current page
export function getCurrentPage() {
  // Handle both Unix and Windows path separators
  const path = window.location.pathname;
  const unixPath = path.split('/').pop();
  const winPath = path.split('\\').pop();

  // Use whichever path component is valid
  const pageName = unixPath || winPath || 'index.html';

  // Remove any query parameters or hash
  return pageName.split('?')[0].split('#')[0];
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
    // Dynamic imports for modern browsers with error handling
    import('./lazy-loading.js')
      .then(module => module.initialize())
      .catch(error => console.error('Failed to load lazy-loading module:', error));

    import('./theme.js')
      .then(module => module.initialize())
      .catch(error => console.error('Failed to load theme module:', error));

    // Load page-specific modules based on current page
    const currentPage = getCurrentPage();

    // Load images module first (high priority)
    import('./images.js')
      .then(module => module.initialize())
      .catch(error => console.error('Failed to load images module:', error));

    // Load theme module (high priority)
    import('./theme.js')
      .then(module => module.initialize())
      .catch(error => console.error('Failed to load theme module:', error));

    // Common UI elements for all pages
    import('./ui.js')
      .then(module => module.initialize())
      .catch(error => console.error('Failed to load UI module:', error));

    // Load animation module if reduced motion is not preferred
    if (!features.prefersReducedMotion) {
      import('./animations.js')
        .then(module => module.initialize())
        .catch(error => console.error('Failed to load animations module:', error));
    }
  } else {
    // Fallback for browsers that don't support ES modules
    // Load the bundled version that includes all functionality
    const script = document.createElement('script');
    script.src = isSubpage() ? '../js/bundle.js' : './js/bundle.js';
    document.body.appendChild(script);
  }
});
