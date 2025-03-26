document.addEventListener('DOMContentLoaded', function() {
    // Add toggle button to header
    const header = document.querySelector('header');
    const toggleButton = document.createElement('button');
    toggleButton.className = 'btn btn-light d-md-none';
    toggleButton.innerHTML = '<i class="bi bi-list"></i>';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '1000';
    header.appendChild(toggleButton);

    // Toggle sidebar
    toggleButton.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = toggleButton;
        
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !toggleBtn.contains(event.target) && 
            !sidebar.classList.contains('active')) {
            sidebar.classList.add('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
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
    document.querySelectorAll('.nav-links a, .components a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.parentElement.classList.add('active');
        }
    });

    // Add loading animation to feature cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('.feature-card, .feature-item, .case-card').forEach(card => {
        observer.observe(card);
    });
}); 