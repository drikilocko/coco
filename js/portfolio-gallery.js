window.addEventListener('DOMContentLoaded', () => {
    const portfolioVideos = window.cocoPortfolioVideos;
    if (!Array.isArray(portfolioVideos) || portfolioVideos.length === 0) {
        console.error('La liste des vidéos locales du portfolio est introuvable.');
        return;
    }

    const minimumBufferSeconds = 5;
    const loadIntervals = new WeakMap();
    const loadTimeouts = new WeakMap();
    let activeVideo = null;

    const clearLoadTimers = video => {
        window.clearInterval(loadIntervals.get(video));
        window.clearTimeout(loadTimeouts.get(video));
        loadIntervals.delete(video);
        loadTimeouts.delete(video);
    };

    const stopVideo = video => {
        const media = video.closest('.portfolio-video-media, .gallery-card-media');
        if (!(media instanceof HTMLElement)) return;

        clearLoadTimers(video);
        video.dataset.loadAttempt = String(Number(video.dataset.loadAttempt || 0) + 1);
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.classList.remove('is-ready');
        video.controls = false;
        video.hidden = false;

        const loading = media.querySelector('.portfolio-video-loading');
        const playButton = media.querySelector('.portfolio-video-load-button');
        if (loading instanceof HTMLElement) {
            loading.hidden = true;
            delete loading.dataset.stalled;
        }
        if (playButton instanceof HTMLButtonElement) {
            playButton.hidden = false;
            playButton.disabled = false;
            playButton.textContent = '▶ Lire la vidéo';
            delete playButton.dataset.retry;
        }
    };

    const setupVideo = video => {
        const index = Number(video.dataset.portfolioVideoIndex);
        const asset = Number.isInteger(index) ? portfolioVideos[index] : null;
        if (!asset || typeof asset.src !== 'string' || typeof asset.title !== 'string') {
            console.error('Informations manquantes pour une vidéo locale du portfolio.');
            return;
        }
        if (video.dataset.playerReady === 'true') return;

        const media = video.closest('.portfolio-video-media, .gallery-card-media');
        if (!(media instanceof HTMLElement)) {
            console.error('Conteneur introuvable pour une vidéo locale du portfolio.');
            return;
        }

        video.dataset.playerReady = 'true';
        video.classList.add('portfolio-local-video');
        video.title = asset.title;
        video.poster = asset.poster;
        video.preload = 'none';
        video.playsInline = true;
        video.controls = false;
        video.hidden = false;

        const loading = document.createElement('p');
        loading.className = 'portfolio-video-loading';
        loading.setAttribute('role', 'status');
        loading.setAttribute('aria-live', 'polite');
        loading.hidden = true;

        const playButton = document.createElement('button');
        playButton.className = 'portfolio-video-load-button';
        playButton.type = 'button';
        playButton.textContent = '▶ Lire la vidéo';
        playButton.setAttribute('aria-label', `Lire ${asset.title}`);

        const showError = (attempt, message) => {
            if (video.dataset.loadAttempt !== attempt) return;
            clearLoadTimers(video);
            video.pause();
            loading.textContent = message;
            loading.hidden = false;
            loading.dataset.stalled = 'true';
            playButton.disabled = false;
            playButton.textContent = 'Réessayer';
            playButton.hidden = false;
            playButton.dataset.retry = 'true';
        };

        playButton.addEventListener('click', () => {
            if (playButton.dataset.retry === 'true') stopVideo(video);
            else if (activeVideo === video && video.classList.contains('is-ready')) return;
            if (activeVideo && activeVideo !== video) stopVideo(activeVideo);
            activeVideo = video;

            const attempt = String(Number(video.dataset.loadAttempt || 0) + 1);
            video.dataset.loadAttempt = attempt;
            playButton.hidden = true;
            playButton.disabled = true;
            loading.textContent = `Préparation de la vidéo… (0/${minimumBufferSeconds} s)`;
            loading.hidden = false;
            delete loading.dataset.stalled;

            video.hidden = false;
            video.muted = true;
            video.preload = 'auto';
            video.src = asset.src;

            const checkBuffer = () => {
                if (video.dataset.loadAttempt !== attempt || video.classList.contains('is-ready')) return;
                let bufferedEnd = 0;
                for (let range = 0; range < video.buffered.length; range += 1) {
                    if (video.buffered.start(range) <= 0.25) bufferedEnd = Math.max(bufferedEnd, video.buffered.end(range));
                }

                const duration = Number.isFinite(video.duration) ? video.duration : minimumBufferSeconds;
                const requiredSeconds = Math.min(minimumBufferSeconds, duration);
                loading.textContent = `Préparation de la vidéo… (${Math.min(Math.floor(bufferedEnd), Math.ceil(requiredSeconds))}/${Math.ceil(requiredSeconds)} s)`;
                if (requiredSeconds <= 0 || bufferedEnd + 0.1 < requiredSeconds) return;

                clearLoadTimers(video);
                video.removeEventListener('progress', checkBuffer);
                video.removeEventListener('loadedmetadata', checkBuffer);
                video.pause();
                if (video.currentTime > 0) video.currentTime = 0;
                video.muted = false;
                video.controls = true;
                video.classList.add('is-ready');
                loading.hidden = true;
                playButton.hidden = true;
                delete playButton.dataset.retry;
                video.play().then(() => {
                    if (video.dataset.loadAttempt === attempt) activeVideo = video;
                }).catch(error => {
                    if (video.dataset.loadAttempt !== attempt || error.name === 'AbortError') return;
                    console.error('La lecture de la vidéo locale a été refusée.', error.name);
                    showError(attempt, 'La lecture a été bloquée. Cliquez sur Réessayer.');
                });
            };

            video.addEventListener('progress', checkBuffer);
            video.addEventListener('loadedmetadata', checkBuffer);
            video.addEventListener('error', () => {
                showError(attempt, 'Impossible de charger cette vidéo locale. Vérifiez le fichier dans asset/video.');
            }, { once: true });

            video.load();
            video.play().catch(error => {
                if (video.dataset.loadAttempt !== attempt || error.name === 'AbortError') return;
                console.error('Le préchargement de la vidéo locale a été refusé.', error.name);
                showError(attempt, 'Impossible de préparer la vidéo. Cliquez sur Réessayer.');
            });

            loadIntervals.set(video, window.setInterval(checkBuffer, 200));
            loadTimeouts.set(video, window.setTimeout(() => {
                if (video.dataset.loadAttempt === attempt && !video.classList.contains('is-ready')) {
                    showError(attempt, 'Le chargement est lent. Cliquez sur Réessayer pour relancer la vidéo.');
                }
            }, 30_000));
        });

        video.addEventListener('play', () => {
            if (activeVideo && activeVideo !== video) stopVideo(activeVideo);
            activeVideo = video;
        });

        media.prepend(loading, playButton);
    };

    document.querySelectorAll('video[data-portfolio-video-index]').forEach(setupVideo);

    const gallery = document.querySelector('#portfolio-local-gallery');
    if (!(gallery instanceof HTMLElement)) return;

    const fragment = document.createDocumentFragment();
    portfolioVideos.forEach((asset, index) => {
        const number = String(index + 1).padStart(2, '0');
        const card = document.createElement('figure');
        card.className = 'gallery-card';

        const media = document.createElement('div');
        media.className = 'gallery-card-media';

        const video = document.createElement('video');
        video.dataset.portfolioVideoIndex = String(index);
        video.preload = 'none';
        video.playsInline = true;
        video.setAttribute('aria-label', asset.title);
        media.append(video);

        const caption = document.createElement('figcaption');
        const category = document.createElement('span');
        category.textContent = `Portfolio · ${number}`;
        const title = document.createElement('strong');
        title.textContent = asset.title;
        const description = document.createElement('p');
        description.textContent = asset.description || `Un aperçu des créations et des coulisses de Coco Miracles : ${asset.title}.`;
        const moreButton = document.createElement('button');
        moreButton.className = 'portfolio-gallery-more';
        moreButton.type = 'button';
        moreButton.textContent = 'Voir plus';
        moreButton.setAttribute('aria-label', `Voir la vidéo et les détails : ${asset.title}`);
        caption.append(category, title, description, moreButton);
        card.append(media, caption);
        fragment.append(card);

        moreButton.addEventListener('click', () => {
            const dialog = document.querySelector('#portfolio-project-dialog');
            const dialogTitle = dialog?.querySelector('#portfolio-project-title');
            const dialogDescription = dialog?.querySelector('.portfolio-project-description');
            const dialogVideo = dialog?.querySelector('.portfolio-project-video');
            const dialogStatus = dialog?.querySelector('.portfolio-project-status');
            if (
                !(dialog instanceof HTMLDialogElement) ||
                !(dialogTitle instanceof HTMLElement) ||
                !(dialogDescription instanceof HTMLElement) ||
                !(dialogVideo instanceof HTMLVideoElement) ||
                !(dialogStatus instanceof HTMLElement)
            ) {
                console.error('Impossible d’ouvrir le projet : fenêtre vidéo introuvable.');
                return;
            }

            if (activeVideo) {
                stopVideo(activeVideo);
                activeVideo = null;
            }
            dialog.dataset.activeTrigger = String(index);
            dialogTitle.textContent = asset.title;
            dialogDescription.textContent = description.textContent || '';
            dialogStatus.textContent = '';
            dialogVideo.poster = asset.poster;
            dialogVideo.src = asset.src;
            dialogVideo.load();
            dialog.showModal();
            dialogVideo.play().catch(error => {
                if (error.name === 'NotAllowedError') {
                    dialogStatus.textContent = 'Appuyez sur lecture pour regarder la vidéo.';
                } else if (error.name !== 'AbortError') {
                    console.error(`Impossible de lire la vidéo du portfolio : ${asset.src}`, error);
                    dialogStatus.textContent = 'La vidéo n’a pas pu démarrer. Utilisez les commandes du lecteur pour réessayer.';
                }
            });
        });
    });

    gallery.replaceChildren(fragment);
    gallery.querySelectorAll('video[data-portfolio-video-index]').forEach(setupVideo);

    const projectDialog = document.querySelector('#portfolio-project-dialog');
    const projectVideo = projectDialog?.querySelector('.portfolio-project-video');
    const projectStatus = projectDialog?.querySelector('.portfolio-project-status');
    const closeButton = projectDialog?.querySelector('.portfolio-project-close');
    if (
        projectDialog instanceof HTMLDialogElement &&
        projectVideo instanceof HTMLVideoElement &&
        projectStatus instanceof HTMLElement &&
        closeButton instanceof HTMLButtonElement
    ) {
        closeButton.addEventListener('click', () => projectDialog.close());
        projectDialog.addEventListener('click', event => {
            if (event.target === projectDialog) projectDialog.close();
        });
        projectDialog.addEventListener('close', () => {
            projectVideo.pause();
            projectVideo.removeAttribute('src');
            projectVideo.load();
            projectStatus.textContent = '';
            const index = Number(projectDialog.dataset.activeTrigger);
            gallery.querySelectorAll('.portfolio-gallery-more')[index]?.focus({ preventScroll: true });
            delete projectDialog.dataset.activeTrigger;
        });
    } else {
        console.error('Impossible de configurer la fenêtre des projets du portfolio.');
    }
});
