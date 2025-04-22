/**
 * Theme Module
 * Handles theme switching functionality
 */

// Update theme icon based on current theme
function updateThemeIcon(theme, themeToggle) {
  const icon = themeToggle.querySelector('i');
  icon.className = theme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun';
}

// Initialize module
export function initialize() {
  // Theme Management
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
  themeToggle.setAttribute('aria-label', 'Alternar tema');
  document.body.appendChild(themeToggle);

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeToggle);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme, themeToggle);
  });
}
