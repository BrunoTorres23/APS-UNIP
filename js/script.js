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

    // Menu Toggle Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const content = document.querySelector('#content');
    const body = document.body;

    function toggleMenu() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
        content.classList.toggle('sidebar-active');
        body.classList.toggle('menu-open');
    }

    function closeMenu() {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            content.classList.remove('sidebar-active');
            body.classList.remove('menu-open');
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    sidebarOverlay.addEventListener('click', closeMenu);

    // Handle menu links
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const href = link.getAttribute('href');
                closeMenu();
                
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
                closeMenu();
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
        if (window.innerWidth <= 768) {
            const target = e.target;
            if (target.closest('.sidebar-nav a')) {
                e.preventDefault();
                const link = target.closest('.sidebar-nav a');
                const href = link.getAttribute('href');
                closeMenu();
                
                // Small delay to allow menu to close before navigation
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        }
    }, { passive: false });

    // Smooth scrolling with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
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

    // Enhanced card animations with touch support
    const cards = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card, .data-card, .case-card, .implementation-card, .additional-card');
    cards.forEach(card => {
        // Touch events
        card.addEventListener('touchstart', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });

        card.addEventListener('touchend', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-sm)';
        });

        // Mouse events
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
    const fadeElements = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card, .data-card, .case-card, .implementation-card, .additional-card');
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

    // Optimized parallax effect
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

    // Touch event handling for better mobile experience
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.sidebar') && window.innerWidth <= 768) {
            e.preventDefault();
        }
    }, { passive: false });
}); 