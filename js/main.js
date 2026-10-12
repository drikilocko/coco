window.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && typeof window.Lenis === 'function') {
        new window.Lenis({
            autoRaf: true,
            anchors: true,
            duration: 1.1,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: true,
            syncTouchLerp: 0.08,
            wheelMultiplier: 0.85
        });
    }

    const honoreeToggles = document.querySelectorAll('.honoree-toggle');
    const honoreesSection = document.querySelector('.honorees-section');
    const honoreesPhoto = honoreesSection?.querySelector('.honorees-photo-placeholder');
    const honoreesPhotoImage = honoreesPhoto?.querySelector('.honorees-photo');

    const updateHonoreesPhoto = (article, reveal = false) => {
        if (!(honoreesPhotoImage instanceof HTMLImageElement) || !article) return;
        const photo = article.dataset.photo;
        if (!photo) {
            console.error('Aucune photo définie pour cette personnalité.', article);
            return;
        }

        honoreesPhotoImage.classList.remove('is-revealing');
        if (honoreesPhotoImage.getAttribute('src') === photo) {
            if (reveal && honoreesPhotoImage.complete && honoreesPhotoImage.naturalWidth > 0) {
                honoreesPhotoImage.classList.add('is-revealing');
            }
            return;
        }

        honoreesPhotoImage.src = photo;
        let loadAttempts = 0;
        const revealWhenLoaded = () => {
            if (honoreesPhotoImage.getAttribute('src') !== photo) return;
            if (honoreesPhotoImage.complete) {
                if (honoreesPhotoImage.naturalWidth === 0) {
                    console.error(`Impossible de charger la photo de la personnalité : ${photo}`);
                } else if (reveal) {
                    honoreesPhotoImage.classList.add('is-revealing');
                }
                return;
            }
            if (loadAttempts >= 100) {
                console.error(`Le chargement de la photo de la personnalité a expiré : ${photo}`);
                return;
            }
            loadAttempts += 1;
            window.setTimeout(revealWhenLoaded, 50);
        };
        revealWhenLoaded();
    };

    updateHonoreesPhoto(honoreesSection?.querySelector('.honoree.is-open'));
    if (honoreesSection) {
        let hasRevealedHonoreesPhoto = false;
        const revealHonoreesPhotoOnEntry = () => {
            if (hasRevealedHonoreesPhoto) return;
            const bounds = honoreesSection.getBoundingClientRect();
            const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0);
            if (visibleHeight <= 0 || visibleHeight / bounds.height < 0.25) return;

            hasRevealedHonoreesPhoto = true;
            updateHonoreesPhoto(honoreesSection.querySelector('.honoree.is-open'), true);
            window.removeEventListener('scroll', revealHonoreesPhotoOnEntry);
            honoreesRevealObserver?.disconnect();
        };
        let honoreesRevealObserver;
        if ('IntersectionObserver' in window) {
            honoreesRevealObserver = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) revealHonoreesPhotoOnEntry();
            }, { threshold: 0.25 });
            honoreesRevealObserver.observe(honoreesSection);
        }
        window.addEventListener('scroll', revealHonoreesPhotoOnEntry, { passive: true });
        revealHonoreesPhotoOnEntry();
    }

    const scrollGallery = document.querySelector('.scroll-gallery-section');
    const scrollGalleryStage = scrollGallery?.querySelector('.scroll-gallery-stage');
    const focusGalleryStageCard = scrollGallery?.querySelector('.scroll-gallery-focus');
    const focusGalleryCard = focusGalleryStageCard?.querySelector('.scroll-gallery-card.is-focus');
    const galleryTitleLetters = scrollGallery
        ? Array.from(scrollGallery.querySelectorAll('.scroll-gallery-title .scroll-gallery-word span'))
        : [];
    const galleryCards = scrollGallery ? Array.from(scrollGallery.querySelectorAll('.scroll-gallery-card')) : [];

    if (scrollGallery && scrollGalleryStage && focusGalleryStageCard && focusGalleryCard && galleryCards.length) {
        let maxZoom = 1;
        const focusIndex = galleryCards.indexOf(focusGalleryCard);

        const measureGallery = () => {
            const cardWidth = focusGalleryStageCard.offsetWidth || 1;
            const cardHeight = focusGalleryStageCard.offsetHeight || 1;
            maxZoom = Math.max(
                scrollGalleryStage.clientWidth / cardWidth,
                scrollGalleryStage.clientHeight / cardHeight
            ) * 1.45;
        };

        const updateScrollGallery = () => {
            const sectionTop = scrollGallery.getBoundingClientRect().top;
            const stageHeight = scrollGalleryStage.clientHeight || window.innerHeight;
            const travel = Math.max(1, scrollGallery.offsetHeight - stageHeight);
            const progress = Math.min(1, Math.max(0, -sectionTop / travel));
            const galleryBottom = sectionTop + scrollGallery.offsetHeight;
            const galleryReachedEnd = galleryBottom <= stageHeight + 1;
            const zoomProgress = window.matchMedia('(max-width: 768px)').matches
                ? (galleryReachedEnd ? 1 : Math.min(1, progress / 0.18))
                : progress;
            const eased = zoomProgress * zoomProgress * (3 - 2 * zoomProgress);
            const zoom = 1 + (maxZoom - 1) * eased;
            const pushDistance = window.innerWidth * 0.9 * eased;
            const blurProgress = Math.min(1, Math.max(0, (zoomProgress - 0.6) / 0.4));
            const easedBlurProgress = blurProgress * blurProgress * (3 - 2 * blurProgress);

            focusGalleryStageCard.style.setProperty('--gallery-zoom', zoom.toFixed(4));
            focusGalleryCard.style.setProperty('--gallery-blur', `${(easedBlurProgress * 8).toFixed(2)}px`);
            galleryTitleLetters.forEach((letter, index) => {
                const letterProgress = Math.min(1, Math.max(0, (easedBlurProgress - index * 0.055) / 0.16));
                letter.style.setProperty('--letter-progress', letterProgress.toFixed(3));
            });
            galleryCards.forEach((card, index) => {
                if (card === focusGalleryCard) return;
                const direction = index < focusIndex ? -1 : 1;
                const distance = Math.abs(index - focusIndex);
                card.style.setProperty('--gallery-push', `${(direction * pushDistance * distance).toFixed(2)}px`);
            });
        };

        let galleryUpdateScheduled = false;
        const scheduleGalleryUpdate = () => {
            if (galleryUpdateScheduled) return;
            galleryUpdateScheduled = true;
            window.requestAnimationFrame(() => {
                updateScrollGallery();
                galleryUpdateScheduled = false;
            });
        };

        window.addEventListener('scroll', scheduleGalleryUpdate, { passive: true });
        window.addEventListener('scrollend', scheduleGalleryUpdate, { passive: true });
        window.addEventListener('touchend', scheduleGalleryUpdate, { passive: true });
        window.addEventListener('resize', () => {
            measureGallery();
            scheduleGalleryUpdate();
        });
        window.addEventListener('load', scheduleGalleryUpdate);
        measureGallery();
        updateScrollGallery();
    }

    honoreeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const detailsId = toggle.getAttribute('aria-controls');
            const details = detailsId ? document.getElementById(detailsId) : null;
            if (!details) return;

            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) return;
            const article = toggle.closest('.honoree');
            if (!article) return;

            honoreeToggles.forEach(otherToggle => {
                const otherDetailsId = otherToggle.getAttribute('aria-controls');
                const otherDetails = otherDetailsId ? document.getElementById(otherDetailsId) : null;
                const isCurrent = otherToggle === toggle;
                otherToggle.setAttribute('aria-expanded', String(isCurrent));
                if (otherDetails) otherDetails.hidden = !isCurrent;

                const icon = otherToggle.querySelector('.honoree-icon');
                if (icon) icon.textContent = isCurrent ? '−' : '+';
                otherToggle.closest('.honoree')?.classList.toggle('is-open', isCurrent);
            });

            updateHonoreesPhoto(article, true);
        });
    });

    const homeBackgroundVideo = document.querySelector('.home-background-video');
    const spaceTitleSection = document.querySelector('.space-title-section');
    const heroVideo = document.querySelector('.hero-video');

    if (heroVideo instanceof HTMLVideoElement && 'IntersectionObserver' in window) {
        const heroVideoObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                heroVideo.play().catch(error => {
                    console.error('Impossible de lire la vidéo principale de l’accueil.', error);
                });
            } else {
                heroVideo.pause();
            }
        });

        heroVideoObserver.observe(heroVideo);
    }

    if (homeBackgroundVideo instanceof HTMLVideoElement && spaceTitleSection) {
        let heroFadeUpdateScheduled = false;
        let backgroundPlayRequested = !homeBackgroundVideo.paused;

        const updateHomeBackgroundFade = () => {
            const sectionTop = spaceTitleSection.getBoundingClientRect().top;
            const stickyTop = parseFloat(getComputedStyle(spaceTitleSection).top) || 0;
            const fadeRange = Math.max(1, window.innerHeight - stickyTop);
            const progress = Math.min(1, Math.max(0, (window.innerHeight - sectionTop) / fadeRange));
            const easedProgress = progress * progress * (3 - 2 * progress);
            const videoOpacity = 1 - easedProgress;

            document.documentElement.style.setProperty('--home-background-opacity', videoOpacity.toFixed(3));
            spaceTitleSection.style.setProperty('--space-title-white-opacity', easedProgress.toFixed(3));

            if (videoOpacity > 0 && homeBackgroundVideo.paused && !backgroundPlayRequested) {
                backgroundPlayRequested = true;
                homeBackgroundVideo.play().catch(error => {
                    console.error('Impossible de lire la vidéo de fond de l’accueil.', error);
                });
            } else if (videoOpacity === 0) {
                if (!homeBackgroundVideo.paused) homeBackgroundVideo.pause();
                backgroundPlayRequested = false;
            }
        };

        const scheduleHomeBackgroundFade = () => {
            if (heroFadeUpdateScheduled) return;

            heroFadeUpdateScheduled = true;
            window.requestAnimationFrame(() => {
                updateHomeBackgroundFade();
                heroFadeUpdateScheduled = false;
            });
        };

        window.addEventListener('scroll', scheduleHomeBackgroundFade, { passive: true });
        window.addEventListener('resize', scheduleHomeBackgroundFade);
        updateHomeBackgroundFade();
    }

    const projectVideos = document.querySelectorAll('.project-media video[data-src]');
    if ('IntersectionObserver' in window) {
        const projectVideoObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const video = entry.target;
                if (!(video instanceof HTMLVideoElement)) return;

                if (entry.isIntersecting) {
                    if (!video.src) {
                        video.src = video.dataset.src;
                        video.load();
                    }
                    video.play().catch(error => {
                        console.error('Impossible de lire la vidéo du projet.', error);
                    });
                } else {
                    video.pause();
                }
            });
        }, { rootMargin: '300px 0px' });

        projectVideos.forEach(video => projectVideoObserver.observe(video));
    } else {
        projectVideos.forEach(video => {
            if (!(video instanceof HTMLVideoElement)) return;
            video.src = video.dataset.src;
            video.play().catch(error => {
                console.error('Impossible de lire la vidéo du projet.', error);
            });
        });
    }

    const videoShowcase = document.querySelector('.video-showcase-section');
    if (videoShowcase) {
        const videoSlides = Array.from(videoShowcase.querySelectorAll('.video-showcase-slide'));
        const videoCurrent = videoShowcase.querySelector('.video-showcase-current');
        const previousVideoButton = videoShowcase.querySelector('.video-showcase-button.prev');
        const nextVideoButton = videoShowcase.querySelector('.video-showcase-button.next');
        let activeVideoIndex = 0;
        let isVideoShowcaseVisible = false;

        const updateVideoShowcase = () => {
            const previousIndex = (activeVideoIndex - 1 + videoSlides.length) % videoSlides.length;
            const nextIndex = (activeVideoIndex + 1) % videoSlides.length;

            videoSlides.forEach((slide, index) => {
                slide.classList.toggle('is-active', index === activeVideoIndex);
                slide.classList.toggle('is-previous', index === previousIndex);
                slide.classList.toggle('is-next', index === nextIndex);
                slide.setAttribute('aria-hidden', String(index !== activeVideoIndex));
                const video = slide.querySelector('video');
                if (!(video instanceof HTMLVideoElement)) return;

                if (index !== activeVideoIndex) {
                    video.pause();
                    return;
                }
                if (!isVideoShowcaseVisible) return;

                if (!video.getAttribute('src')) {
                    if (!video.dataset.src) {
                        console.error('Aucune source définie pour une vidéo de la galerie.');
                        return;
                    }
                    video.src = video.dataset.src;
                    video.load();
                }
                video.play().catch(error => {
                    console.error('Impossible de lire une vidéo de la galerie Coco Miracles.', error);
                });
            });

            if (videoCurrent) videoCurrent.textContent = String(activeVideoIndex + 1);
        };

        const moveToVideo = direction => {
            activeVideoIndex = (activeVideoIndex + direction + videoSlides.length) % videoSlides.length;
            updateVideoShowcase();
        };

        previousVideoButton?.addEventListener('click', () => moveToVideo(-1));
        nextVideoButton?.addEventListener('click', () => moveToVideo(1));

        if ('IntersectionObserver' in window) {
            const videoShowcaseObserver = new IntersectionObserver(([entry]) => {
                isVideoShowcaseVisible = entry.isIntersecting;
                updateVideoShowcase();
            }, { threshold: 0.25 });
            videoShowcaseObserver.observe(videoShowcase);
        } else {
            isVideoShowcaseVisible = true;
            updateVideoShowcase();
        }
        updateVideoShowcase();
    }

    const reasonsSection = document.getElementById('raisons');

    if (spaceTitleSection && reasonsSection) {
        let spaceTitleUpdateScheduled = false;

        const updateSpaceTitleZoom = () => {
            const reasonsTop = reasonsSection.getBoundingClientRect().top;
            const progress = Math.min(1, Math.max(0, (window.innerHeight - reasonsTop) / window.innerHeight));
            const easedProgress = progress * progress * (3 - 2 * progress);
            const scale = 1 + 0.24 * easedProgress;
            const letterSpacing = -0.075 + 0.115 * easedProgress;
            const scriptSpacing = -0.045 + 0.06 * easedProgress;

            spaceTitleSection.style.setProperty('--space-title-scale', scale.toFixed(3));
            spaceTitleSection.style.setProperty('--space-title-letter-spacing', `${letterSpacing.toFixed(3)}em`);
            spaceTitleSection.style.setProperty('--space-title-script-spacing', `${scriptSpacing.toFixed(3)}em`);
        };

        const scheduleSpaceTitleZoom = () => {
            if (spaceTitleUpdateScheduled) return;

            spaceTitleUpdateScheduled = true;
            window.requestAnimationFrame(() => {
                updateSpaceTitleZoom();
                spaceTitleUpdateScheduled = false;
            });
        };

        window.addEventListener('scroll', scheduleSpaceTitleZoom, { passive: true });
        window.addEventListener('resize', scheduleSpaceTitleZoom);
        updateSpaceTitleZoom();
    }

    if (reasonsSection) {
        const archTitlePath = document.querySelector('.arch-curved-title-path');
        if (archTitlePath) {
            let titleSpacingUpdateScheduled = false;

            const updateArchTitleSpacing = () => {
                const sectionRect = reasonsSection.getBoundingClientRect();
                const sectionTop = sectionRect.top + window.scrollY;
                const startScroll = sectionTop - window.innerHeight;
                const endScroll = Math.min(
                    sectionTop,
                    document.documentElement.scrollHeight - window.innerHeight
                );
                const scrollDistance = endScroll - startScroll;
                const scrollProgress = scrollDistance > 0
                    ? Math.min(1, Math.max(0, (window.scrollY - startScroll) / scrollDistance))
                    : 0;
                const wordSpacing = scrollProgress * 56;

                archTitlePath.style.setProperty('--arch-title-word-spacing', `${wordSpacing}px`);
            };

            const scheduleArchTitleSpacing = () => {
                if (titleSpacingUpdateScheduled) return;

                titleSpacingUpdateScheduled = true;
                window.requestAnimationFrame(() => {
                    updateArchTitleSpacing();
                    titleSpacingUpdateScheduled = false;
                });
            };

            window.addEventListener('scroll', scheduleArchTitleSpacing, { passive: true });
            window.addEventListener('resize', scheduleArchTitleSpacing);
            updateArchTitleSpacing();
        }
    }

    // Gestion interactive des cartes de la Section 2 (Raisons)
    const reasonCards = document.querySelectorAll('.reason-card');
    const stepActive = document.querySelector('.step-num-active');
    const scrollProgress = document.querySelector('.arch-vertical-line');
    const reasonsArchSection = document.querySelector('.reasons-arch-section');

    if (scrollProgress && reasonsArchSection) {
        let scrollUpdateScheduled = false;

        const updateReasonScrollProgress = () => {
            const sectionTop = reasonsArchSection.offsetTop;
            const scrollRange = reasonsArchSection.offsetHeight;
            const progress = scrollRange > 0
                ? Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollRange))
                : 0;
            const progressPercent = Math.round(progress * 100);
            const activeIndex = Math.min(2, Math.floor(progress * 3));

            scrollProgress.style.setProperty('--scroll-progress-percent', `${progressPercent}%`);
            scrollProgress.setAttribute('aria-valuenow', String(progressPercent));

            reasonCards.forEach((card, index) => {
                card.classList.toggle('is-scroll-active', index === activeIndex);
            });
            if (stepActive) stepActive.textContent = String(Math.min(3, activeIndex + 1));
        };

        const scheduleReasonScrollProgress = () => {
            if (scrollUpdateScheduled) return;

            scrollUpdateScheduled = true;
            window.requestAnimationFrame(() => {
                updateReasonScrollProgress();
                scrollUpdateScheduled = false;
            });
        };

        window.addEventListener('scroll', scheduleReasonScrollProgress, { passive: true });
        window.addEventListener('resize', scheduleReasonScrollProgress);
        updateReasonScrollProgress();
    }

    reasonCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            reasonCards.forEach(c => c.classList.remove('featured'));
            card.classList.add('featured');
        });
        card.addEventListener('click', () => {
            reasonCards.forEach(c => c.classList.remove('featured'));
            card.classList.add('featured');
        });
    });

    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');
    const track = document.querySelector('.carousel-track');
    const carouselProgress = document.querySelector('.carousel-progress');
    const carouselProgressFill = document.querySelector('.carousel-progress-fill');
    const carouselCurrent = document.querySelector('.carousel-current');

    if (!slides.length || !track) return;

    let currentIndex = 2;
    const widthProbe = document.createElement('div');
    widthProbe.style.cssText = 'position:absolute;visibility:hidden;height:0;pointer-events:none;';
    track.appendChild(widthProbe);

    const updateCarouselLayout = () => {
        widthProbe.style.width = 'var(--carousel-main-width)';
        const mainWidth = widthProbe.getBoundingClientRect().width;
        widthProbe.style.width = 'var(--carousel-side-width)';
        const sideWidth = widthProbe.getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).getPropertyValue('--carousel-inner-gap')) || 14;
        const sideOffset = (mainWidth + sideWidth) / 2 + gap;
        track.style.setProperty('--carousel-left-offset', `${-sideOffset}px`);
        track.style.setProperty('--carousel-right-offset', `${sideOffset}px`);
    };

    const updateCarousel = () => {
        updateCarouselLayout();
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        const nextIndex = (currentIndex + 1) % slides.length;

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
            slide.classList.toggle('prev', index === prevIndex);
            slide.classList.toggle('next', index === nextIndex);
            slide.classList.toggle('is-hidden', index !== currentIndex && index !== prevIndex && index !== nextIndex);
        });

        const currentSlide = currentIndex + 1;
        const progressPercent = (currentSlide / slides.length) * 100;
        if (carouselCurrent) carouselCurrent.textContent = String(currentSlide);
        if (carouselProgress) carouselProgress.setAttribute('aria-valuenow', String(currentSlide));
        if (carouselProgressFill) carouselProgressFill.style.width = `${progressPercent}%`;
    };

    const goToSlide = index => {
        currentIndex = (index + slides.length) % slides.length;
        updateCarousel();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    prevButton?.addEventListener('click', prevSlide);
    nextButton?.addEventListener('click', nextSlide);
    window.addEventListener('resize', updateCarouselLayout);
    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') prevSlide();
        if (event.key === 'ArrowRight') nextSlide();
    });

    // Empêche le rebond / overscroll vers le haut au sommet de la page (trackpad / souris)
    window.addEventListener('wheel', (event) => {
        if (window.scrollY <= 0 && event.deltaY < 0) {
            event.preventDefault();
        }
    }, { passive: false });

    updateCarousel();
    window.setInterval(nextSlide, 5000);
});
