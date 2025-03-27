document.addEventListener('DOMContentLoaded', function() {
    // Theme Management
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
    themeToggle.setAttribute('aria-label', 'Alternar tema');
    document.body.appendChild(themeToggle);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun';
    }

    // Loading Indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    document.body.appendChild(loadingIndicator);

    // Show loading indicator on navigation
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (link.href && !link.href.includes('#')) {
                loadingIndicator.classList.add('active');
            }
        });
    });

    // Hide loading indicator when page loads
    window.addEventListener('load', () => {
        loadingIndicator.classList.remove('active');
    });

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Menu lateral
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const menuToggle = document.querySelector('.menu-toggle');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        
        // Update ARIA attributes
        const isExpanded = sidebar.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        sidebar.setAttribute('aria-hidden', !isExpanded);
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.setAttribute('aria-controls', 'sidebar');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a link on mobile
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'false');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Set active page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Enhanced card animations
    const cards = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-sm)';
        });
    });

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
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

    // Parallax effect for header
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const header = document.querySelector('header');
                const scrolled = window.pageYOffset;
                header.style.transform = `translateY(${scrolled * 0.5}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}); 