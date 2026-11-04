// ==========================================================================
// INTERACTIVIDAD, NAVEGACIÓN ACCESIBLE Y ANIMACIONES DE SCROLL
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navHeader = document.querySelector('.nav-main');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav ul');
    const navLinks = document.querySelectorAll('.nav ul a');
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const projectCards = document.querySelectorAll('.project-tarjeta');
    const sections = document.querySelectorAll('section[id]');

    // 1. Menú móvil accesible
    const closeMobileMenu = () => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute(
                'aria-label',
                isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navMenu.classList.contains('nav-open')) {
                closeMobileMenu();
                navToggle.focus();
            }
        });
    }

    // 2. Desplazamiento suave seguro en enlaces internos
    internalLinks.forEach((link) => {
        link.addEventListener('click', function (event) {
            const targetSelector = this.getAttribute('href');
            if (!targetSelector || targetSelector === '#') return;

            const destino = document.querySelector(targetSelector);
            if (!destino) return;

            event.preventDefault();
            closeMobileMenu();

            destino.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start',
            });

            if (history.pushState) {
                history.pushState(null, '', targetSelector);
            }
        });
    });

    // 3. Animación de entrada de tarjetas (.project-tarjeta -> .visible)
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        projectCards.forEach((tarjeta) => tarjeta.classList.add('visible'));
    } else {
        const cardObserver = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        projectCards.forEach((tarjeta, index) => {
            tarjeta.style.transitionDelay = `${(index % 3) * 80}ms`;
            cardObserver.observe(tarjeta);
        });
    }

    // 4. Estado de barra de navegación al hacer scroll e indicador de sección activa
    const updateNavigationState = () => {
        if (navHeader) {
            navHeader.classList.toggle('nav-scrolled', window.scrollY > 20);
        }

        let currentSectionId = '';
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id') || '';
            }
        });

        navLinks.forEach((navLink) => {
            const href = navLink.getAttribute('href');
            const isActive = Boolean(currentSectionId && href === `#${currentSectionId}`);
            navLink.classList.toggle('active', isActive);
            if (isActive) {
                navLink.setAttribute('aria-current', 'page');
            } else {
                navLink.removeAttribute('aria-current');
            }
        });
    };

    window.addEventListener('scroll', updateNavigationState, { passive: true });
    updateNavigationState();
});
