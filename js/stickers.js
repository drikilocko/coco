// Stickers floraux en relief sur le fond sable (#dcd5cf), de « Nos prestations » à « Mise en beauté ».
// Placés en zigzag gauche / droite, à moitié hors de l'écran (effet « split »).
// Apparition en fondu au premier passage à l’écran, puis le sticker reste affiché.
window.addEventListener('DOMContentLoaded', () => {
    const sections = Array.from(document.querySelectorAll('.sand-theme'));
    if (!sections.length) return;

    const images = [1, 2, 3, 4, 5, 6].map(index => `asset/stickers/fleur-${index}.webp?v=3`);
    // Positions verticales (en % de la hauteur de chaque section). Le côté alterne sur toute la page,
    // et les 6 fleurs se succèdent dans l'ordre : chacune revient plusieurs fois.
    const layout = {
        prestations: [10, 36, 62, 88],
        portfolio: [22, 72],
        realisations: [10, 36, 62, 88],
        'mise-en-beaute': [10, 36, 62, 88]
    };

    let stickerIndex = 0;
    const stickers = [];
    sections.forEach(section => {
        const positions = layout[section.id] ?? [30];
        positions.forEach(top => {
            const side = stickerIndex % 2 === 0 ? 'left' : 'right';
            const sticker = document.createElement('img');
            sticker.className = `bg-sticker bg-sticker-${side}`;
            sticker.src = images[stickerIndex % images.length];
            sticker.alt = '';
            sticker.setAttribute('aria-hidden', 'true');
            sticker.loading = 'lazy';
            sticker.decoding = 'async';
            sticker.style.top = `${top}%`;
            // Décalage pour que les stickers voisins ne clignotent pas en même temps
            sticker.style.setProperty("--sticker-delay", `${(stickerIndex % 2) * 0.25}s`);
            section.prepend(sticker);
            stickers.push(sticker);
            stickerIndex += 1;
        });
    });

    if (!('IntersectionObserver' in window)) {
        stickers.forEach(sticker => sticker.classList.add('is-in-view'));
        return;
    }

    // Apparition en fondu une seule fois, au premier passage : le sticker reste ensuite affiché.
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in-view');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });
    stickers.forEach(sticker => observer.observe(sticker));
});
