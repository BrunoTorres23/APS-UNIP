/**
 * Theme Module
 * Handles theme switching functionality
 */

// Update theme icon based on current theme
function updateThemeIcon(theme, themeToggle) {
  if (!themeToggle) return;

  const icon = themeToggle.querySelector('i');
  if (!icon) return;

  if (theme === 'light') {
    icon.className = 'bi bi-moon';
    themeToggle.setAttribute('title', 'Mudar para tema escuro');
  } else {
    icon.className = 'bi bi-sun';
    themeToggle.setAttribute('title', 'Mudar para tema claro');
  }
}

// Check for system dark mode preference
function getSystemThemePreference() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Initialize module
export function initialize() {
  try {
    // Remove any existing theme toggle to avoid duplicates
    const existingToggle = document.querySelector('.theme-toggle');
    if (existingToggle) {
      existingToggle.remove();
    }

    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Alternar tema');

    // Position the theme toggle in the header
    const header = document.querySelector('header .container');
    if (header) {
      header.appendChild(themeToggle);
    } else {
      // Fallback to body if header not found
      document.body.appendChild(themeToggle);
    }

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') || getSystemThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeToggle);

    // Add click event listener
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme, themeToggle);

      // Dispatch a custom event that other modules can listen for
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only apply if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          updateThemeIcon(newTheme, themeToggle);
        }
      });
    }

    console.log('Theme module initialized successfully');
  } catch (error) {
    console.error('Error initializing theme module:', error);
  }
}
