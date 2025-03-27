document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Get elements
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleButton = document.createElement('button');
    toggleButton.className = 'btn btn-light d-md-none';
    toggleButton.innerHTML = '<i class="bi bi-list"></i>';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '1001';
    toggleButton.setAttribute('aria-label', 'Toggle Menu');

    // Add toggle button to header
    const header = document.querySelector('header');
    header.appendChild(toggleButton);

    // Toggle sidebar function
    function toggleSidebar() {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
        document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
        toggleButton.setAttribute('aria-expanded', sidebar.classList.contains('show'));
    }

    // Toggle sidebar on button click
    toggleButton.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !toggleButton.contains(event.target) && 
            sidebar.classList.contains('show')) {
            toggleSidebar();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
                document.body.style.overflow = '';
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });

    // Add smooth scrolling to all links
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

    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Add loading animation to feature cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.feature-card, .feature-item, .case-card').forEach(card => {
        observer.observe(card);
    });

    // Handle sidebar hover on desktop
    if (window.innerWidth > 768) {
        let hoverTimer;
        sidebar.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimer);
            sidebar.style.width = '250px';
        });

        sidebar.addEventListener('mouseleave', function() {
            hoverTimer = setTimeout(function() {
                sidebar.style.width = '4.5rem';
            }, 300);
        });
    }
}); 