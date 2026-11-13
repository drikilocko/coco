window.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('#beauty-video-gallery');
    const videos = window.cocoBeautyVideos;
    if (!(gallery instanceof HTMLElement) || !Array.isArray(videos) || videos.length === 0) {
        console.error('Impossible de charger la galerie beauté : vidéos ou conteneur introuvables.');
        return;
    }

    const dialog = document.querySelector('#beauty-project-dialog');
    const dialogTitle = dialog?.querySelector('#beauty-project-title');
    const dialogDescription = dialog?.querySelector('.beauty-project-description');
    const dialogVideo = dialog?.querySelector('.beauty-project-video');
    const dialogStatus = dialog?.querySelector('.beauty-project-status');
    const closeButton = dialog?.querySelector('.beauty-project-close');
    if (
        !(dialog instanceof HTMLDialogElement) ||
        !(dialogTitle instanceof HTMLElement) ||
        !(dialogDescription instanceof HTMLElement) ||
        !(dialogVideo instanceof HTMLVideoElement) ||
        !(dialogStatus instanceof HTMLElement) ||
        !(closeButton instanceof HTMLButtonElement)
    ) {
        console.error('Impossible de configurer la fenêtre vidéo beauté : éléments introuvables.');
        return;
    }

    let activeTrigger = null;
    const fragment = document.createDocumentFragment();

    videos.forEach((asset, index) => {
        if (
            typeof asset.title !== 'string' ||
            typeof asset.description !== 'string' ||
            typeof asset.src !== 'string' ||
            typeof asset.poster !== 'string'
        ) {
            console.error(`Informations manquantes pour la vidéo beauté ${index + 1}.`);
            return;
        }

        const card = document.createElement('figure');
        card.className = 'gallery-card beauty-gallery-card';

        const media = document.createElement('div');
        media.className = 'gallery-card-media beauty-gallery-media';
        const openButton = document.createElement('button');
        openButton.className = 'beauty-gallery-open';
        openButton.type = 'button';
        openButton.setAttribute('aria-label', `Voir la vidéo : ${asset.title}`);
        const poster = document.createElement('img');
        poster.loading = 'lazy';
        poster.decoding = 'async';
        poster.alt = '';
        poster.src = asset.poster;
        const playIcon = document.createElement('span');
        playIcon.className = 'beauty-gallery-play-icon';
        playIcon.setAttribute('aria-hidden', 'true');
        playIcon.textContent = '▶';
        openButton.append(poster, playIcon);
        media.append(openButton);

        const caption = document.createElement('figcaption');
        const title = document.createElement('strong');
        title.textContent = asset.title;
        const description = document.createElement('p');
        description.textContent = asset.description;
        const moreButton = document.createElement('button');
        moreButton.className = 'beauty-gallery-more';
        moreButton.type = 'button';
        moreButton.textContent = 'Voir plus';
        moreButton.setAttribute('aria-label', `Voir la vidéo et les détails : ${asset.title}`);
        caption.append(title, description, moreButton);
        card.append(media, caption);
        fragment.append(card);

        const openProject = () => {
            activeTrigger = moreButton;
            dialogTitle.textContent = asset.title;
            dialogDescription.textContent = asset.description;
            dialogStatus.textContent = '';
            dialogVideo.poster = asset.poster;
            dialogVideo.src = asset.src;
            dialogVideo.load();
            dialog.showModal();
            dialogVideo.play().catch(error => {
                if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
                    console.error(`Impossible de lire la vidéo beauté : ${asset.src}`, error);
                    dialogStatus.textContent = 'La vidéo n’a pas pu démarrer. Utilisez les commandes du lecteur pour réessayer.';
                } else if (error.name === 'NotAllowedError') {
                    dialogStatus.textContent = 'Appuyez sur lecture pour regarder la vidéo.';
                }
            });
        };
        openButton.addEventListener('click', openProject);
        moreButton.addEventListener('click', openProject);
    });

    gallery.replaceChildren(fragment);
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
        dialogVideo.pause();
        dialogVideo.removeAttribute('src');
        dialogVideo.load();
        dialogStatus.textContent = '';
        activeTrigger?.focus({ preventScroll: true });
        activeTrigger = null;
    });
});
