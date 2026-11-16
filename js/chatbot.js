// Conciergerie Coco : la fenêtre est créée ici pour être identique sur toutes les pages.
// Ce script est chargé en « defer » : il s'exécute avant DOMContentLoaded, donc avant main.js
// (qui fait tourner les messages de la bulle d'accueil).
(() => {
    if (document.querySelector('.site-chat')) return;
    const arrowIcon = '<svg class="ui-icon ui-icon-arrow-up-right" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9"/></svg>';
    const closeIcon = '<svg class="ui-icon ui-icon-close" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    // Bulle de conversation + étoile : l'assistant de la Maison
    const assistantIcon = '<svg class="site-chat-launcher-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">'
        + '<path class="site-chat-launcher-bubble" d="M26.5 15.2c0 5.6-4.9 10-10.9 10-1.5 0-2.9-.3-4.2-.8L5.5 26.5l1.8-5.1a9.6 9.6 0 0 1-2.6-6.2c0-5.6 4.9-10 10.9-10s10.9 4.4 10.9 10Z"/>'
        + '<path class="site-chat-launcher-spark" d="M15.6 9.2l1.2 3.4 3.4 1.2-3.4 1.2-1.2 3.4-1.2-3.4-3.4-1.2 3.4-1.2 1.2-3.4Z"/>'
        + '<circle class="site-chat-launcher-spark" cx="21.4" cy="19.4" r="1.1"/>'
        + '</svg>';
    const chat = document.createElement('section');
    chat.className = 'site-chat';
    chat.setAttribute('aria-label', 'Conciergerie Coco Miracles');
    chat.innerHTML = `
        <div class="site-chat-launcher-group">
            <p class="site-chat-greeting">Bonjour, je suis l’assistant Coco.<br>Que puis-je faire pour vous ?</p>
            <button class="site-chat-launcher" type="button" aria-label="Ouvrir l’assistant Coco Miracles" aria-expanded="false" aria-controls="site-chat-panel">
                <span class="site-chat-launcher-mark" aria-hidden="true">${assistantIcon}</span>
            </button>
        </div>
        <div class="site-chat-panel" id="site-chat-panel" aria-label="Assistant Coco Miracles" hidden>
            <header class="site-chat-header">
                <span class="site-chat-avatar" aria-hidden="true">CM</span>
                <div>
                    <h2>Conciergerie Coco</h2>
                    <p><span class="site-chat-status-dot"></span> À votre écoute</p>
                </div>
                <button class="site-chat-close" type="button" aria-label="Fermer la conversation">${closeIcon}</button>
            </header>
            <div class="site-chat-messages" role="log" aria-live="polite" aria-relevant="additions text" data-lenis-prevent>
                <div class="site-chat-message site-chat-message-assistant">
                    <p>Bonjour et bienvenue chez Coco Miracles. Comment puis-je vous guider dans votre projet ?</p>
                </div>
            </div>
            <div class="site-chat-suggestions" aria-label="Questions fréquentes">
                <button type="button">Quels services proposez-vous ?</button>
                <button type="button">Quels sont vos tarifs ?</button>
                <button type="button">Comment vous contacter ?</button>
            </div>
            <form class="site-chat-form">
                <label class="site-chat-sr-only" for="site-chat-input">Votre message</label>
                <textarea id="site-chat-input" name="message" rows="1" maxlength="1200" placeholder="Écrivez votre question…" required></textarea>
                <button type="submit" aria-label="Envoyer le message"><span aria-hidden="true">${arrowIcon}</span></button>
            </form>
            <p class="site-chat-disclaimer">Assistant dédié à l’univers et aux services Coco Miracles.</p>
        </div>`;
    document.body.append(chat);
})();

