// Pop-up « Lire plus » des pages galerie : panneau qui monte du bas, contenu enrichi
// (étiquettes, paragraphes, citations, fiche, étapes, liste) lu dans js/detail-content.js.
(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const createElement = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    };

    const renderBlock = block => {
        switch (block?.type) {
            case 'p':
                return createElement('p', 'detail-sheet-paragraph', block.text);
            case 'quote': {
                const figure = createElement('figure', 'detail-sheet-quote');
                figure.append(createElement('blockquote', '', `« ${block.text} »`));
                if (block.author) figure.append(createElement('figcaption', '', block.author));
                return figure;
            }
            case 'facts': {
                const list = createElement('dl', 'detail-sheet-facts');
                (block.items ?? []).forEach(([label, value]) => {
                    const row = createElement('div');
                    row.append(createElement('dt', '', label), createElement('dd', '', value));
                    list.append(row);
                });
                return list;
            }
            case 'steps':
            case 'list': {
                const wrapper = createElement('div', `detail-sheet-block detail-sheet-${block.type}`);
                if (block.title) wrapper.append(createElement('p', 'detail-sheet-block-title', block.title));
                const list = createElement(block.type === 'steps' ? 'ol' : 'ul');
                (block.items ?? []).forEach(item => list.append(createElement('li', '', item)));
                wrapper.append(list);
                return wrapper;
            }
            default:
                console.error('Bloc de contenu inconnu dans une pop-up « Lire plus » :', block);
                return null;
        }
    };

    // Remplit étiquettes, introduction et blocs pour le titre donné.
    const fill = ({ title, tagsElement, leadElement, moreElement, fallbackLead }) => {
        const extra = window.cocoDetailContent?.[title];
        if (leadElement) leadElement.textContent = extra?.lead ?? fallbackLead ?? '';
        if (tagsElement) {
            tagsElement.replaceChildren(...(extra?.tags ?? []).map(tag => createElement('li', '', tag)));
            tagsElement.hidden = !extra?.tags?.length;
        }
        if (moreElement) {
            moreElement.replaceChildren(...(extra?.blocks ?? []).map(renderBlock).filter(Boolean));
            moreElement.hidden = !extra?.blocks?.length;
        }
        if (!extra) console.warn(`Pas de contenu enrichi pour « ${title} ».`);
    };

    // Fermeture animée : le panneau redescend avant la fermeture réelle du dialogue.
    const close = dialog => {
        if (!dialog.open || dialog.classList.contains('is-closing')) return;
        if (prefersReducedMotion) {
            dialog.close();
            return;
        }
        dialog.classList.add('is-closing');
        let finished = false;
        const finishClose = () => {
            if (finished) return;
            finished = true;
            dialog.removeEventListener('animationend', onAnimationEnd);
            dialog.classList.remove('is-closing');
            dialog.close();
        };
        const onAnimationEnd = event => {
            if (event.target === dialog && !event.pseudoElement) finishClose();
        };
        dialog.addEventListener('animationend', onAnimationEnd);
        window.setTimeout(finishClose, 400);
    };

    // Échap, clic sur le fond et bouton de fermeture passent tous par la fermeture animée.
    const setup = (dialog, closeButton) => {
        dialog.addEventListener('cancel', event => {
            event.preventDefault();
            close(dialog);
        });
        dialog.addEventListener('click', event => {
            if (event.target === dialog) close(dialog);
        });
        closeButton?.addEventListener('click', () => close(dialog));
    };

    window.cocoDetailSheet = { fill, close, setup };
})();
