// Parallax léger des fonds photo : chaque section décale sa photo (::before) via la variable --parallax-y.
// Seules les sections visibles sont recalculées, une fois par image (requestAnimationFrame).
window.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = Array.from(document.querySelectorAll([
        'main > .testimonials-section',
        'main > .formats-section',
        'main > .personalities-section',
        'main > .numbers-section',
        'main > .logo-marquee-before-formats',
        'main > .project-contact'
    ].join(', ')));
    if (!sections.length) return;

    // Part de la hauteur de la section parcourue par la photo (reste dans la marge de 18 % prévue en CSS)
    const STRENGTH = 0.28;
    const visible = new Set();
    let frame = 0;

    const update = () => {
        frame = 0;
        const viewport = window.innerHeight;
        visible.forEach(section => {
            const rect = section.getBoundingClientRect();
            // -0,5 quand la section entre par le bas, +0,5 quand elle sort par le haut
            const rawProgress = (viewport / 2 - (rect.top + rect.height / 2)) / (viewport + rect.height);
            const progress = Math.max(-0.5, Math.min(0.5, rawProgress));
            const offset = progress * Math.min(rect.height, viewport) * STRENGTH;
            section.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
        });
    };

    const requestUpdate = () => {
        if (!frame && visible.size) frame = requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            });
            requestUpdate();
        }, { rootMargin: '10% 0px' });
        sections.forEach(section => observer.observe(section));
    } else {
        sections.forEach(section => visible.add(section));
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    requestUpdate();
});
