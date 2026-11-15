// Apparition floutée au défilement (même effet que l'accueil) pour les pages galerie et Event Planner.
// Chargé après les scripts de galerie : les cartes générées en JS existent déjà au moment du DOMContentLoaded.
window.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const selectors = [
        // Pages galerie
        '.gallery-heading',
        '.gallery-card',
        // Page Event Planner
        '.event-planner-hero-copy',
        '.event-planner-introduction > *',
        '.event-planner-section-heading',
        '.event-planner-offer',
        '.event-planner-experience-image',
        '.event-planner-experience-copy',
        '.event-planner-cta > *',
        // Toutes les pages
        '.site-footer'
    ];
    const targets = Array.from(document.querySelectorAll(selectors.join(', ')));
    if (!targets.length) return;

    // Léger décalage entre éléments voisins (par groupe de 3 pour les grilles)
    const indexes = new Map();
    targets.forEach(target => {
        const group = target.parentElement;
        const index = indexes.get(group) ?? 0;
        target.classList.add('scroll-reveal-item');
        target.style.setProperty('--scroll-reveal-delay', `${(index % 3) * 85}ms`);
        indexes.set(group, index + 1);
    });

    document.documentElement.classList.add('has-scroll-reveals');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(target => observer.observe(target));
});
