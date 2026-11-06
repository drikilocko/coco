(() => {
    const transitionKey = 'coco-miracles-nav-transition';
    const coverDuration = 760;
    const transitionDuration = 2000;
    const textRevealDelay = 280;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const normalizeText = value => value.replace(/\s+/g, ' ').trim();

    const getLinkLabel = link => {
        if (link.matches('.hero-brand')) return 'Coco Miracles';
        if (link.matches('.brand-logo')) return 'Coco Miracles';
        return normalizeText(link.getAttribute('aria-label') || link.textContent || '');
    };

    const buildTitle = (container, label) => {
        const words = normalizeText(label).split(' ').filter(Boolean);
        const titleWords = words.length === 1 ? ['Découvre', 'notre', words[0]] : words;
        titleWords.forEach((word, wordIndex) => {
            const wordElement = document.createElement(wordIndex === titleWords.length - 1 ? 'em' : 'span');
            wordElement.className = 'nav-page-transition-word';
            Array.from(word).forEach((character, characterIndex) => {
                const letter = document.createElement('span');
                letter.className = 'nav-page-transition-letter';
                letter.style.setProperty('--nav-letter-delay', `${Math.min((wordIndex * 12 + characterIndex) * 24, 720)}ms`);
                letter.textContent = character;
                wordElement.append(letter);
            });
            container.append(wordElement);
        });
    };

    const makeOverlay = label => {
        const overlay = document.createElement('div');
        overlay.className = 'nav-page-transition';
        overlay.setAttribute('aria-hidden', 'true');
        const title = document.createElement('p');
        title.className = 'nav-page-transition-title';
        buildTitle(title, label);
        overlay.append(title);
        document.body.append(overlay);
        return overlay;
    };

    const resolveTarget = data => {
        if (!data.hash || window.location.pathname !== data.pathname) return null;
        const targetId = decodeURIComponent(data.hash.slice(1));
        return document.getElementById(targetId);
    };

    const revealDestination = (data, overlay) => {
        const target = resolveTarget(data);
        if (target) {
            target.scrollIntoView({ behavior: 'instant', block: 'start' });
            target.classList.remove('nav-transition-reveal');
            void target.offsetWidth;
            target.classList.add('nav-transition-reveal');
            target.addEventListener('animationend', () => {
                target.classList.remove('nav-transition-reveal');
            }, { once: true });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

        window.setTimeout(() => {
            overlay.classList.add('is-leaving');
            window.setTimeout(() => {
                overlay.remove();
                document.documentElement.classList.remove('nav-transitioning', 'nav-transition-pending');
            }, motionPreference.matches ? 0 : 760);
        }, 20);
    };

    const playTransition = (data, isIncoming = false) => {
        const overlay = makeOverlay(data.label);
        document.documentElement.classList.add('nav-transitioning');
        window.setTimeout(() => overlay.classList.add('is-text-visible'), motionPreference.matches ? 0 : textRevealDelay);
        if (isIncoming) {
            overlay.classList.add('is-covering');
            window.setTimeout(() => revealDestination(data, overlay), motionPreference.matches ? 0 : 20);
            return;
        }

        window.setTimeout(() => overlay.classList.add('is-covering'), motionPreference.matches ? 0 : 20);
        window.setTimeout(() => {
            if (data.pathname !== window.location.pathname) {
                window.sessionStorage.setItem(transitionKey, JSON.stringify(data));
                window.location.assign(data.href);
                return;
            }
            revealDestination(data, overlay);
        }, motionPreference.matches ? 0 : coverDuration + transitionDuration);
    };

    const pendingTransition = window.sessionStorage.getItem(transitionKey);
    if (pendingTransition) {
        window.sessionStorage.removeItem(transitionKey);
        document.documentElement.classList.add('nav-transition-pending');
        try {
            const data = JSON.parse(pendingTransition);
            if (typeof data.label === 'string' && typeof data.href === 'string') {
                playTransition(data, true);
            } else {
                document.documentElement.classList.remove('nav-transition-pending');
            }
        } catch (error) {
            document.documentElement.classList.remove('nav-transition-pending');
            console.error('Impossible de restaurer la transition du menu :', error);
        }
    }

    document.addEventListener('click', event => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) return;

        const link = event.target instanceof Element ? event.target.closest('header a[href]') : null;
        if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download')) return;
        if (link.target && link.target !== '_self') return;

        const destination = new URL(link.href, window.location.href);
        if (destination.origin !== window.location.origin || !/^\/?index(?:2)?\.html$/.test(destination.pathname.split('/').pop() || '')) return;
        if (destination.hash) {
            const targetId = decodeURIComponent(destination.hash.slice(1));
            if (!document.getElementById(targetId) && destination.pathname === window.location.pathname) return;
        }

        const label = getLinkLabel(link);
        if (!label) return;
        event.preventDefault();
        playTransition({
            href: destination.href,
            pathname: destination.pathname,
            hash: destination.hash,
            label
        });
    });
})();
