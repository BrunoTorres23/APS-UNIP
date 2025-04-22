/**
 * Lazy Loading Module
 * Handles lazy loading of images and background images
 */
import { features, isSubpage } from './core.js';

// Lazy load images function
function lazyLoadImages() {
  // Lazy load for regular images
  const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');

  // Lazy load for background images
  const lazyBackgrounds = document.querySelectorAll('.lazy-background');

  if (features.supportsIntersectionObserver) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.tagName.toLowerCase() === 'img') {
            // Handle <img> elements
            if (img.dataset.src) {
              img.src = img.dataset.src;
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          } else {
            // Handle background images
            img.classList.add('visible');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });

    lazyBackgrounds.forEach(bg => {
      imageObserver.observe(bg);
    });
  } else {
    // Fallback for browsers without IntersectionObserver support
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      img.classList.add('loaded');
    });

    lazyBackgrounds.forEach(bg => {
      bg.classList.add('visible');
    });
  }
}

// Preload critical images
function preloadCriticalImages() {
  try {
    // Preload the background image for above-the-fold content
    const bgImage = new Image();

    // Determine correct path based on current page location
    const isSubPage = isSubpage();
    bgImage.src = isSubPage ? '../images/pexels-christian-fohrer-894172-2912103.jpg' : 'images/pexels-christian-fohrer-894172-2912103.jpg';

    // Preload logo image
    const logoImage = new Image();
    logoImage.src = isSubPage ? '../images/istockphoto-1400218353-612x612.jpg' : 'images/istockphoto-1400218353-612x612.jpg';

    // Preload header background
    const headerBgImage = new Image();
    headerBgImage.src = isSubPage ? '../images/direito-e-sustentabilidade.jpg' : 'images/direito-e-sustentabilidade.jpg';

    // When the background image is loaded, apply it to the background wrapper
    bgImage.onload = function() {
      const bgWrappers = document.querySelectorAll('.bg-wrapper.lazy-background');
      bgWrappers.forEach(wrapper => {
        wrapper.classList.add('visible');
      });
    };

    // Set header background image when loaded
    headerBgImage.onload = function() {
      const header = document.querySelector('header');
      if (header) {
        header.style.setProperty('--header-bg-image', `url("${headerBgImage.src}")`);
      }
    };

    // Set CSS variables for impact card backgrounds
    const root = document.documentElement;
    const basePath = isSubPage ? '../images/' : 'images/';

    root.style.setProperty('--climate-bg-image', `url("${basePath}istockphoto-1414916304-612x612.jpg")`);
    root.style.setProperty('--water-bg-image', `url("${basePath}direito-e-sustentabilidade.jpg")`);
    root.style.setProperty('--waste-bg-image', `url("${basePath}pexels-pok-rie-33563-3829454.jpg")`);
    root.style.setProperty('--section-bg-image', `url("${basePath}pexels-pok-rie-33563-3829454.jpg")`);
  } catch (error) {
    console.error('Error in preloadCriticalImages:', error);
  }
}

// Initialize module
export function initialize() {
  // Initialize lazy loading
  lazyLoadImages();

  // Re-check for new lazy load elements after DOM changes
  const mutationObserver = new MutationObserver(() => {
    lazyLoadImages();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Call preload function after a short delay to prioritize critical resources
  setTimeout(preloadCriticalImages, 100);
}
