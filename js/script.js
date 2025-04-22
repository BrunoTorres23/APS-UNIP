/**
 * Tecnologia e Sustentabilidade - Scripts
 *
 * Implementação de lazy loading para imagens:
 * - Usa Intersection Observer para detectar quando elementos entram na viewport
 * - Suporta imagens com tag <img> e imagens de fundo via CSS
 * - Pré-carrega imagens críticas para melhorar a experiência inicial
 * - Inclui fallback para navegadores que não suportam Intersection Observer
 */

document.addEventListener('DOMContentLoaded', function() {
    // Lazy Loading Utility
    function lazyLoadImages() {
        // Lazy load for regular images
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');

        // Lazy load for background images
        const lazyBackgrounds = document.querySelectorAll('.lazy-background');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.tagName.toLowerCase() === 'img') {
                            // Handle <img> elements
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                if (img.dataset.srcset) {
                                    img.srcset = img.dataset.srcset;
                                }
                            }
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        } else {
                            // Handle background images
                            img.classList.add('visible');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });

            lazyBackgrounds.forEach(bg => {
                imageObserver.observe(bg);
            });
        } else {
            // Fallback for browsers without IntersectionObserver support
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                img.classList.add('loaded');
            });

            lazyBackgrounds.forEach(bg => {
                bg.classList.add('visible');
            });
        }
    }

    // Initialize lazy loading
    lazyLoadImages();

    // Re-check for new lazy load elements after DOM changes
    const mutationObserver = new MutationObserver(() => {
        lazyLoadImages();
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Preload critical images
    function preloadCriticalImages() {
        // Preload the background image for above-the-fold content
        const bgImage = new Image();

        // Determine correct path based on current page location
        const isSubpage = window.location.pathname.includes('/paginas/') ||
                         window.location.pathname.includes('\\paginas\\') ||
                         window.location.pathname.includes('/paginas') ||
                         window.location.pathname.includes('\\paginas');
        bgImage.src = isSubpage ? '../images/pexels-christian-fohrer-894172-2912103.jpg' : 'images/pexels-christian-fohrer-894172-2912103.jpg';

        // Preload logo image
        const logoImage = new Image();
        logoImage.src = isSubpage ? '../images/istockphoto-1400218353-612x612.jpg' : 'images/istockphoto-1400218353-612x612.jpg';

        // Preload header background
        const headerBgImage = new Image();
        headerBgImage.src = isSubpage ? '../images/direito-e-sustentabilidade.jpg' : 'images/direito-e-sustentabilidade.jpg';

        // When the image is loaded, apply it to the background wrapper
        bgImage.onload = function() {
            const bgWrappers = document.querySelectorAll('.bg-wrapper.lazy-background');
            bgWrappers.forEach(wrapper => {
                wrapper.classList.add('visible');
            });
        };

        // Set header background image when loaded
        headerBgImage.onload = function() {
            const header = document.querySelector('header');
            if (header) {
                header.style.setProperty('--header-bg-image', `url("${headerBgImage.src}")`);
            }
        };

        // Set CSS variables for impact card backgrounds
        const root = document.documentElement;
        const basePath = isSubpage ? '../images/' : 'images/';

        // Use try-catch to handle potential errors with setting CSS variables
        try {
            root.style.setProperty('--climate-bg-image', `url("${basePath}istockphoto-1414916304-612x612.jpg")`);
            root.style.setProperty('--water-bg-image', `url("${basePath}direito-e-sustentabilidade.jpg")`);
            root.style.setProperty('--waste-bg-image', `url("${basePath}pexels-pok-rie-33563-3829454.jpg")`);

            // Also set the section background image variable
            root.style.setProperty('--section-bg-image', `url("${basePath}pexels-pok-rie-33563-3829454.jpg")`);
        } catch (error) {
            console.error('Error setting CSS variables:', error);
        }

    }

    // Call preload function after a short delay to prioritize critical resources
    setTimeout(preloadCriticalImages, 100);

    // Add subtle animation to images on scroll
    const animateImagesOnScroll = () => {
        const cardImages = document.querySelectorAll('.card-image img');
        const scrollY = window.scrollY;

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

    // Removido o código do efeito parallax do header

    // Menu Toggle Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const content = document.querySelector('#content');
    const body = document.body;

    function toggleMenu() {
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

    function closeMenu() {
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

    // Smooth scrolling (header is no longer fixed)
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

    // Set active page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Enhanced card animations with touch support - only for non-mobile devices
    if (window.innerWidth > 768) {
        const cards = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card, .data-card, .case-card, .implementation-card, .additional-card');

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

    // Intersection Observer for fade-in animations
    // Verificar se o navegador suporta prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const fadeElements = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card, .data-card, .case-card, .implementation-card, .additional-card');

        // Adicionar classe inicial para garantir que os elementos comecem invisíveis
        fadeElements.forEach(element => {
            element.classList.add('fade-initial');
            // Add aria-hidden until the element is visible
            element.setAttribute('aria-hidden', 'true');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Pequeno atraso para melhorar a performance
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
    }

    // Touch event handling for better mobile experience
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.sidebar') && window.innerWidth <= 768) {
            e.preventDefault();
        }
    }, { passive: false });
});
