/**
 * Images Module
 * Handles image loading, processing, and CSS variable setting
 */
import { isSubpage } from './core.js';

// Set CSS variables for all image paths
function setCSSImageVariables() {
  try {
    const root = document.documentElement;
    const isSubPage = isSubpage();
    const basePath = isSubPage ? '../images/' : 'images/';

    // Background images
    root.style.setProperty('--bg-main-image', `url("${basePath}pexels-christian-fohrer-894172-2912103.jpg")`);
    root.style.setProperty('--header-bg-image', `url("${basePath}direito-e-sustentabilidade.jpg")`);

    // Card background images
    root.style.setProperty('--climate-bg-image', `url("${basePath}istockphoto-1414916304-612x612.jpg")`);
    root.style.setProperty('--water-bg-image', `url("${basePath}direito-e-sustentabilidade.jpg")`);
    root.style.setProperty('--waste-bg-image', `url("${basePath}pexels-pok-rie-33563-3829454.jpg")`);

    // Section background images
    root.style.setProperty('--section-bg-image', `url("${basePath}pexels-pok-rie-33563-3829454.jpg")`);
    root.style.setProperty('--metodologia-bg-image', `url("${basePath}direito-e-sustentabilidade.jpg")`);
  } catch (error) {
    console.error('Error setting CSS image variables:', error);
  }
}

// Add image hover effects
function setupImageHoverEffects() {
  // Add hover effect for card images
  document.querySelectorAll('.card-image').forEach(imageContainer => {
    imageContainer.addEventListener('mouseenter', () => {
      const img = imageContainer.querySelector('img');
      if (img) img.style.transform = 'scale(1.05)';
    });

    imageContainer.addEventListener('mouseleave', () => {
      const img = imageContainer.querySelector('img');
      if (img) img.style.transform = 'scale(1)';
    });
  });
}

// Add subtle animation to images on scroll
function setupScrollAnimations() {
  const animateImagesOnScroll = () => {
    const cardImages = document.querySelectorAll('.card-image img');

    cardImages.forEach(img => {
      const parent = img.closest('.feature-card');
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInView) {
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const scale = 1 + (scrollProgress * 0.05);
        img.style.transform = `scale(${Math.min(scale, 1.05)})`;
      }
    });
  };

  // Only add scroll animation if user doesn't prefer reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', animateImagesOnScroll, { passive: true });
  }
}

// Fix background images for specific sections
function fixSectionBackgrounds() {
  // Fix metodologia section background
  const metodologiaSection = document.getElementById('metodologia');
  if (metodologiaSection) {
    const isSubPage = isSubpage();
    const basePath = isSubPage ? '../images/' : 'images/';
    metodologiaSection.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('${basePath}direito-e-sustentabilidade.jpg')`;
  }

  // Fix impact section background
  const impactSection = document.getElementById('impacto');
  if (impactSection && impactSection.classList.contains('with-bg-image')) {
    impactSection.style.setProperty('--section-bg-image', 'var(--section-bg-image)');
  }
}

// Handle theme changes
function setupThemeListener() {
  document.addEventListener('themeChanged', (e) => {
    // Adjust image filters based on theme
    const root = document.documentElement;
    const theme = e.detail.theme;

    if (theme === 'dark') {
      root.style.setProperty('--image-filter', 'brightness(0.8) contrast(1.2)');
    } else {
      root.style.setProperty('--image-filter', 'none');
    }
  });

  // Set initial filter based on current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const root = document.documentElement;

  if (currentTheme === 'dark') {
    root.style.setProperty('--image-filter', 'brightness(0.8) contrast(1.2)');
  } else {
    root.style.setProperty('--image-filter', 'none');
  }
}

// Initialize module
export function initialize() {
  try {
    // Set CSS variables for image paths
    setCSSImageVariables();

    // Setup image hover effects
    setupImageHoverEffects();

    // Setup scroll animations
    setupScrollAnimations();

    // Fix section backgrounds
    fixSectionBackgrounds();

    // Setup theme listener
    setupThemeListener();

    // Log success
    console.log('Images module initialized successfully');
  } catch (error) {
    console.error('Error initializing images module:', error);
  }
}
