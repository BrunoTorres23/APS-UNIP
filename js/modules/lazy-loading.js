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
  // Preload the background image for above-the-fold content
  const bgImage = new Image();

  // Determine correct path based on current page location
  bgImage.src = isSubpage() ? '../images/direito-e-sustentabilidade.jpg' : 'images/direito-e-sustentabilidade.jpg';

  // When the image is loaded, apply it to the background wrapper
  bgImage.onload = function() {
    const bgWrappers = document.querySelectorAll('.bg-wrapper.lazy-background');
    bgWrappers.forEach(wrapper => {
      wrapper.classList.add('visible');
    });
  };
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
