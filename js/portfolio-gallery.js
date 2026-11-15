window.addEventListener('DOMContentLoaded', () => {
    const portfolioVideos = window.cocoPortfolioVideos;
    if (!Array.isArray(portfolioVideos) || portfolioVideos.length === 0) {
        console.error('La liste des vidéos locales du portfolio est introuvable.');
        return;
    }

    const loadIntervals = new WeakMap();
    const loadTimeouts = new WeakMap();
    const pendingPosters = new WeakMap();
    const posterObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const poster = pendingPosters.get(entry.target);
                if (typeof poster !== 'string') return;
                entry.target.poster = poster;
                pendingPosters.delete(entry.target);
                posterObserver.unobserve(entry.target);
            });
        }, { rootMargin: '120px 0px' })
        : null;
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
            playButton.innerHTML = '<svg class="ui-icon ui-icon-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l11-6.5z"/></svg> Lire la vidéo';
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
        video.preload = 'none';
        video.playsInline = true;
        video.controls = false;
        video.hidden = false;

        if (posterObserver) {
            pendingPosters.set(video, asset.poster);
            posterObserver.observe(video);
        } else {
            video.poster = asset.poster;
        }

        const loading = document.createElement('p');
        loading.className = 'portfolio-video-loading';
        loading.setAttribute('role', 'status');
        loading.setAttribute('aria-live', 'polite');
        loading.hidden = true;

        const playButton = document.createElement('button');
        playButton.className = 'portfolio-video-load-button';
        playButton.type = 'button';
        playButton.innerHTML = '<svg class="ui-icon ui-icon-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l11-6.5z"/></svg> Lire la vidéo';
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

        // Lecture immédiate au clic (geste de l'utilisateur) : plus d'attente de 5 s de mise en mémoire.
        // Le navigateur charge et lit en continu ; on affiche « Chargement… » seulement s'il attend des données.
        playButton.addEventListener('click', () => {
            if (playButton.dataset.retry === 'true') stopVideo(video);
            else if (activeVideo === video && video.classList.contains('is-ready')) return;
            if (activeVideo && activeVideo !== video) stopVideo(activeVideo);
            activeVideo = video;

            const attempt = String(Number(video.dataset.loadAttempt || 0) + 1);
            video.dataset.loadAttempt = attempt;
            playButton.hidden = true;
            playButton.disabled = true;
            loading.textContent = 'Chargement de la vidéo…';
            loading.hidden = false;
            delete loading.dataset.stalled;

            video.hidden = false;
            video.muted = false;
            video.controls = true;
            video.preload = 'auto';
            video.src = asset.src;
            video.classList.add('is-ready');

            const onPlaying = () => {
                if (video.dataset.loadAttempt !== attempt) return;
                clearLoadTimers(video);
                loading.hidden = true;
            };
            const onWaiting = () => {
                if (video.dataset.loadAttempt !== attempt) return;
                loading.textContent = 'Chargement de la vidéo…';
                loading.hidden = false;
            };
            video.addEventListener('playing', onPlaying);
            video.addEventListener('waiting', onWaiting);
            video.addEventListener('error', () => {
                showError(attempt, 'Impossible de charger cette vidéo. Cliquez sur Réessayer.');
            }, { once: true });

            // play() appelé directement dans le clic : autorisé avec le son sur tous les navigateurs
            video.play().catch(error => {
                if (video.dataset.loadAttempt !== attempt || error.name === 'AbortError') return;
                if (error.name === 'NotAllowedError') {
                    // Lecture refusée : on laisse les commandes du lecteur pour lancer à la main
                    loading.hidden = true;
                    return;
                }
                console.error('La lecture de la vidéo du portfolio a échoué.', error.name);
                showError(attempt, 'La vidéo n’a pas pu démarrer. Cliquez sur Réessayer.');
            });

            // Filet de sécurité : connexion très lente
            loadTimeouts.set(video, window.setTimeout(() => {
                if (video.dataset.loadAttempt === attempt && video.readyState < 3) {
                    loading.textContent = 'Connexion lente : la vidéo continue de charger…';
                }
            }, 12_000));
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
        moreButton.textContent = 'Lire plus';
        moreButton.setAttribute('aria-label', `Lire plus : ${asset.title}`);
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
            window.cocoDetailSheet?.fill({
                title: asset.title,
                tagsElement: dialog.querySelector('.detail-sheet-tags'),
                leadElement: dialogDescription,
                moreElement: dialog.querySelector('.detail-sheet-more'),
                fallbackLead: description.textContent || ''
            });
            dialog.scrollTop = 0;
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
        if (window.cocoDetailSheet) {
            window.cocoDetailSheet.setup(projectDialog, closeButton);
        } else {
            closeButton.addEventListener('click', () => projectDialog.close());
            projectDialog.addEventListener('click', event => {
                if (event.target === projectDialog) projectDialog.close();
            });
        }
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
