window.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.hero-header');
    const content = header?.querySelector('.hero-header-content');
    const menuButton = header?.querySelector('.hero-menu-toggle');
    if (!(header instanceof HTMLElement) || !(content instanceof HTMLElement) || !(menuButton instanceof HTMLButtonElement)) return;

    const setMenuOpen = isOpen => {
        content.classList.toggle('is-menu-open', isOpen);
        header.classList.toggle('is-menu-open', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        document.body.classList.toggle('mobile-menu-open', isOpen);
        if (isOpen) header.classList.remove('is-scroll-hidden');
    };

    menuButton.addEventListener('click', () => {
        setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    content.querySelectorAll('.hero-nav a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('pointerdown', event => {
        if (menuButton.getAttribute('aria-expanded') === 'true' && event.target instanceof Node && !content.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            menuButton.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) setMenuOpen(false);
    }, { passive: true });

    let lastScrollY = window.scrollY;
    let framePending = false;
    window.addEventListener('scroll', () => {
        if (framePending) return;
        framePending = true;
        window.requestAnimationFrame(() => {
            const currentScrollY = Math.max(0, window.scrollY);
            const delta = currentScrollY - lastScrollY;
            const menuIsOpen = menuButton.getAttribute('aria-expanded') === 'true';
            header.classList.toggle('is-scrolled', currentScrollY > 60);
            if (currentScrollY <= 60 || menuIsOpen) {
                header.classList.remove('is-scroll-hidden');
            } else if (delta > 8) {
                header.classList.add('is-scroll-hidden');
            } else if (delta < -8) {
                header.classList.remove('is-scroll-hidden');
            }
            lastScrollY = currentScrollY;
            framePending = false;
        });
    }, { passive: true });

    header.addEventListener('focusin', () => header.classList.remove('is-scroll-hidden'));
});
