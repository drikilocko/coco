window.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.gallery-menu-toggle');
    const navigation = document.querySelector('#gallery-navigation');
    if (!(menuButton instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) return;

    const setMenuOpen = isOpen => {
        navigation.classList.toggle('is-open', isOpen);
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        document.body.classList.toggle('gallery-menu-open', isOpen);
    };

    menuButton.addEventListener('click', () => {
        setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            menuButton.focus();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) setMenuOpen(false);
    });
});
