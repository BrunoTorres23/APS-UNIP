/**
 * UI Module
 * Handles menu, navigation, and other UI interactions
 */
import { features, getCurrentPage } from './core.js';

// Toggle menu function
function toggleMenu(menuToggle, sidebar, sidebarOverlay, content, body) {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', !isExpanded);
  sidebar.classList.toggle('active');
  sidebarOverlay.classList.toggle('active');
  menuToggle.classList.toggle('active');
  content.classList.toggle('sidebar-active');
  body.classList.toggle('menu-open');

  // Set focus to the first menu item when opening
  if (!isExpanded) {
    setTimeout(() => {
      const firstMenuItem = sidebar.querySelector('.sidebar-nav a');
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    }, 100);
  }
}

// Close menu function
function closeMenu(menuToggle, sidebar, sidebarOverlay, content, body) {
  if (sidebar.classList.contains('active')) {
    menuToggle.setAttribute('aria-expanded', 'false');
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    content.classList.remove('sidebar-active');
    body.classList.remove('menu-open');

    // Return focus to the menu toggle button
    menuToggle.focus();
  }
}

// Setup smooth scrolling
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Set active navigation item
function setActiveNavItem() {
  const currentPage = getCurrentPage();
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href.split('/').pop();
    
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Initialize module
export function initialize() {
  // Menu Toggle Functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  const content = document.querySelector('#content');
  const body = document.body;

  if (menuToggle && sidebar && sidebarOverlay) {
    menuToggle.addEventListener('click', () => toggleMenu(menuToggle, sidebar, sidebarOverlay, content, body));
    sidebarOverlay.addEventListener('click', () => closeMenu(menuToggle, sidebar, sidebarOverlay, content, body));

    // Handle menu links
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (features.isMobile) {
          e.preventDefault();
          const href = link.getAttribute('href');
          closeMenu(menuToggle, sidebar, sidebarOverlay, content, body);

          // Small delay to allow menu to close before navigation
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    });

    // Close menu on window resize if open
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
          closeMenu(menuToggle, sidebar, sidebarOverlay, content, body);
        }
      }, 250);
    });

    // Prevent touch events from scrolling the body when menu is open
    document.addEventListener('touchmove', (e) => {
      if (body.classList.contains('menu-open')) {
        e.preventDefault();
      }
    }, { passive: false });

    // Handle touch events for menu
    document.addEventListener('touchstart', (e) => {
      if (features.isMobile) {
        const target = e.target;
        if (target.closest('.sidebar-nav a')) {
          e.preventDefault();
          const link = target.closest('.sidebar-nav a');
          const href = link.getAttribute('href');
          closeMenu(menuToggle, sidebar, sidebarOverlay, content, body);

          // Small delay to allow menu to close before navigation
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      }
    }, { passive: false });
  }

  // Setup smooth scrolling
  setupSmoothScrolling();

  // Set active navigation item
  setActiveNavItem();
}
