(() => {
    const root = document.documentElement;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowTypes = ['slow-2g', '2g', '3g'];
    let manualSlow = false;
    let notice = null;
    let noticeTimer = 0;

    const isSlow = () => {
        if (manualSlow) return true;
        if (!connection) return false;
        if (connection.saveData) return true;
        if (slowTypes.includes(connection.effectiveType)) return true;
        return typeof connection.downlink === 'number' && connection.downlink > 0 && connection.downlink < 1.5;
    };

    const ensureNotice = () => {
        if (notice || !document.body) return notice;
        notice = document.createElement('div');
        notice.className = 'network-notice';
        notice.setAttribute('role', 'status');
        notice.setAttribute('aria-live', 'polite');
        notice.hidden = true;
        document.body.append(notice);
        return notice;
    };

    const showNotice = (message, { tone = 'info', duration = 5000 } = {}) => {
        const element = ensureNotice();
        if (!element) return;
        window.clearTimeout(noticeTimer);
        element.textContent = message;
        element.dataset.tone = tone;
        element.hidden = false;
        window.requestAnimationFrame(() => element.classList.add('is-visible'));
        if (duration > 0) {
            noticeTimer = window.setTimeout(hideNotice, duration);
        }
    };

    const hideNotice = () => {
        if (!notice) return;
        notice.classList.remove('is-visible');
        noticeTimer = window.setTimeout(() => {
            if (notice) notice.hidden = true;
        }, 300);
    };

    const applyState = () => {
        root.classList.toggle('is-slow-connection', isSlow());
        root.classList.toggle('is-offline', !navigator.onLine);
    };

    const markSlow = () => {
        if (manualSlow) return;
        manualSlow = true;
        applyState();
        showNotice('Connexion lente : le contenu se charge progressivement.', { duration: 6000 });
        window.dispatchEvent(new CustomEvent('coco:network-change'));
    };

    applyState();
    connection?.addEventListener?.('change', () => {
        applyState();
        window.dispatchEvent(new CustomEvent('coco:network-change'));
    });

    window.addEventListener('offline', () => {
        applyState();
        showNotice('Vous êtes hors ligne. Les pages déjà visitées restent consultables.', { tone: 'warning', duration: 0 });
        window.dispatchEvent(new CustomEvent('coco:network-change'));
    });

    window.addEventListener('online', () => {
        applyState();
        showNotice('Connexion rétablie.', { duration: 3000 });
        window.dispatchEvent(new CustomEvent('coco:network-change'));
    });

    document.addEventListener('DOMContentLoaded', () => {
        if (!navigator.onLine) {
            showNotice('Vous êtes hors ligne. Les pages déjà visitées restent consultables.', { tone: 'warning', duration: 0 });
        }
    });

    // Remplace les images qui échouent par un fond neutre plutôt qu’une icône cassée.
    document.addEventListener('error', event => {
        const target = event.target;
        if (target instanceof HTMLImageElement) {
            target.classList.add('is-broken');
            target.removeAttribute('srcset');
        }
    }, true);

    window.cocoNetwork = { isSlow, isOffline: () => !navigator.onLine, markSlow, showNotice, hideNotice };
})();
