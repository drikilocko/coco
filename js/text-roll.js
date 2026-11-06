window.addEventListener('DOMContentLoaded', () => {
    const addTextRoll = element => {
        if (!(element instanceof HTMLElement)) return;

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode: node => {
                if (node.parentElement?.closest('svg, script, style')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const textNodes = [];
        const labelParts = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const hiddenElement = node.parentElement?.closest('[aria-hidden="true"]');
            if (!hiddenElement || !element.contains(hiddenElement)) {
                labelParts.push(node.textContent ?? '');
            }
            if (node.textContent?.trim() && !node.parentElement?.closest('.text-roll-word')) {
                textNodes.push(node);
            }
        }
        const label = labelParts.join('').replace(/\s+/g, ' ').trim();
        if (element.dataset.textRollLabel === 'true') {
            if (label) {
                element.setAttribute('aria-label', label);
            } else if (!element.querySelector('.text-roll-word')) {
                element.removeAttribute('aria-label');
                delete element.dataset.textRollLabel;
            }
        } else if (label && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
            element.setAttribute('aria-label', label);
            element.dataset.textRollLabel = 'true';
        }
        if (!textNodes.length) return;

        let characterIndex = 0;
        textNodes.forEach(textNode => {
            const fragment = document.createDocumentFragment();
            const parts = (textNode.textContent ?? '').split(/(\s+)/);
            parts.forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    fragment.append(document.createTextNode(part));
                    return;
                }

                const word = document.createElement('span');
                word.className = 'text-roll-word';
                const createLine = (isCopy = false) => {
                    const line = document.createElement('span');
                    line.className = 'text-roll-word-line';
                    if (isCopy) line.setAttribute('aria-hidden', 'true');
                    for (const [index, character] of Array.from(part).entries()) {
                        const letter = document.createElement('span');
                        letter.className = 'text-roll-letter';
                        letter.style.setProperty('--roll-delay', `${Math.min((characterIndex + index) * 12, 240)}ms`);
                        if (isCopy) {
                            letter.dataset.letter = character;
                        } else {
                            letter.textContent = character;
                        }
                        line.append(letter);
                    }
                    return line;
                };
                word.append(createLine(), createLine(true));
                fragment.append(word);
                characterIndex += Array.from(part).length;
            });
            textNode.replaceWith(fragment);
        });
        element.classList.add('has-text-roll');
    };

    const enhanceTextRoll = root => {
        if (root instanceof Element && root.matches('button, nav a')) addTextRoll(root);
        root.querySelectorAll?.('button, nav a').forEach(addTextRoll);
    };

    enhanceTextRoll(document);
    const observer = new MutationObserver(records => {
        records.forEach(record => {
            record.addedNodes.forEach(node => {
                if (node instanceof Element) {
                    enhanceTextRoll(node);
                } else if (node instanceof Text && !node.parentElement?.closest('.text-roll-word')) {
                    node.parentElement?.closest('button, nav a') && addTextRoll(node.parentElement.closest('button, nav a'));
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