window.addEventListener('DOMContentLoaded', () => {
    const widget = document.querySelector('.site-chat');
    const launcher = widget?.querySelector('.site-chat-launcher');
    const panel = widget?.querySelector('.site-chat-panel');
    const closeButton = widget?.querySelector('.site-chat-close');
    const messageList = widget?.querySelector('.site-chat-messages');
    const form = widget?.querySelector('.site-chat-form');
    const input = widget?.querySelector('#site-chat-input');
    const sendButton = form?.querySelector('button[type="submit"]');

    if (
        !(widget instanceof HTMLElement) ||
        !(launcher instanceof HTMLButtonElement) ||
        !(panel instanceof HTMLElement) ||
        !(closeButton instanceof HTMLButtonElement) ||
        !(messageList instanceof HTMLElement) ||
        !(form instanceof HTMLFormElement) ||
        !(input instanceof HTMLTextAreaElement) ||
        !(sendButton instanceof HTMLButtonElement)
    ) {
        console.error('Impossible de configurer la conciergerie Coco Miracles.');
        return;
    }

    const conversation = [];
    const suggestions = Array.from(widget.querySelectorAll('.site-chat-suggestions button'));
    // Liens que l'assistant peut proposer : sections de l'accueil et autres pages du site
    const sectionLinkIds = new Set([
        'univers',
        'direction',
        'savoir-faire',
        'prestations',
        'portfolio',
        'realisations',
        'formats',
        'mise-en-beaute',
        'project-contact-title'
    ]);
    const pageLinks = new Set(['index.html', 'event-planner.html', 'galerie-portfolio.html', 'galerie-beaute.html']);
    const resolveChatLink = target => {
        // « #section » : section de l'accueil (sur une autre page, on renvoie vers l'accueil)
        const [page, anchor = ''] = target.split('#');
        if (!page) {
            if (!sectionLinkIds.has(anchor)) return null;
            return document.getElementById(anchor) ? `#${anchor}` : `index.html#${anchor}`;
        }
        if (!pageLinks.has(page)) return null;
        if (anchor && !(page === 'index.html' && sectionLinkIds.has(anchor))) return page;
        return anchor ? `${page}#${anchor}` : page;
    };
    const minimumResponseTime = 900;
    let requestPending = false;
    let closeTimer;
    let panelTransition;
    let launcherTransition;

    const scrollMessagesToBottom = () => {
        messageList.scrollTop = messageList.scrollHeight;
    };

    const finishClose = () => {
        panel.hidden = true;
        panel.inert = false;
        panel.classList.remove('is-closing');
    };

    const cancelTransitions = () => {
        window.clearTimeout(closeTimer);
        panelTransition?.cancel();
        launcherTransition?.cancel();
        panelTransition = undefined;
        launcherTransition = undefined;
    };

    const animateSharedTransition = (open, anchorBounds) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (!open) finishClose();
            return;
        }

        const panelBounds = panel.getBoundingClientRect();
        const originTransform =
            `translate(${anchorBounds.left - panelBounds.left}px, ${anchorBounds.top - panelBounds.top}px) ` +
            `scale(${anchorBounds.width / panelBounds.width}, ${anchorBounds.height / panelBounds.height})`;
        const panelFrames = open
            ? [
                { transformOrigin: 'top left', transform: originTransform, opacity: 0.65 },
                { transformOrigin: 'top left', transform: 'translate(0, 0) scale(1)', opacity: 1 }
            ]
            : [
                { transformOrigin: 'top left', transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transformOrigin: 'top left', transform: originTransform, opacity: 0.65 }
            ];
        panelTransition = panel.animate(panelFrames, {
            duration: open ? 520 : 420,
            easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)',
            fill: 'both'
        });
        launcherTransition = launcher.animate(
            open
                ? [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.72)' }]
                : [{ opacity: 0, transform: 'scale(0.72)' }, { opacity: 1, transform: 'scale(1)' }],
            {
                duration: open ? 360 : 320,
                easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)',
                fill: 'both'
            }
        );

        panelTransition.onfinish = () => {
            panelTransition?.cancel();
            panelTransition = undefined;
            if (!open) {
                window.clearTimeout(closeTimer);
                finishClose();
            }
        };
        launcherTransition.onfinish = () => {
            launcherTransition?.cancel();
            launcherTransition = undefined;
        };
        if (!open) closeTimer = window.setTimeout(finishClose, 600);
    };

    const appendFormattedText = (paragraph, text, animationState) => {
        const plainText = text.replace(/\*/g, '');
        const linkPattern = /\[([^\]]+)\]\(((?:[a-z0-9-]+\.html)?(?:#[a-z0-9-]+)?)\)/g;
        let cursor = 0;

        const appendRun = (container, value, linkLabel) => {
            if (!animationState) {
                container.append(document.createTextNode(value));
                return;
            }

            if (linkLabel) container.setAttribute('aria-label', linkLabel);
            for (const character of value) {
                const span = document.createElement('span');
                span.className = 'site-chat-char';
                span.setAttribute('aria-hidden', 'true');
                span.style.setProperty('--char-delay', `${animationState.index * animationState.stagger}ms`);
                span.textContent = character;
                container.append(span);
                animationState.index += 1;
            }
        };

        for (const match of plainText.matchAll(linkPattern)) {
            const [source, label, target] = match;
            const index = match.index ?? 0;
            appendRun(paragraph, plainText.slice(cursor, index));
            const href = target ? resolveChatLink(target) : null;
            if (href) {
                const link = document.createElement('a');
                link.href = href;
                appendRun(link, label, label);
                paragraph.append(link);
            } else {
                appendRun(paragraph, source);
            }
            cursor = index + source.length;
        }

        appendRun(paragraph, plainText.slice(cursor));
    };

    const appendMessage = (text, role, animate = false) => {
        const message = document.createElement('div');
        message.className = `site-chat-message site-chat-message-${role}`;
        const paragraph = document.createElement('p');
        const animationState = animate
            ? { index: 0, stagger: Math.min(10, 1800 / Math.max(1, text.length - 1)) }
            : null;
        if (animate) {
            paragraph.setAttribute('aria-label', text.replace(/\*/g, '').replace(/\[([^\]]+)\]\(([^)\s]*)\)/g, '$1'));
        }
        text.split(/\r?\n/).forEach((line, index) => {
            if (index > 0) paragraph.append(document.createElement('br'));
            appendFormattedText(paragraph, line, animationState);
        });

        message.appendChild(paragraph);
        messageList.appendChild(message);
        scrollMessagesToBottom();
        return message;
    };

    const setOpen = open => {
        cancelTransitions();
        if (open) {
            const anchorBounds = launcher.getBoundingClientRect();
            panel.hidden = false;
            panel.inert = false;
            panel.classList.remove('is-closing');
            launcher.setAttribute('aria-expanded', 'true');
            widget.classList.add('is-open');
            animateSharedTransition(true, anchorBounds);
            input.focus({ preventScroll: true });
            return;
        }
        if (panel.hidden || panel.classList.contains('is-closing')) return;

        const anchorBounds = launcher.getBoundingClientRect();
        panel.classList.add('is-closing');
        panel.inert = true;
        launcher.setAttribute('aria-expanded', 'false');
        widget.classList.remove('is-open');
        animateSharedTransition(false, anchorBounds);
    };

    launcher.addEventListener('click', () => setOpen(panel.hidden || panel.classList.contains('is-closing')));
    closeButton.addEventListener('click', () => {
        setOpen(false);
        launcher.focus({ preventScroll: true });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !panel.hidden && !panel.classList.contains('is-closing')) {
            setOpen(false);
            launcher.focus({ preventScroll: true });
        }
    });

    const submitQuestion = async question => {
        if (requestPending || !question) return;
        requestPending = true;
        const responseStartedAt = performance.now();
        input.value = '';
        input.disabled = true;
        sendButton.disabled = true;
        suggestions.forEach(button => {
            button.disabled = true;
        });

        appendMessage(question, 'user');
        const thinking = document.createElement('div');
        thinking.className = 'site-chat-message site-chat-message-assistant site-chat-thinking';
        thinking.setAttribute('role', 'status');
        thinking.setAttribute('aria-label', 'La conciergerie prépare sa réponse');
        thinking.innerHTML = '<span></span><span></span><span></span>';
        messageList.appendChild(thinking);
        scrollMessagesToBottom();

        const messages = [...conversation, { role: 'user', text: question }].slice(-12);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });
            let result;
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.toLowerCase().includes('application/json')) {
                throw new Error('Le serveur local ne reconnaît pas la route du chat. Lancez demarrer.bat puis ouvrez http://localhost:8000.');
            }
            try {
                result = await response.json();
            } catch {
                throw new Error('Le service du chat a renvoyé une réponse illisible. Réessayez ou contactez-nous à cocomiracles@gmail.com.');
            }
            if (!response.ok || typeof result.reply !== 'string' || !result.reply.trim()) {
                throw new Error(typeof result.error === 'string'
                    ? result.error
                    : 'Je rencontre un petit souci. Vous pouvez réessayer dans un instant.');
            }

            await new Promise(resolve => window.setTimeout(
                resolve,
                Math.max(0, minimumResponseTime - (performance.now() - responseStartedAt))
            ));
            conversation.push(
                { role: 'user', text: question },
                { role: 'model', text: result.reply }
            );
            conversation.splice(0, Math.max(0, conversation.length - 12));
            thinking.remove();
            appendMessage(result.reply.trim(), 'assistant', true);
        } catch (error) {
            await new Promise(resolve => window.setTimeout(
                resolve,
                Math.max(0, minimumResponseTime - (performance.now() - responseStartedAt))
            ));
            thinking.remove();
            const errorMessage = error instanceof TypeError
                ? 'Je n’arrive pas à joindre le serveur local. Lancez demarrer.bat, ouvrez http://localhost:8000 et vérifiez que votre clé Gemini est configurée dans .env.local.'
                : error instanceof Error
                    ? error.message
                    : 'Je rencontre un petit souci. Vous pouvez réessayer dans un instant.';
            appendMessage(errorMessage, 'assistant');
        } finally {
            requestPending = false;
            input.disabled = false;
            sendButton.disabled = false;
            suggestions.forEach(button => {
                button.disabled = false;
            });
            if (!panel.hidden && !panel.classList.contains('is-closing')) input.focus({ preventScroll: true });
        }
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        submitQuestion(question);
    });

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    suggestions.forEach(button => {
        button.addEventListener('click', () => {
            submitQuestion(button.textContent.trim());
        });
    });
});
