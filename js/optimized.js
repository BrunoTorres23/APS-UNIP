document.addEventListener('DOMContentLoaded', () => {
  // Configurações e detecção de recursos
  const features = {
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isMobile: window.innerWidth <= 768,
    supportsModules: 'noModule' in document.createElement('script')
  };


  // Lazy Loading - Funcionalidade essencial
  function lazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    const lazyBackgrounds = document.querySelectorAll('.lazy-background');

    if (features.supportsIntersectionObserver) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.tagName.toLowerCase() === 'img') {
              if (img.dataset.src) {
                img.src = '';
                if (img.dataset.srcset) img.srcset = '';
              }
              img.classList.add('loaded');
            } else {
              img.classList.add('visible');
            }
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px 0px', threshold: 0.01 });

      lazyImages.forEach(img => imageObserver.observe(img));
      lazyBackgrounds.forEach(bg => imageObserver.observe(bg));
    } else {
      // Fallback simples
      lazyImages.forEach(img => {
        if (img.dataset.src) img.src = '';
        img.classList.add('loaded');
      });
    }
  }

  // Animações de fade-in - Funcionalidade essencial
  function setupFadeAnimations() {
    if (features.prefersReducedMotion) return;

    const fadeElements = document.querySelectorAll('.feature-card, .impact-card, .solution-card, .reference-card, .data-card, .case-card, .implementation-card, .additional-card');

    fadeElements.forEach(el => {
      el.classList.add('fade-initial');
      el.setAttribute('aria-hidden', 'true');
    });

    if (features.supportsIntersectionObserver) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('fade-in');
              entry.target.classList.remove('fade-initial');
              entry.target.removeAttribute('aria-hidden');
            }, 50);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      fadeElements.forEach(el => observer.observe(el));
    } else {
      // Fallback simples
      fadeElements.forEach(el => {
        el.classList.add('fade-in');
        el.classList.remove('fade-initial');
        el.removeAttribute('aria-hidden');
      });
    }
  }

  // Gerenciamento de tema
  function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Alternar tema');
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.innerHTML = newTheme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
    });
  }

  // Menu móvel
  function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('active'));
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Indicador de carregamento
  function setupLoadingIndicator() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    document.body.appendChild(loadingIndicator);

    document.querySelectorAll('a').forEach(link => {
      if (link.href && !link.href.includes('#') && !link.href.includes('javascript:')) {
        link.addEventListener('click', () => loadingIndicator.classList.add('active'));
      }
    });

    window.addEventListener('load', () => loadingIndicator.classList.remove('active'));
  }

  // Inicialização
  function init() {
    setupLoadingIndicator();
    lazyLoad();
    setupFadeAnimations();
    setupTheme();
    setupMobileMenu();

    // Marcar página atual no menu
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // Iniciar
  init();
});
