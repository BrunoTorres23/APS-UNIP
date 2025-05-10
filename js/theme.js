document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        // Set initial theme
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme, themeToggle);
        } else if (prefersDarkScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark', themeToggle);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            updateThemeIcon('light', themeToggle);
        }

        // Add click event listener
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, themeToggle);
        });
    }

    // Update theme icon based on current theme
    function updateThemeIcon(theme, button) {
        const icon = button.querySelector('i');
        if (icon) {
            if (theme === 'light') {
                icon.className = 'bi bi-moon';
                button.setAttribute('title', 'Mudar para tema escuro');
            } else {
                icon.className = 'bi bi-sun';
                button.setAttribute('title', 'Mudar para tema claro');
            }
        }
    }
});