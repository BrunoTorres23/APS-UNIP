/**
 * Animations Module
 * Handles card animations and fade-in effects
 */
import { features } from './core.js';

// Setup card animations
function setupCardAnimations() {
  if (!features.isMobile) {
    const cards = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card, .data-card, .case-card, .implementation-card, .additional-card');
    cards.forEach(card => {
      // Add ARIA attributes to cards
      if (!card.hasAttribute('role')) {
        card.setAttribute('role', 'region');
      }

      // If card has a heading, associate it with the card
      const cardHeading = card.querySelector('h3');
      if (cardHeading && !card.hasAttribute('aria-labelledby') && cardHeading.id) {
        card.setAttribute('aria-labelledby', cardHeading.id);
      } else if (cardHeading && !cardHeading.id) {
        // Generate an ID if the heading doesn't have one
        const headingId = 'heading-' + Math.random().toString(36).substr(2, 9);
        cardHeading.id = headingId;
        card.setAttribute('aria-labelledby', headingId);
      }

      // Mouse events only for desktop
      card.addEventListener('mouseenter', () => {
        card.classList.add('card-hover');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('card-hover');
      });

      // Keyboard interaction
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.add('card-hover');
          // Simulate click if the card has a link
          const cardLink = card.querySelector('a');
          if (cardLink) {
            cardLink.click();
          }
        }
      });

      card.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          card.classList.remove('card-hover');
        }
      });
    });
  }
}

// Setup fade-in animations
function setupFadeInAnimations() {
  const fadeElements = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card, .data-card, .case-card, .implementation-card, .additional-card');

  // Add initial class to ensure elements start invisible
  fadeElements.forEach(element => {
    element.classList.add('fade-initial');
    // Add aria-hidden until the element is visible
    element.setAttribute('aria-hidden', 'true');
  });

  if (features.supportsIntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay to improve performance
          setTimeout(() => {
            entry.target.classList.add('fade-in');
            entry.target.classList.remove('fade-initial');
            // Remove aria-hidden when element becomes visible
            entry.target.removeAttribute('aria-hidden');
          }, 50);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    fadeElements.forEach(element => {
      element.classList.add('fade-in');
      element.classList.remove('fade-initial');
      element.removeAttribute('aria-hidden');
    });
  }
}

// Initialize module
export function initialize() {
  // Only run animations if reduced motion is not preferred
  if (!features.prefersReducedMotion) {
    setupCardAnimations();
    setupFadeInAnimations();
  }

  // Touch event handling for better mobile experience
  document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.sidebar') && features.isMobile) {
      e.preventDefault();
    }
  }, { passive: false });
}
