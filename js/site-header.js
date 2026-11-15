window.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.hero-header');
    const content = header?.querySelector('.hero-header-content');
    const menuButton = header?.querySelector('.hero-menu-toggle');
    if (!(header instanceof HTMLElement) || !(content instanceof HTMLElement) || !(menuButton instanceof HTMLButtonElement)) return;

    // Pied du menu mobile : appel à l’action + coordonnées directes.
    if (!content.querySelector('.hero-menu-footer')) {
        const footer = document.createElement('div');
        footer.className = 'hero-menu-footer';
        footer.innerHTML = `
            <a class="hero-menu-cta" href="./index.html#project-contact-title">Parlons de votre projet <span aria-hidden="true"><svg class="ui-icon ui-icon-arrow-right" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>
            <div class="hero-menu-contact">
                <a href="tel:+22890499996">+228 90 49 99 96</a>
                <a href="tel:+22898667878">+228 98 66 78 78</a>
            </div>`;
        content.append(footer);
    }

    // Bouton « Consultation » (mobile uniquement, à gauche) : ouvre la pop-up de contact.
    // Sur l'accueil la pop-up est sur place ; ailleurs, on y va et elle s'ouvre à l'arrivée.
    if (!content.querySelector('.hero-consult-button')) {
        const hasContactDialog = Boolean(document.querySelector('#contact-dialog'));
        const consult = document.createElement('a');
        consult.className = 'hero-consult-button';
        consult.href = hasContactDialog ? '#contact-dialog' : 'index.html#contact-dialog';
        consult.textContent = 'Consultation';
        consult.setAttribute('aria-label', 'Demander une consultation');
        content.append(consult);
    }

    // Met en évidence la page courante dans le menu.
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    content.querySelectorAll('.hero-nav a').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('#')) return;
        if (href.replace('./', '') === currentPage) link.setAttribute('aria-current', 'page');
    });

    const getFocusableItems = () => Array.from(content.querySelectorAll('a[href], button'))
        .filter(element => element instanceof HTMLElement && element.offsetParent !== null);

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

    content.querySelectorAll('.hero-nav a, .hero-menu-footer a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    // Garde le focus clavier à l’intérieur du menu ouvert.
    content.addEventListener('keydown', event => {
        if (event.key !== 'Tab' || menuButton.getAttribute('aria-expanded') !== 'true') return;
        const items = getFocusableItems();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
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
