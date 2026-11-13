window.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pagePreloader = document.querySelector('.page-preloader');
    let initialPreloaderFinished = !(pagePreloader instanceof HTMLElement);
    let releasePageReveals = () => {};
    let startHeroBrandCycle = () => {};
    let lenisInstance = null;

    const siteMusic = document.querySelector('#site-music-audio');
    const siteMusicConsent = document.querySelector('#site-music-consent');
    const siteMusicAccept = document.querySelector('.site-music-accept');
    const siteMusicDecline = document.querySelector('.site-music-decline');
    const siteMusicToggle = document.querySelector('#site-music-toggle');
    const siteMusicToggleLabel = document.querySelector('.site-music-toggle-label');
    const siteMusicStatus = document.querySelector('#site-music-status');

    if (
        siteMusic instanceof HTMLAudioElement &&
        siteMusicConsent instanceof HTMLElement &&
        siteMusicAccept instanceof HTMLButtonElement &&
        siteMusicDecline instanceof HTMLButtonElement &&
        siteMusicToggle instanceof HTMLButtonElement &&
        siteMusicToggleLabel instanceof HTMLElement &&
        siteMusicStatus instanceof HTMLElement
    ) {
        let musicDeclinedForPage = false;
        let musicPausedByUser = false;
        siteMusic.volume = 0.18;
        const updateMusicToggle = isPlaying => {
            siteMusicToggle.hidden = false;
            siteMusicToggle.setAttribute('aria-pressed', String(isPlaying));
            const label = isPlaying
                ? 'Désactiver la musique'
                : musicDeclinedForPage
                    ? 'Réactiver la musique'
                    : 'Activer la musique';
            siteMusicToggleLabel.textContent = label;
            siteMusicToggle.setAttribute('aria-label', label);
        };
        const playSiteMusic = () => {
            siteMusicStatus.textContent = '';
            siteMusic.play().then(() => {
                musicDeclinedForPage = false;
                musicPausedByUser = false;
                siteMusicConsent.hidden = true;
                updateMusicToggle(true);
            }).catch(() => {
                updateMusicToggle(false);
                siteMusicConsent.hidden = false;
                siteMusicStatus.textContent = 'Votre navigateur demande une confirmation pour activer le son.';
            });
        };
        const onFirstScroll = () => {
            window.removeEventListener('wheel', onFirstScroll);
            window.removeEventListener('touchmove', onFirstScroll);
            window.removeEventListener('scroll', onFirstScroll);
            if (!musicDeclinedForPage && !musicPausedByUser) {
                playSiteMusic();
            }
        };

        siteMusic.addEventListener('error', () => {
            updateMusicToggle(false);
            siteMusicStatus.textContent = 'Le fichier musical n’a pas pu être chargé.';
        });
        siteMusicAccept.addEventListener('click', () => {
            playSiteMusic();
        });
        siteMusicDecline.addEventListener('click', () => {
            musicDeclinedForPage = true;
            siteMusicConsent.hidden = true;
            updateMusicToggle(false);
        });
        siteMusicToggle.addEventListener('click', () => {
            if (musicDeclinedForPage) {
                siteMusicConsent.hidden = false;
                return;
            }
            if (siteMusic.paused) {
                musicPausedByUser = false;
                playSiteMusic();
            } else {
                siteMusic.pause();
                musicPausedByUser = true;
                updateMusicToggle(false);
            }
        });

        window.addEventListener('wheel', onFirstScroll, { passive: true });
        window.addEventListener('touchmove', onFirstScroll, { passive: true });
        window.addEventListener('scroll', onFirstScroll, { passive: true });
    }

    const chatGreeting = document.querySelector('.site-chat-greeting');
    if (chatGreeting instanceof HTMLElement) {
        const greetingMessages = [
            'Bonjour, je suis l’assistant Coco.<br>Que puis-je faire pour vous ?',
            'Un événement à imaginer ?<br>Je vous guide parmi nos prestations.',
            'Besoin d’un devis ?<br>Parlons de votre projet.'
        ];
        let greetingIndex = 0;
        const greetingInterval = window.setInterval(() => {
            greetingIndex += 1;
            if (greetingIndex >= greetingMessages.length) {
                window.clearInterval(greetingInterval);
                chatGreeting.classList.add('is-dismissed');
                window.setTimeout(() => chatGreeting.remove(), 180);
                return;
            }

            chatGreeting.classList.add('is-changing');
            window.setTimeout(() => {
                chatGreeting.innerHTML = greetingMessages[greetingIndex];
                window.requestAnimationFrame(() => chatGreeting.classList.remove('is-changing'));
            }, 180);
        }, 10_000);
    }

    if (pagePreloader instanceof HTMLElement) {
        let letterIndex = 0;
        pagePreloader.querySelectorAll('.page-preloader-word').forEach(word => {
            const text = word.getAttribute('data-word') ?? '';
            word.replaceChildren(...Array.from(text, (character, index) => {
                const letter = document.createElement('span');
                letter.className = 'page-preloader-letter';
                letter.textContent = character;
                letter.style.setProperty('--letter-index', String(letterIndex + index));
                return letter;
            }));
            letterIndex += text.length;
        });

        const finishPreloader = () => {
            if (initialPreloaderFinished) return;
            initialPreloaderFinished = true;
            pagePreloader.remove();
            document.documentElement.classList.remove('page-preloading');
            document.documentElement.classList.add('page-preloader-done');
            releasePageReveals();
            startHeroBrandCycle();
        };

        const exitPreloader = () => {
            pagePreloader.classList.add('is-exiting');
            const onExit = event => {
                if (event.target !== pagePreloader || event.propertyName !== 'transform') return;
                pagePreloader.removeEventListener('transitionend', onExit);
                finishPreloader();
            };
            pagePreloader.addEventListener('transitionend', onExit);
            window.setTimeout(finishPreloader, 1000);
        };

        const revealBrand = () => {
            pagePreloader.classList.add('is-brand-visible');
            window.setTimeout(exitPreloader, prefersReducedMotion ? 20 : 1100);
        };

        const waitForHeroImage = () => new Promise(resolve => {
            const preloadLink = document.querySelector('link[rel="preload"][as="image"]');
            const imageUrl = preloadLink instanceof HTMLLinkElement ? preloadLink.href : '';
            if (!imageUrl) {
                console.error('Impossible de synchroniser le préloader : image principale introuvable.');
                resolve();
                return;
            }

            const heroImage = new Image();
            let settled = false;
            const finishWaiting = () => {
                if (settled) return;
                settled = true;
                window.clearTimeout(imageLoadTimeout);
                resolve();
            };
            const imageLoadTimeout = window.setTimeout(() => {
                console.warn('Le chargement de l’image principale dépasse le délai du préloader.');
                finishWaiting();
            }, 8000);

            heroImage.addEventListener('load', () => {
                heroImage.decode().then(finishWaiting).catch(() => {
                    finishWaiting();
                });
            }, { once: true });
            heroImage.addEventListener('error', () => {
                console.error(`Impossible de charger l’image principale : ${imageUrl}`);
                finishWaiting();
            }, { once: true });
            heroImage.fetchPriority = 'high';
            heroImage.src = imageUrl;

            if (heroImage.complete && heroImage.naturalWidth > 0) {
                heroImage.decode().then(finishWaiting).catch(() => {
                    finishWaiting();
                });
            }
        });

        Promise.all([
            new Promise(resolve => window.setTimeout(resolve, prefersReducedMotion ? 20 : 1050)),
            waitForHeroImage()
        ]).then(revealBrand);
    }

    let handleScrollUpdate = () => {};
    if (!prefersReducedMotion && typeof window.Lenis === 'function') {
        lenisInstance = new window.Lenis({
            autoRaf: true,
            anchors: true,
            duration: 0.75,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: 1
        });
        lenisInstance.on('scroll', () => handleScrollUpdate());
    }

    const serviceContent = {
        vision: {
            kicker: '01 — Conception sur mesure',
            title: 'Une vision pensée autour de vous',
            description: 'Nous prenons le temps de comprendre votre histoire, vos envies et vos priorités. Nous créons ensuite un concept et une direction artistique sur mesure, avec une proposition claire, adaptée à votre budget.'
        },
        planning: {
            kicker: '02 — Planification & coordination',
            title: 'Une organisation maîtrisée dans les moindres détails',
            description: 'Nous sélectionnons les partenaires et coordonnons le lieu, le planning, la logistique et l’accueil. Chaque intervenant suit un calendrier précis, pour une organisation fluide et une préparation sereine.'
        },
        production: {
            kicker: '03 — Production & art de recevoir',
            title: 'Une exécution précise, un souvenir durable',
            description: 'Le jour J, notre équipe supervise l’installation, le timing, les prestataires et l’accueil. Nous veillons à la qualité de chaque détail pour donner vie au projet avec élégance et sérénité.'
        }
    };
    const servicePoints = Array.from(document.querySelectorAll('.hero-service-point'));
    const serviceBackdrop = document.querySelector('.hero-service-backdrop');
    const serviceCard = document.querySelector('#hero-service-card');
    const serviceKicker = serviceCard?.querySelector('#hero-service-kicker');
    const serviceTitle = serviceCard?.querySelector('#hero-service-title');
    const serviceDescription = serviceCard?.querySelector('#hero-service-description');
    const closeServiceCard = serviceCard?.querySelector('.hero-service-close');
    const heroSection = document.querySelector('.hero');
    const portfolioSection = document.querySelector('.portfolio-section');
    const realizationsSection = document.querySelector('.realisations-section');
    const beautySection = document.querySelector('.beauty-section');
    const personalitiesSection = document.querySelector('.personalities-section');
    const numbersSection = document.querySelector('.numbers-section');
    const partnerLogoMarquee = document.querySelector('.logo-marquee-before-formats');
    const projectContactSection = document.querySelector('.project-contact');

    if (
        portfolioSection instanceof HTMLElement &&
        realizationsSection instanceof HTMLElement &&
        beautySection instanceof HTMLElement &&
        personalitiesSection instanceof HTMLElement &&
        projectContactSection instanceof HTMLElement
    ) {
        portfolioSection.after(realizationsSection, beautySection);
        projectContactSection.before(personalitiesSection);
        if (numbersSection instanceof HTMLElement) {
            personalitiesSection.after(numbersSection);
            if (partnerLogoMarquee instanceof HTMLElement) {
                numbersSection.after(partnerLogoMarquee);
            }
        }
    } else {
        console.error('Impossible de réorganiser les sections : section introuvable.');
    }

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealTargets = Array.from(document.querySelectorAll([
            '.logo-marquee-first',
            '.universe-heading',
            '.universe-copy',
            '.universe-pillar',
            '.universe-image-main',
            '.universe-cta',
            '.direction-heading',
            '.direction-profile',
            '.craft-copy > .craft-eyebrow',
            '#craft-title',
            '.craft-copy > .craft-intro',
            '.craft-services > li',
            '.craft-contact',
            '.craft-team',
            '.realisations-heading',
            '.realisation-card',
            '.personalities-heading',
            '.trust-callout',
            '.prestations-heading',
            '.prestation-card',
            '.portfolio-heading',
            '.portfolio-video-card',
            '.portfolio-feature',
            '.logo-marquee-before-formats',
            '.formats-heading',
            '.format-card',
            '.beauty-heading',
            '.beauty-video-showcase',
            '.beauty-step',
            '.numbers-eyebrow',
            '.number-item',
            '.project-contact-layout',
            '.site-footer'
        ].join(', ')));
        const revealIndexes = new Map();
        revealTargets.forEach(target => {
            const section = target.closest('main > section');
            const index = revealIndexes.get(section) ?? 0;
            target.classList.add('scroll-reveal-item');
            target.style.setProperty('--scroll-reveal-delay', `${index * 85}ms`);
            revealIndexes.set(section, index + 1);
        });

        if (revealTargets.length) {
            document.documentElement.classList.add('has-scroll-reveals');
            const revealObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!initialPreloaderFinished) return;
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
            revealTargets.forEach(target => revealObserver.observe(target));

            releasePageReveals = () => {
                revealTargets.forEach(target => {
                    const bounds = target.getBoundingClientRect();
                    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
                    target.classList.add('is-revealed');
                    revealObserver.unobserve(target);
                });
            };
        }

        const personalityRevealRows = Array.from(document.querySelectorAll('.personality-row'));
        if (personalityRevealRows.length) {
            personalityRevealRows.forEach((row, index) => {
                row.classList.add('scroll-reveal-item');
                row.style.setProperty('--scroll-reveal-delay', `${index * 120}ms`);
            });

            const personalitySection = personalityRevealRows[0].closest('.personalities-section');
            if (personalitySection) {
                const personalityRevealObserver = new IntersectionObserver(([entry]) => {
                    if (!initialPreloaderFinished) return;
                    if (!entry?.isIntersecting) return;
                    personalityRevealRows.forEach(row => row.classList.add('is-revealed'));
                    personalityRevealObserver.unobserve(entry.target);
                }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
                personalityRevealObserver.observe(personalitySection);
                const releasePersonalityReveal = releasePageReveals;
                releasePageReveals = () => {
                    releasePersonalityReveal();
                    const bounds = personalitySection.getBoundingClientRect();
                    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
                    personalityRevealRows.forEach(row => row.classList.add('is-revealed'));
                    personalityRevealObserver.unobserve(personalitySection);
                };
            }
        }
    }

    // === REVEAL LETTRE PAR LETTRE SUR SCROLL (PHRASE DE CONFIANCE) ===
    const trustCopy = document.querySelector('.trust-copy');
    let trustChars = [];

    if (trustCopy) {
        const leadEl = trustCopy.querySelector('.trust-lead');
        const bodyEl = trustCopy.querySelector('.trust-body');
        const leadText = (leadEl ? leadEl.textContent : 'Ils nous ont fait confiance.').trim();
        const bodyText = (bodyEl ? bodyEl.textContent : 'Des personnalités de premier plan nous ont confié la mise en scène de leurs moments fondateurs.').trim();

        const splitIntoSpans = (text, isBold = false) => {
            const fragment = document.createDocumentFragment();
            const words = text.split(/(\s+)/);
            words.forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    fragment.appendChild(document.createTextNode(' '));
                    return;
                }
                const wordSpan = document.createElement('span');
                wordSpan.className = 'trust-word';
                Array.from(part).forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'trust-char';
                    if (isBold) charSpan.classList.add('trust-char-bold');
                    charSpan.textContent = char;
                    wordSpan.appendChild(charSpan);
                    trustChars.push(charSpan);
                });
                fragment.appendChild(wordSpan);
            });
            return fragment;
        };

        trustChars = [];
        trustCopy.replaceChildren();

        const leadWrapper = document.createElement('strong');
        leadWrapper.className = 'trust-lead';
        leadWrapper.appendChild(splitIntoSpans(leadText, true));
        trustCopy.appendChild(leadWrapper);

        trustCopy.appendChild(document.createTextNode(' '));

        const bodyWrapper = document.createElement('span');
        bodyWrapper.className = 'trust-body';
        bodyWrapper.appendChild(splitIntoSpans(bodyText, false));
        trustCopy.appendChild(bodyWrapper);
    }

    const updateTrustCopyReveal = () => {
        if (!trustCopy || !trustChars.length) return;
        if (prefersReducedMotion) {
            trustChars.forEach(c => c.classList.add('is-revealed'));
            return;
        }

        const rect = trustCopy.getBoundingClientRect();
        const windowH = window.innerHeight;

        // Début du reveal dès l'entrée dans le tiers inférieur (88%), 100% révélé au centre/haut (38%)
        const startY = windowH * 0.88;
        const endY = windowH * 0.38;

        const progress = Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)));
        const total = trustChars.length;
        const activeCount = Math.floor(progress * total);

        for (let i = 0; i < total; i++) {
            if (i <= activeCount) {
                trustChars[i].classList.add('is-revealed');
            } else {
                trustChars[i].classList.remove('is-revealed');
            }
        }
    };

    // === DECOMPTE EN CHIFFRES (SPLIT DU NUMBER & COMPTEUR PROGRESSIF) ===
    const numberValues = Array.from(document.querySelectorAll('.number-value[data-count-to]'));
    const animatedNumbers = new WeakSet();

    const animateNumber = (element) => {
        if (!(element instanceof HTMLElement) || animatedNumbers.has(element)) return;
        animatedNumbers.add(element);

        const target = Number(element.dataset.countTo || '0');
        const suffix = element.dataset.countSuffix || '';
        let counterEl = element.querySelector('.number-counter');
        let suffixEl = element.querySelector('.number-suffix');

        if (!counterEl) {
            element.innerHTML = `<span class="number-counter">0</span><span class="number-suffix">${suffix}</span>`;
            counterEl = element.querySelector('.number-counter');
            suffixEl = element.querySelector('.number-suffix');
        }

        if (prefersReducedMotion) {
            if (counterEl) counterEl.textContent = String(target);
            if (suffixEl) suffixEl.textContent = suffix;
            element.classList.add('is-counted');
            return;
        }

        if (counterEl) counterEl.textContent = '0';

        const duration = Math.min(2200, Math.max(1300, target * 18));
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out exponentiel pour un atterrissage en douceur luxueux
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.round(eased * target);

            if (counterEl) {
                counterEl.textContent = String(currentVal);
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (counterEl) counterEl.textContent = String(target);
                element.classList.add('is-counted');
            }
        };

        window.requestAnimationFrame(step);
    };

    const startVisibleNumberCounters = () => {
        numberValues.forEach(number => {
            const bounds = number.getBoundingClientRect();
            if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) {
                animateNumber(number);
            }
        });
    };

    if ('IntersectionObserver' in window) {
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    numberObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

        numberValues.forEach(el => numberObserver.observe(el));
    }
    if (!prefersReducedMotion && heroSection) {
        const revealTargets = heroSection.querySelectorAll(
            '.hero-eyebrow, .hero h1 > span, .hero-tagline, .hero-intro, .hero-contact, .hero-discover > span'
        );
        let wordIndex = 0;

        revealTargets.forEach(target => {
            const wordGroup = document.createElement('span');
            wordGroup.className = 'hero-word-group';
            const parts = (target.textContent ?? '').split(/(\s+)/);
            parts.forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    wordGroup.append(document.createTextNode(part));
                    return;
                }

                const mask = document.createElement('span');
                mask.className = 'hero-word-mask';
                const word = document.createElement('span');
                word.className = 'hero-word';
                word.textContent = part;
                word.style.setProperty('--word-delay', `${wordIndex * 60}ms`);
                wordIndex += 1;
                mask.append(word);
                wordGroup.append(mask);
            });
            target.replaceChildren(wordGroup);
            if (target.matches('.hero-contact')) {
                const words = target.querySelectorAll('.hero-word');
                const finalWord = words[words.length - 1];
                if (finalWord) {
                    target.style.setProperty(
                        '--cta-bg-delay',
                        finalWord.style.getPropertyValue('--word-delay')
                    );
                    target.classList.add('is-revealing');
                }
            }
        });

        heroSection.querySelector('.hero-contact')?.addEventListener('animationend', event => {
            if (event.animationName === 'hero-contact-background-reveal') {
                event.currentTarget.classList.remove('is-revealing');
            }
        });
    }
    const siteFooter = document.querySelector('.site-footer');
    const personalityRows = Array.from(document.querySelectorAll('.personality-row'));
    const portfolioVideos = Array.from(document.querySelectorAll('.portfolio-video-card video[data-src]'));
    const portfolioFilmstrip = document.querySelector('.portfolio-filmstrip');
    const portfolioGallery = document.querySelector('.portfolio-gallery');
    const portfolioGalleryArrows = Array.from(document.querySelectorAll('.portfolio-gallery-arrow'));
    const testimonialsTrack = document.querySelector('#testimonials-track');
    if (testimonialsTrack instanceof HTMLElement) {
        const originalTestimonialCards = Array.from(testimonialsTrack.querySelectorAll('.testimonial-card'));
        const previousTestimonialButton = document.querySelector('.testimonials-arrow-prev');
        const nextTestimonialButton = document.querySelector('.testimonials-arrow-next');
        const testimonialsCount = document.querySelector('.testimonials-count');

        if (
            originalTestimonialCards.length &&
            previousTestimonialButton instanceof HTMLButtonElement &&
            nextTestimonialButton instanceof HTMLButtonElement &&
            testimonialsCount instanceof HTMLElement
        ) {
            const createClones = () => {
                const fragment = document.createDocumentFragment();
                return originalTestimonialCards.map((card, index) => {
                    card.dataset.testimonialIndex = String(index);
                    const clone = card.cloneNode(true);
                    if (!(clone instanceof HTMLElement)) {
                        throw new Error('Impossible de préparer le défilement continu des appréciations.');
                    }
                    clone.dataset.testimonialIndex = String(index);
                    clone.setAttribute('aria-hidden', 'true');
                    clone.inert = true;
                    fragment.append(clone);
                    return clone;
                });
            };
            const leadingClones = createClones();
            const trailingClones = createClones();
            testimonialsTrack.prepend(...leadingClones);
            testimonialsTrack.append(...trailingClones);
            const testimonialCards = Array.from(testimonialsTrack.querySelectorAll('.testimonial-card'));
            let testimonialsAnimationFrame = 0;
            let testimonialsResumeTimer = 0;
            let testimonialsAutoplayPaused = false;
            let testimonialsPointerInside = false;
            let testimonialsInView = false;
            let lastTestimonialsFrameTime = 0;

            const updateTestimonialsControls = () => {
                previousTestimonialButton.disabled = false;
                nextTestimonialButton.disabled = false;
                const trackLeft = testimonialsTrack.getBoundingClientRect().left;
                const firstCard = testimonialCards.find(card =>
                    card.getBoundingClientRect().right > trackLeft + 1
                );
                const activeIndex = firstCard
                    ? Number(firstCard.dataset.testimonialIndex)
                    : originalTestimonialCards.length - 1;
                testimonialsCount.textContent =
                    `${String(activeIndex + 1).padStart(2, '0')} / ${String(originalTestimonialCards.length).padStart(2, '0')}`;
            };

            const scrollTestimonials = direction => {
                const trackLeft = testimonialsTrack.getBoundingClientRect().left;
                const card = testimonialCards.find(item =>
                    item.getBoundingClientRect().right > trackLeft + 1
                ) ?? originalTestimonialCards[0];
                const styles = getComputedStyle(testimonialsTrack);
                const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
                testimonialsTrack.scrollBy({
                    left: direction * (card.getBoundingClientRect().width + gap),
                    behavior: 'smooth'
                });
            };

            const adjustTestimonialsLoop = () => {
                const originalStart = originalTestimonialCards[0].offsetLeft;
                const nextSetStart = trailingClones[0].offsetLeft;
                const setWidth = nextSetStart - originalStart;
                if (testimonialsTrack.scrollLeft < originalStart - 1) {
                    testimonialsTrack.scrollLeft += setWidth;
                } else if (testimonialsTrack.scrollLeft >= nextSetStart - 1) {
                    testimonialsTrack.scrollLeft -= setWidth;
                }
            };

            const runTestimonialsMotion = time => {
                testimonialsAnimationFrame = 0;
                if (
                    prefersReducedMotion ||
                    testimonialsAutoplayPaused ||
                    !testimonialsInView ||
                    document.hidden
                ) {
                    lastTestimonialsFrameTime = 0;
                    return;
                }
                if (lastTestimonialsFrameTime) {
                    const elapsed = Math.min(time - lastTestimonialsFrameTime, 50);
                    testimonialsTrack.scrollLeft += elapsed * 0.024;
                    adjustTestimonialsLoop();
                }
                lastTestimonialsFrameTime = time;
                testimonialsAnimationFrame = requestAnimationFrame(runTestimonialsMotion);
            };

            const startTestimonialsMotion = () => {
                if (!testimonialsAnimationFrame) {
                    testimonialsAnimationFrame = requestAnimationFrame(runTestimonialsMotion);
                }
            };

            const resumeTestimonialsMotion = () => {
                window.clearTimeout(testimonialsResumeTimer);
                testimonialsAutoplayPaused = false;
                lastTestimonialsFrameTime = 0;
                startTestimonialsMotion();
            };

            const pauseTestimonialsMotion = (resumeDelay = 0) => {
                testimonialsAutoplayPaused = true;
                window.clearTimeout(testimonialsResumeTimer);
                if (resumeDelay > 0) {
                    testimonialsResumeTimer = window.setTimeout(() => {
                        if (testimonialsPointerInside) return;
                        testimonialsAutoplayPaused = false;
                        lastTestimonialsFrameTime = 0;
                        startTestimonialsMotion();
                    }, resumeDelay);
                }
            };

            previousTestimonialButton.addEventListener('click', () => {
                pauseTestimonialsMotion(1000);
                scrollTestimonials(-1);
            });
            nextTestimonialButton.addEventListener('click', () => {
                pauseTestimonialsMotion(1000);
                scrollTestimonials(1);
            });
            testimonialsTrack.addEventListener('pointerdown', () => pauseTestimonialsMotion(), { passive: true });
            testimonialsTrack.addEventListener('pointerup', () => pauseTestimonialsMotion(350), { passive: true });
            testimonialsTrack.addEventListener('pointercancel', () => pauseTestimonialsMotion(350), { passive: true });
            testimonialsTrack.addEventListener('pointerenter', event => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                    testimonialsPointerInside = true;
                    pauseTestimonialsMotion();
                }
            }, { passive: true });
            testimonialsTrack.addEventListener('pointerleave', event => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                    testimonialsPointerInside = false;
                    resumeTestimonialsMotion();
                }
            }, { passive: true });
            testimonialsTrack.addEventListener('wheel', () => pauseTestimonialsMotion(700), { passive: true });
            testimonialsTrack.addEventListener('keydown', event => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                    pauseTestimonialsMotion(700);
                }
            });
            testimonialsTrack.addEventListener('scroll', () => {
                updateTestimonialsControls();
                adjustTestimonialsLoop();
            }, { passive: true });
            window.addEventListener('resize', updateTestimonialsControls);
            document.addEventListener('visibilitychange', startTestimonialsMotion);
            const testimonialsObserver = new IntersectionObserver(entries => {
                testimonialsInView = entries.some(entry => entry.isIntersecting);
                startTestimonialsMotion();
            });
            testimonialsObserver.observe(testimonialsTrack);
            requestAnimationFrame(() => {
                testimonialsTrack.scrollLeft = originalTestimonialCards[0].offsetLeft;
                updateTestimonialsControls();
                startTestimonialsMotion();
            });
        }
    }
    const testimonialProjectDialog = document.querySelector('#testimonial-project-dialog');
    const testimonialProjectVideo = testimonialProjectDialog?.querySelector('.testimonial-project-video');
    const testimonialProjectTitle = testimonialProjectDialog?.querySelector('#testimonial-project-title');
    const testimonialProjectDescription = testimonialProjectDialog?.querySelector('.testimonial-project-description');
    const testimonialProjectStatus = testimonialProjectDialog?.querySelector('.testimonial-project-status');
    const testimonialProjectClose = testimonialProjectDialog?.querySelector('.testimonial-project-close');
    const testimonialProjectButtons = Array.from(document.querySelectorAll('.testimonial-project-button'));

    if (
        testimonialProjectDialog instanceof HTMLDialogElement &&
        testimonialProjectVideo instanceof HTMLVideoElement &&
        testimonialProjectTitle instanceof HTMLElement &&
        testimonialProjectDescription instanceof HTMLElement &&
        testimonialProjectStatus instanceof HTMLElement &&
        testimonialProjectClose instanceof HTMLButtonElement
    ) {
        let activeProjectTrigger = null;
        const closeTestimonialProject = () => {
            if (testimonialProjectDialog.open) testimonialProjectDialog.close();
        };
        const resetTestimonialProject = () => {
            testimonialProjectVideo.pause();
            testimonialProjectVideo.removeAttribute('src');
            testimonialProjectVideo.load();
            testimonialProjectStatus.textContent = '';
            activeProjectTrigger?.focus({ preventScroll: true });
            activeProjectTrigger = null;
        };

        testimonialProjectButtons.forEach(button => {
            if (!(button instanceof HTMLButtonElement)) return;
            button.addEventListener('click', () => {
                const videoIndex = Number(button.dataset.portfolioVideoIndex);
                const asset = Number.isInteger(videoIndex) ? window.cocoPortfolioVideos?.[videoIndex] : null;
                const projectTitle = button.dataset.projectTitle;
                const projectCaption = button.dataset.projectCaption;
                if (!asset || typeof asset.src !== 'string' || !projectTitle || !projectCaption) {
                    console.error('Impossible d’ouvrir le projet : informations vidéo manquantes.');
                    return;
                }

                activeProjectTrigger = button;
                testimonialProjectTitle.textContent = projectTitle;
                testimonialProjectDescription.textContent = projectCaption;
                testimonialProjectStatus.textContent = '';
                testimonialProjectVideo.poster = asset.poster;
                testimonialProjectVideo.src = asset.src;
                testimonialProjectVideo.load();
                testimonialProjectDialog.showModal();
                testimonialProjectVideo.play().catch(error => {
                    if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
                        console.error('Impossible de lancer la vidéo du projet.', error.name);
                        testimonialProjectStatus.textContent = 'La vidéo n’a pas pu démarrer. Utilisez les commandes du lecteur pour réessayer.';
                    }
                });
            });
        });
        testimonialProjectClose.addEventListener('click', closeTestimonialProject);
        testimonialProjectDialog.addEventListener('click', event => {
            if (event.target === testimonialProjectDialog) closeTestimonialProject();
        });
        testimonialProjectDialog.addEventListener('close', resetTestimonialProject);
    } else if (testimonialProjectButtons.length) {
        console.error('Impossible de configurer les vidéos des projets : éléments de dialogue introuvables.');
    }

    const homeDetailDialog = document.querySelector('#home-detail-dialog');
    const homeDetailTitle = homeDetailDialog?.querySelector('#home-detail-title');
    const homeDetailDescription = homeDetailDialog?.querySelector('.home-detail-description');
    const homeDetailImage = homeDetailDialog?.querySelector('.home-detail-image');
    const homeDetailVideo = homeDetailDialog?.querySelector('.home-detail-video');
    const homeDetailStatus = homeDetailDialog?.querySelector('.home-detail-status');
    const homeDetailClose = homeDetailDialog?.querySelector('.home-detail-close');
    const homeDetailButtons = Array.from(document.querySelectorAll('.home-detail-link'));

    if (
        homeDetailDialog instanceof HTMLDialogElement &&
        homeDetailTitle instanceof HTMLElement &&
        homeDetailDescription instanceof HTMLElement &&
        homeDetailImage instanceof HTMLImageElement &&
        homeDetailVideo instanceof HTMLVideoElement &&
        homeDetailStatus instanceof HTMLElement &&
        homeDetailClose instanceof HTMLButtonElement
    ) {
        let activeDetailTrigger = null;
        const closeHomeDetail = () => {
            if (homeDetailDialog.open) homeDetailDialog.close();
        };
        const resetHomeDetail = () => {
            homeDetailVideo.pause();
            homeDetailVideo.removeAttribute('src');
            homeDetailVideo.removeAttribute('poster');
            homeDetailVideo.load();
            homeDetailVideo.hidden = true;
            homeDetailImage.removeAttribute('src');
            homeDetailImage.hidden = true;
            homeDetailStatus.textContent = '';
            activeDetailTrigger?.focus({ preventScroll: true });
            activeDetailTrigger = null;
        };

        homeDetailButtons.forEach(button => {
            if (!(button instanceof HTMLButtonElement)) return;
            button.addEventListener('click', () => {
                const title = button.dataset.detailTitle;
                const description = button.dataset.detailDescription;
                if (!title || !description) {
                    console.error('Impossible d’ouvrir les détails : titre ou description manquant.');
                    return;
                }

                activeDetailTrigger = button;
                homeDetailTitle.textContent = title;
                homeDetailDescription.textContent = description;
                homeDetailStatus.textContent = '';
                const beautyVideoIndex = Number(button.dataset.detailBeautyVideoIndex);
                const portfolioVideoIndex = Number(button.dataset.detailVideoIndex);
                const asset = Number.isInteger(beautyVideoIndex)
                    ? window.cocoBeautyVideos?.[beautyVideoIndex]
                    : Number.isInteger(portfolioVideoIndex)
                        ? window.cocoPortfolioVideos?.[portfolioVideoIndex]
                        : null;

                if (asset && typeof asset.src === 'string') {
                    homeDetailVideo.poster = asset.poster;
                    homeDetailVideo.src = asset.src;
                    homeDetailVideo.hidden = false;
                    homeDetailVideo.load();
                } else {
                    const image = button.dataset.detailImage;
                    if (image) {
                        homeDetailImage.src = image;
                        homeDetailImage.alt = title;
                        homeDetailImage.hidden = false;
                    }
                }

                homeDetailDialog.showModal();
                if (asset && typeof asset.src === 'string') {
                    homeDetailVideo.play().catch(error => {
                        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
                            console.error('Impossible de lancer la vidéo des détails.', error.name);
                            homeDetailStatus.textContent = 'La vidéo n’a pas pu démarrer. Utilisez les commandes du lecteur pour réessayer.';
                        }
                    });
                }
            });
        });
        homeDetailClose.addEventListener('click', closeHomeDetail);
        homeDetailDialog.addEventListener('click', event => {
            if (event.target === homeDetailDialog) closeHomeDetail();
        });
        homeDetailDialog.addEventListener('close', resetHomeDetail);
    } else if (homeDetailButtons.length) {
        console.error('Impossible de configurer les détails des cartes : éléments de dialogue introuvables.');
    }

    const formatsTrack = document.querySelector('#formats-track');
    const formatsCount = document.querySelector('.formats-count');
    const formatPreviousButtons = Array.from(document.querySelectorAll('.formats-side-prev, .formats-control-prev'));
    const formatNextButtons = Array.from(document.querySelectorAll('.formats-side-next, .formats-control-next'));

    if (formatsTrack instanceof HTMLElement && formatsCount instanceof HTMLElement) {
        const formatCards = Array.from(formatsTrack.querySelectorAll('.format-card'));
        formatCards.forEach((card, index) => {
            card.dataset.formatIndex = String(index);
        });
        let formatDrag = null;

        const getActiveFormatCard = () => {
            const trackLeft = formatsTrack.getBoundingClientRect().left +
                (Number.parseFloat(getComputedStyle(formatsTrack).paddingLeft) || 0);
            return formatCards.find(card => card.getBoundingClientRect().right > trackLeft + 1) ??
                formatCards[formatCards.length - 1];
        };
        const updateFormatsControls = () => {
            const activeCard = getActiveFormatCard();
            const activeIndex = Number(activeCard?.dataset.formatIndex ?? 0);
            formatsCount.textContent =
                `${String(activeIndex + 1).padStart(2, '0')} / ${String(formatCards.length).padStart(2, '0')}`;
            const atStart = formatsTrack.scrollLeft <= 1;
            const atEnd = formatsTrack.scrollLeft >= formatsTrack.scrollWidth - formatsTrack.clientWidth - 1;
            formatPreviousButtons.forEach(button => {
                if (button instanceof HTMLButtonElement) button.disabled = atStart;
            });
            formatNextButtons.forEach(button => {
                if (button instanceof HTMLButtonElement) button.disabled = atEnd;
            });
        };
        const scrollFormats = direction => {
            const card = getActiveFormatCard();
            if (!card) return;
            const styles = getComputedStyle(formatsTrack);
            const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
            formatsTrack.scrollBy({
                left: direction * (card.getBoundingClientRect().width + gap),
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        };

        formatPreviousButtons.forEach(button => {
            button.addEventListener('click', () => scrollFormats(-1));
        });
        formatNextButtons.forEach(button => {
            button.addEventListener('click', () => scrollFormats(1));
        });
        formatsTrack.addEventListener('scroll', updateFormatsControls, { passive: true });
        formatsTrack.addEventListener('pointerdown', event => {
            if (
                event.pointerType !== 'mouse' ||
                event.button !== 0 ||
                (event.target instanceof Element && event.target.closest('a, button'))
            ) return;
            formatDrag = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startScrollLeft: formatsTrack.scrollLeft
            };
            formatsTrack.setPointerCapture(event.pointerId);
            formatsTrack.classList.add('is-dragging');
            event.preventDefault();
        });
        formatsTrack.addEventListener('pointermove', event => {
            if (!formatDrag || formatDrag.pointerId !== event.pointerId) return;
            formatsTrack.scrollLeft = formatDrag.startScrollLeft - (event.clientX - formatDrag.startX);
        });
        const finishFormatDrag = event => {
            if (!formatDrag || formatDrag.pointerId !== event.pointerId) return;
            if (formatsTrack.hasPointerCapture(event.pointerId)) {
                formatsTrack.releasePointerCapture(event.pointerId);
            }
            formatDrag = null;
            formatsTrack.classList.remove('is-dragging');
            updateFormatsControls();
        };
        formatsTrack.addEventListener('pointerup', finishFormatDrag);
        formatsTrack.addEventListener('pointercancel', finishFormatDrag);
        window.addEventListener('resize', updateFormatsControls);
        requestAnimationFrame(updateFormatsControls);
    }
    let overlayUpdateRequested = false;
    let heroOffsetTop = 0;
    let heroHeight = 1;
    let heroScrollDistance = 1;
    let heroOverlayOpacity = null;
    let activePortfolioVideo = null;
    let portfolioUpdateRequested = false;
    const beautyVideoShowcase = document.querySelector('.beauty-video-showcase');
    if (beautyVideoShowcase instanceof HTMLElement) {
        const showcaseSlides = Array.from(beautyVideoShowcase.querySelectorAll('.beauty-video-slide'));
        const videoSlides = showcaseSlides.filter(slide => slide.querySelector('video'));
        const beautyVideoDetails = document.querySelector('.beauty-video-details');
        const beautyVideoDetailTitle = beautyVideoDetails?.querySelector('.beauty-video-detail-title');
        const beautyVideoDetailDescription = beautyVideoDetails?.querySelector('.beauty-video-detail-description');
        const beautyVideoDetailLink = beautyVideoDetails?.querySelector('.beauty-video-detail-link');
        const videoCurrent = beautyVideoShowcase.querySelector('.beauty-video-current');
        const previousVideoButton = beautyVideoShowcase.querySelector('.beauty-video-button.prev');
        const nextVideoButton = beautyVideoShowcase.querySelector('.beauty-video-button.next');
        const soundButton = beautyVideoShowcase.querySelector('.beauty-video-sound');
        const playButton = beautyVideoShowcase.querySelector('.beauty-video-play');
        const videoTrack = beautyVideoShowcase.querySelector('.beauty-video-track');
        const slidesHaveVideoSources = videoSlides.every(slide => {
            const video = slide.querySelector('video');
            return video instanceof HTMLVideoElement && Boolean(video.dataset.src);
        });

        if (
            !showcaseSlides.length ||
            !videoSlides.length ||
            !slidesHaveVideoSources ||
            !(beautyVideoDetails instanceof HTMLElement) ||
            !(beautyVideoDetailTitle instanceof HTMLElement) ||
            !(beautyVideoDetailDescription instanceof HTMLElement) ||
            !(beautyVideoDetailLink instanceof HTMLButtonElement) ||
            !(videoCurrent instanceof HTMLElement) ||
            !(previousVideoButton instanceof HTMLButtonElement) ||
            !(nextVideoButton instanceof HTMLButtonElement) ||
            !(soundButton instanceof HTMLButtonElement) ||
            !(playButton instanceof HTMLButtonElement) ||
            !(videoTrack instanceof HTMLElement)
        ) {
            console.error('Impossible de configurer le carrousel vidéo beauté : éléments ou sources introuvables.');
        } else {
            let activeVideoIndex = 0;
            let isVideoShowcaseVisible = false;
            let soundEnabled = false;
            let isVideoPausedByUser = false;

            const updateSoundButton = () => {
                soundButton.setAttribute('aria-pressed', String(soundEnabled));
                soundButton.setAttribute('aria-label', soundEnabled ? 'Couper le son' : 'Activer le son');
            };

            const updatePlayButton = () => {
                const activeVideo = getActiveVideo();
                const hasActiveVideo = activeVideo instanceof HTMLVideoElement;
                playButton.hidden = !hasActiveVideo;
                soundButton.hidden = !hasActiveVideo;
                const isPaused = !hasActiveVideo || isVideoPausedByUser || activeVideo.paused;
                playButton.setAttribute('aria-pressed', String(isPaused));
                playButton.setAttribute('aria-label', isPaused ? 'Lire la vidéo' : 'Mettre la vidéo en pause');
            };

            const getActiveVideo = () => showcaseSlides[activeVideoIndex]?.querySelector('video');

            const updateBeautyVideoDetails = () => {
                const asset = window.cocoBeautyVideos?.[activeVideoIndex];
                if (!asset || typeof asset.title !== 'string' || typeof asset.description !== 'string') {
                    beautyVideoDetails.hidden = true;
                    if (activeVideoIndex < videoSlides.length) {
                        console.error(`Informations manquantes pour la vidéo beauté ${activeVideoIndex + 1}.`);
                    }
                    return;
                }

                beautyVideoDetails.hidden = false;
                beautyVideoDetailTitle.textContent = asset.title;
                beautyVideoDetailDescription.textContent = asset.description;
                beautyVideoDetailLink.dataset.detailTitle = asset.title;
                beautyVideoDetailLink.dataset.detailDescription = asset.description;
                beautyVideoDetailLink.dataset.detailBeautyVideoIndex = String(activeVideoIndex);
            };

            const updateVideoShowcase = () => {
                const previousIndex = activeVideoIndex === 0 ? videoSlides.length - 1 : activeVideoIndex - 1;
                const nextIndex = activeVideoIndex === showcaseSlides.length - 1 ? 0 : activeVideoIndex + 1;
                const activeVideo = getActiveVideo();
                if (!(activeVideo instanceof HTMLVideoElement)) soundEnabled = false;

                showcaseSlides.forEach((slide, index) => {
                    const isActive = index === activeVideoIndex;
                    slide.classList.toggle('is-active', isActive);
                    slide.classList.toggle('is-previous', index === previousIndex);
                    slide.classList.toggle('is-next', index === nextIndex);
                    slide.setAttribute('aria-hidden', String(!isActive));
                    slide.inert = !isActive;
                    const video = slide.querySelector('video');
                    if (!(video instanceof HTMLVideoElement)) return;

                    if (!isActive || !isVideoShowcaseVisible) {
                        video.muted = true;
                        video.pause();
                        if (video.hasAttribute('src')) {
                            video.removeAttribute('src');
                            video.load();
                        }
                        return;
                    }

                    if (!video.getAttribute('src')) {
                        if (!video.dataset.src) {
                            console.error('Aucune source définie pour une vidéo de la galerie beauté.');
                            return;
                        }
                        video.preload = 'auto';
                        video.src = video.dataset.src;
                        video.load();
                    }

                    video.muted = !soundEnabled;
                    if (isVideoPausedByUser) {
                        video.pause();
                        return;
                    }

                    video.play().catch(error => {
                        if (error.name !== 'AbortError') {
                            console.error(`Impossible de lire la vidéo de la galerie beauté : ${video.dataset.src}`, error);
                        }
                    });
                });

                videoCurrent.textContent = String(activeVideoIndex + 1);
                videoTrack.classList.toggle('is-cta-active', !(activeVideo instanceof HTMLVideoElement));
                updateSoundButton();
                updatePlayButton();
                updateBeautyVideoDetails();
            };

            const refreshVideoShowcaseVisibility = () => {
                const bounds = beautyVideoShowcase.getBoundingClientRect();
                const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
                const visible = visibleHeight / Math.max(bounds.height, 1) >= 0.25 && !document.hidden;
                if (visible === isVideoShowcaseVisible) return;
                isVideoShowcaseVisible = visible;
                updateVideoShowcase();
            };

            const moveToVideo = direction => {
                if (direction > 0) {
                    activeVideoIndex = activeVideoIndex >= videoSlides.length ? 0 : activeVideoIndex + 1;
                } else {
                    activeVideoIndex = activeVideoIndex === 0 ? videoSlides.length - 1 : activeVideoIndex - 1;
                }
                isVideoPausedByUser = false;
                updateVideoShowcase();
            };

            videoSlides.forEach(slide => {
                const video = slide.querySelector('video');
                if (!(video instanceof HTMLVideoElement)) return;
                video.addEventListener('play', () => {
                    if (getActiveVideo() !== video) return;
                    isVideoPausedByUser = false;
                    updatePlayButton();
                });
                video.addEventListener('pause', () => {
                    if (getActiveVideo() === video) updatePlayButton();
                });
            });

            previousVideoButton.addEventListener('click', () => moveToVideo(-1));
            nextVideoButton.addEventListener('click', () => moveToVideo(1));
            soundButton.addEventListener('click', () => {
                const activeVideo = getActiveVideo();
                if (!(activeVideo instanceof HTMLVideoElement)) return;
                soundEnabled = !soundEnabled;
                activeVideo.muted = !soundEnabled;
                if (soundEnabled) {
                    activeVideo.volume = 1;
                    activeVideo.play().catch(error => {
                        if (error.name === 'NotAllowedError') {
                            soundEnabled = false;
                            activeVideo.muted = true;
                            updateVideoShowcase();
                        } else if (error.name !== 'AbortError') {
                            console.error('Impossible d’activer le son de la vidéo beauté.', error);
                        }
                    });
                }
                updateVideoShowcase();
            });
            playButton.addEventListener('click', () => {
                if (!(getActiveVideo() instanceof HTMLVideoElement)) return;
                isVideoPausedByUser = !isVideoPausedByUser;
                updateVideoShowcase();
            });
            let dragStartX = null;
            let dragPointerId = null;

            videoTrack.addEventListener('pointerdown', event => {
                if (event.target instanceof Element && event.target.closest('button, a')) return;
                if (event.pointerType === 'mouse' && event.button !== 0) return;
                dragStartX = event.clientX;
                dragPointerId = event.pointerId;
                videoTrack.classList.add('is-dragging');
                videoTrack.setPointerCapture(event.pointerId);
            });
            videoTrack.addEventListener('pointerup', event => {
                if (event.pointerId !== dragPointerId || dragStartX === null) return;
                const dragDistance = event.clientX - dragStartX;
                dragStartX = null;
                dragPointerId = null;
                videoTrack.classList.remove('is-dragging');
                if (Math.abs(dragDistance) > 50) moveToVideo(dragDistance < 0 ? 1 : -1);
            });
            const cancelVideoDrag = () => {
                dragStartX = null;
                dragPointerId = null;
                videoTrack.classList.remove('is-dragging');
            };
            videoTrack.addEventListener('pointercancel', cancelVideoDrag);
            videoTrack.addEventListener('lostpointercapture', cancelVideoDrag);

            if ('IntersectionObserver' in window) {
                const videoShowcaseObserver = new IntersectionObserver(([entry]) => {
                    refreshVideoShowcaseVisibility();
                }, { threshold: 0.25 });
                videoShowcaseObserver.observe(beautyVideoShowcase);
            }
            let visibilityUpdateRequested = false;
            const queueVisibilityUpdate = () => {
                if (visibilityUpdateRequested) return;
                visibilityUpdateRequested = true;
                window.requestAnimationFrame(() => {
                    visibilityUpdateRequested = false;
                    refreshVideoShowcaseVisibility();
                });
            };
            window.addEventListener('scroll', queueVisibilityUpdate, { passive: true });
            window.addEventListener('resize', queueVisibilityUpdate);
            document.addEventListener('visibilitychange', queueVisibilityUpdate);
            updateVideoShowcase();
            refreshVideoShowcaseVisibility();
        }
    }

    const activatePersonalityRow = row => {
        personalityRows.forEach(personality => {
            const isActive = personality === row;
            personality.classList.toggle('is-active', isActive);
            personality.setAttribute('aria-expanded', String(isActive));
        });
    };

    personalityRows.forEach(row => {
        row.addEventListener('pointerenter', event => {
            if (event.pointerType !== 'touch') activatePersonalityRow(row);
        });
        row.addEventListener('pointerleave', event => {
            if (event.pointerType === 'touch') return;
            if (!row.matches(':focus-within')) {
                row.classList.remove('is-active');
                row.setAttribute('aria-expanded', 'false');
            }
        });
        row.addEventListener('focusin', () => activatePersonalityRow(row));
        row.addEventListener('focusout', event => {
            if (!row.contains(event.relatedTarget)) {
                row.classList.remove('is-active');
                row.setAttribute('aria-expanded', 'false');
            }
        });
        row.addEventListener('click', event => {
            if (event.target instanceof Element && event.target.closest('a, button')) return;
            activatePersonalityRow(row);
        });
        row.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            activatePersonalityRow(row);
        });
    });

    const loadPortfolioVideo = video => {
        if (video.dataset.loaded) return;
        video.preload = 'metadata';
        video.src = video.dataset.src;
        video.dataset.loaded = 'true';
        video.addEventListener('loadedmetadata', () => {
            if (Number.isFinite(video.duration) && video.duration > 0.1) {
                video.currentTime = 0.1;
            }
        }, { once: true });
        video.addEventListener('loadeddata', () => video.pause(), { once: true });
        video.addEventListener('seeked', () => video.pause(), { once: true });
        video.addEventListener('error', () => {
            if (video.error?.code !== 1) {
                console.error(`Impossible de charger la vidéo du portfolio : ${video.dataset.src}`);
            }
        }, { once: true });
        video.load();
    };

    const playPortfolioVideo = video => {
        loadPortfolioVideo(video);
        video.muted = false;
        video.play().catch(error => {
            if (error.name !== 'AbortError') {
                console.error(`Impossible de lancer la vidéo du portfolio : ${video.dataset.src}`, error);
            }
        });
    };

    const updatePortfolioVideoControls = video => {
        const card = video.closest('.portfolio-video-card');
        const playButton = card?.querySelector('.portfolio-play-button');
        const caption = card?.querySelector('figcaption')?.textContent?.trim() || 'cette création';
        const playingWithSound = !video.paused && !video.muted;

        card?.classList.toggle('is-playing', playingWithSound);
        playButton?.setAttribute(
            'aria-label',
            playingWithSound ? `Mettre en pause la vidéo : ${caption}` : `Lire la vidéo avec le son : ${caption}`
        );
    };

    const releasePortfolioVideo = video => {
        video.muted = true;
        video.pause();
        video.removeAttribute('src');
        delete video.dataset.loaded;
        video.load();
    };

    const updatePortfolioGallery = () => {
        if (!(portfolioFilmstrip instanceof HTMLElement) || !(portfolioGallery instanceof HTMLElement)) return;

        const maxScroll = portfolioFilmstrip.scrollWidth - portfolioFilmstrip.clientWidth;
        const canScrollLeft = portfolioFilmstrip.scrollLeft > 1;
        const canScrollRight = portfolioFilmstrip.scrollLeft < maxScroll - 1;
        portfolioGallery.classList.toggle('can-scroll-left', canScrollLeft);
        portfolioGallery.classList.toggle('can-scroll-right', canScrollRight);
        portfolioGalleryArrows.forEach(arrow => {
            const isLeftArrow = arrow.classList.contains('portfolio-gallery-arrow-left');
            const isAvailable = isLeftArrow ? canScrollLeft : canScrollRight;
            arrow.disabled = !isAvailable;
            arrow.setAttribute('aria-hidden', String(!isAvailable));
        });

    };

    const updatePortfolioPreviews = () => {
        if (!(portfolioFilmstrip instanceof HTMLElement)) return;
        const stripRect = portfolioFilmstrip.getBoundingClientRect();
        if (stripRect.bottom <= 0 || stripRect.top >= window.innerHeight) {
            portfolioVideos.forEach(video => {
                if (video.dataset.loaded) releasePortfolioVideo(video);
            });
            activePortfolioVideo = null;
            return;
        }

        portfolioVideos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const isVisible = rect.right > stripRect.left && rect.left < stripRect.right &&
                rect.bottom > Math.max(0, stripRect.top) && rect.top < Math.min(window.innerHeight, stripRect.bottom);

            if (video === activePortfolioVideo) {
                if (!isVisible) {
                    releasePortfolioVideo(video);
                    activePortfolioVideo = null;
                } else {
                    return;
                }
            }

            const visibleLeft = Math.max(0, stripRect.left, rect.left);
            const visibleRight = Math.min(window.innerWidth, stripRect.right, rect.right);
            const visibleTop = Math.max(0, stripRect.top, rect.top);
            const visibleBottom = Math.min(window.innerHeight, stripRect.bottom, rect.bottom);
            const visibleArea = Math.max(0, visibleRight - visibleLeft) * Math.max(0, visibleBottom - visibleTop);
            const visibleRatio = visibleArea / Math.max(1, rect.width * rect.height);

            if (visibleRatio >= 0.15) {
                if (!video.dataset.loaded) loadPortfolioVideo(video);
                video.muted = true;
                video.pause();
            } else if (video.dataset.loaded) {
                releasePortfolioVideo(video);
            }
        });
    };

    portfolioVideos.forEach(video => {
        const card = video.closest('.portfolio-video-card');
        const playButton = card?.querySelector('.portfolio-play-button');
        video.addEventListener('play', () => updatePortfolioVideoControls(video));
        video.addEventListener('pause', () => updatePortfolioVideoControls(video));
        video.addEventListener('volumechange', () => updatePortfolioVideoControls(video));

        if (!(playButton instanceof HTMLButtonElement)) return;
        playButton.addEventListener('click', () => {
            if (!video.paused && !video.muted) {
                video.pause();
                return;
            }
            if (activePortfolioVideo && activePortfolioVideo !== video) {
                releasePortfolioVideo(activePortfolioVideo);
            }
            activePortfolioVideo = video;
            playPortfolioVideo(video);
        });
    });

    const queuePortfolioUpdate = () => {
        if (portfolioUpdateRequested) return;
        portfolioUpdateRequested = true;
        window.requestAnimationFrame(() => {
            portfolioUpdateRequested = false;
            updatePortfolioGallery();
            updatePortfolioPreviews();
        });
    };

    const updateHeroOverlay = () => {
        if (!(heroSection instanceof HTMLElement)) return;

        const scrolledDistance = Math.max(0, window.scrollY - heroOffsetTop);
        const scrollProgress = Math.min(1, scrolledDistance / heroScrollDistance);
        const fadeProgress = Math.min(1, scrollProgress / 0.65);
        const nextOpacity = Math.round((1 - fadeProgress) * 100) / 100;
        if (nextOpacity === heroOverlayOpacity) return;
        heroOverlayOpacity = nextOpacity;
        heroSection.style.setProperty('--hero-overlay-opacity', String(nextOpacity));
    };
    const measureHeroScrollRange = () => {
        if (!(heroSection instanceof HTMLElement)) return;
        heroOffsetTop = heroSection.offsetTop;
        heroHeight = heroSection.offsetHeight;
        heroScrollDistance = Math.max(1, heroHeight - window.innerHeight);
    };
    const queueHeroOverlayUpdate = () => {
        if (overlayUpdateRequested) return;
        overlayUpdateRequested = true;
        window.requestAnimationFrame(() => {
            overlayUpdateRequested = false;
            updateHeroOverlay();
            updateTrustCopyReveal();
            startVisibleNumberCounters();
            updatePortfolioPreviews();
        });
    };
    handleScrollUpdate = queueHeroOverlayUpdate;

    measureHeroScrollRange();
    updateHeroOverlay();
    updateTrustCopyReveal();
    startVisibleNumberCounters();
    updatePortfolioGallery();
    updatePortfolioPreviews();
    window.addEventListener('scroll', queueHeroOverlayUpdate, { passive: true });
    window.addEventListener('resize', () => {
        measureHeroScrollRange();
        updateHeroOverlay();
        updateTrustCopyReveal();
        startVisibleNumberCounters();
        queuePortfolioUpdate();
    }, { passive: true });
    portfolioFilmstrip?.addEventListener('scroll', queuePortfolioUpdate, { passive: true });
    portfolioGalleryArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const card = portfolioFilmstrip?.querySelector('.portfolio-video-card');
            if (!card || !portfolioFilmstrip) return;

            const gap = Number.parseFloat(window.getComputedStyle(
                portfolioFilmstrip.querySelector('.portfolio-video-track')
            ).columnGap) || 0;
            const direction = arrow.classList.contains('portfolio-gallery-arrow-left') ? -1 : 1;
            portfolioFilmstrip.scrollBy({
                left: direction * (card.getBoundingClientRect().width + gap),
                behavior: 'instant'
            });
            updatePortfolioGallery();
        });
    });

    const hasServiceDiscovery = servicePoints.length > 0 || serviceBackdrop !== null || serviceCard !== null;
    if (
        hasServiceDiscovery && (
            servicePoints.length !== 3 ||
            !(serviceBackdrop instanceof HTMLElement) ||
            !(serviceCard instanceof HTMLElement) ||
            !(serviceKicker instanceof HTMLParagraphElement) ||
            !(serviceTitle instanceof HTMLHeadingElement) ||
            !(serviceDescription instanceof HTMLParagraphElement) ||
            !(closeServiceCard instanceof HTMLButtonElement)
        )) {
        console.error('Impossible de configurer les points de découverte des services.');
    } else if (hasServiceDiscovery) {
        let activeServicePoint = null;
        let suppressPointFocus = false;
        let closeTimer;
        let autoCardTimer;
        let autoCardPoint = null;
        let autoCardQueue = [];
        let hasUserScrolled = false;
        const seenAutoServices = new Set(JSON.parse(
            window.sessionStorage.getItem('coco-miracles-service-intro') || '[]'
        ));

        const clearCloseTimer = () => {
            window.clearTimeout(closeTimer);
        };

        const scheduleClose = () => {
            clearCloseTimer();
            closeTimer = window.setTimeout(() => closeCard(), 140);
        };

        const cancelAutoCards = () => {
            window.clearTimeout(autoCardTimer);
            autoCardPoint = null;
            autoCardQueue = [];
        };

        const positionCard = point => {
            if (serviceCard.hidden) return;

            const pointRect = point.getBoundingClientRect();
            const cardWidth = serviceCard.offsetWidth;
            const cardHeight = serviceCard.offsetHeight;
            const edge = 16;
            const gap = 16;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight;
            const right = pointRect.right + gap;
            const left = pointRect.left - cardWidth - gap;
            let cardLeft;

            if (right + cardWidth <= viewportWidth - edge) {
                cardLeft = right;
            } else if (left >= edge) {
                cardLeft = left;
            } else {
                cardLeft = pointRect.left + pointRect.width / 2 - cardWidth / 2;
            }

            cardLeft = Math.max(edge, Math.min(cardLeft, viewportWidth - cardWidth - edge));
            const aboveTop = pointRect.top - cardHeight - gap;
            const belowTop = pointRect.bottom + gap;
            let cardTop;
            if (pointRect.top > viewportHeight / 2 && aboveTop >= edge) {
                cardTop = aboveTop;
            } else if (belowTop + cardHeight <= viewportHeight - edge) {
                cardTop = belowTop;
            } else {
                cardTop = Math.max(
                    edge,
                    Math.min(
                        pointRect.top + pointRect.height / 2 - cardHeight / 2,
                        viewportHeight - cardHeight - edge
                    )
                );
            }
            serviceCard.style.left = `${cardLeft}px`;
            serviceCard.style.top = `${cardTop}px`;
            serviceCard.style.setProperty(
                '--card-origin-x',
                `${Math.max(0, Math.min(cardWidth, pointRect.left + pointRect.width / 2 - cardLeft))}px`
            );
            serviceCard.style.setProperty(
                '--card-origin-y',
                `${Math.max(0, Math.min(cardHeight, pointRect.top + pointRect.height / 2 - cardTop))}px`
            );
        };

        const closeCard = (returnFocus = false) => {
            clearCloseTimer();
            const pointToFocus = activeServicePoint;
            serviceCard.hidden = true;
            serviceBackdrop.hidden = true;
            servicePoints.forEach(point => point.setAttribute('aria-expanded', 'false'));
            servicePoints.forEach(point => {
                point.classList.remove('is-hovered');
                point.style.removeProperty('transform');
            });
            activeServicePoint = null;
            if (returnFocus && pointToFocus) {
                suppressPointFocus = true;
                pointToFocus.focus({ preventScroll: true });
                window.requestAnimationFrame(() => {
                    suppressPointFocus = false;
                });
            }
        };

        const showCard = point => {
            const service = serviceContent[point.dataset.service];
            if (!service) {
                console.error(`Aucun contenu défini pour le service : ${point.dataset.service}`);
                return;
            }

            clearCloseTimer();
            const changingService = activeServicePoint !== point;
            servicePoints.forEach(item => {
                item.setAttribute('aria-expanded', String(item === point));
            });
            activeServicePoint = point;
            serviceKicker.textContent = service.kicker;
            serviceTitle.textContent = service.title;
            serviceDescription.textContent = service.description;
            serviceBackdrop.hidden = false;
            serviceCard.hidden = false;
            positionCard(point);
            if (changingService) {
                serviceCard.style.animation = 'none';
                serviceCard.offsetWidth;
                serviceCard.style.removeProperty('animation');
            }
        };

        const showNextAutoCard = () => {
            if (autoCardPoint || activeServicePoint || autoCardQueue.length === 0) return;

            const point = autoCardQueue.shift();
            autoCardPoint = point;
            showCard(point);
            autoCardTimer = window.setTimeout(() => {
                if (activeServicePoint === point) closeCard();
                autoCardPoint = null;
                showNextAutoCard();
            }, 1600);
        };

        const queueVisibleAutoCards = () => {
            if (!hasUserScrolled) return;

            servicePoints
                .filter(point => {
                    const rect = point.getBoundingClientRect();
                    return rect.bottom > 0 && rect.top < window.innerHeight;
                })
                .sort((first, second) =>
                    first.getBoundingClientRect().top - second.getBoundingClientRect().top
                )
                .forEach(point => {
                    const service = point.dataset.service;
                    if (!service || seenAutoServices.has(service)) return;
                    seenAutoServices.add(service);
                    autoCardQueue.push(point);
                });

            window.sessionStorage.setItem(
                'coco-miracles-service-intro',
                JSON.stringify(Array.from(seenAutoServices))
            );
            showNextAutoCard();
        };

        servicePoints.forEach(point => {
            point.addEventListener('pointerenter', event => {
                if (event.pointerType === 'mouse') {
                    cancelAutoCards();
                    clearCloseTimer();
                    point.classList.add('is-hovered');
                    point.style.transform = 'scale(0.72)';
                    showCard(point);
                }
            });
            point.addEventListener('pointerleave', event => {
                if (event.pointerType === 'mouse') {
                    point.classList.remove('is-hovered');
                    point.style.removeProperty('transform');
                    scheduleClose();
                }
            });
            point.addEventListener('focus', () => {
                if (!suppressPointFocus) {
                    cancelAutoCards();
                    showCard(point);
                }
            });
            point.addEventListener('click', () => {
                cancelAutoCards();
                showCard(point);
                closeServiceCard.focus({ preventScroll: true });
            });
        });

        serviceCard.addEventListener('pointerenter', clearCloseTimer);
        serviceCard.addEventListener('pointerleave', event => {
            if (event.pointerType === 'mouse') scheduleClose();
        });
        serviceBackdrop.addEventListener('click', () => {
            cancelAutoCards();
            closeCard();
        });
        closeServiceCard.addEventListener('click', () => {
            cancelAutoCards();
            closeCard(true);
        });
        document.addEventListener('click', event => {
            if (serviceCard.hidden || !(event.target instanceof Element)) return;
            if (serviceCard.contains(event.target) || event.target.closest('.hero-service-point')) return;
            cancelAutoCards();
            closeCard();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && !serviceCard.hidden) {
                cancelAutoCards();
                closeCard(true);
            }
        });
        window.addEventListener('resize', () => {
            if (activeServicePoint) positionCard(activeServicePoint);
        });
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) hasUserScrolled = true;
            queueVisibleAutoCards();
            if (activeServicePoint) window.requestAnimationFrame(() => positionCard(activeServicePoint));
        }, { passive: true });

        const servicePointObserver = new IntersectionObserver(entries => {
            if (!hasUserScrolled) return;
            entries
                .filter(entry => entry.isIntersecting)
                .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)
                .forEach(entry => {
                    const service = entry.target.dataset.service;
                    if (!service || seenAutoServices.has(service)) return;
                    seenAutoServices.add(service);
                    autoCardQueue.push(entry.target);
                });
            window.sessionStorage.setItem(
                'coco-miracles-service-intro',
                JSON.stringify(Array.from(seenAutoServices))
            );
            showNextAutoCard();
        }, { threshold: 0.1 });
        servicePoints.forEach(point => servicePointObserver.observe(point));
    }

    const configurePresentation = (trigger, dialog) => {
        const closeButton = dialog?.querySelector('.direction-dialog-close');

        if (
            !(trigger instanceof HTMLButtonElement) ||
            !(dialog instanceof HTMLDialogElement) ||
            !(closeButton instanceof HTMLButtonElement)
        ) {
            console.error('Impossible de configurer une présentation : éléments de dialogue introuvables.');
            return;
        }

        const closePresentation = () => {
            dialog.close();
            trigger.focus({ preventScroll: true });
        };

        trigger.addEventListener('click', () => dialog.showModal());
        closeButton.addEventListener('click', closePresentation);
        dialog.addEventListener('click', event => {
            if (event.target === dialog) closePresentation();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && dialog.open) {
                event.preventDefault();
                closePresentation();
            }
        });
    };

    configurePresentation(
        document.querySelector('.direction-expand:not(.craft-team-expand)'),
        document.querySelector('#direction-dialog')
    );
    configurePresentation(
        document.querySelector('.craft-team-expand'),
        document.querySelector('#craft-team-dialog')
    );

    const PRESTATION_CATALOG_DATA = {
        'Décoration sur-mesure': {
            tags: 'Scénographie d’Apparat, Art Floral & Décors Immersifs',
            sub: 'dans la Haute Événementielle',
            title: 'Décoration sur-mesure',
            desc: 'Coco Miracles imagine et sculpte des ambiances complètes où l’architecture du lieu s’efface au profit d’une féerie florale et lumineuse sur-mesure.',
            extended: 'Arches monumentales, voûtes végétales suspendues, drapés aériens et créations immersives : chaque scénographie est une ode à la majesté conçue pour transformer chaque instant en souvenir éternel.',
            images: [
                { src: 'asset/bg/Seaside Floral Arch Wedding Ceremony.png', alt: 'Cérémonie royale sur la côte' },
                { src: 'asset/bg/hero-optimized.jpg', alt: 'Scénographie florale monumentale' },
                { src: 'asset/realisation/1.jpg', alt: 'Dressage floral d’exception' },
                { src: 'asset/work/1.jpg', alt: 'Détail de composition florale' },
                { src: 'asset/bg/2.png', alt: 'Ambiance nocturne et illuminations' }
            ]
        },
        'Direction artistique & production visuelle': {
            tags: 'Direction Artistique, Art de la Table & Production Visuelle',
            sub: 'dans la Haute Couture Événementielle',
            title: 'Direction artistique & production visuelle',
            desc: 'Une harmonie esthétique sans faille : du choix des teintes aux matières nobles, nous créons une identité visuelle saisissante et pérenne.',
            extended: 'Dressage impérial, vaisselle d’orfèvre, conception d’une signature lumineuse et direction stylistique des captations : chaque perspective est ciselée comme un tableau vivant.',
            images: [
                { src: 'asset/bg/villa-event.jpg', alt: 'Mise en scène villa de prestige' },
                { src: 'asset/realisation/2.jpg', alt: 'Art de la table impérial' },
                { src: 'asset/bg/new-optimized.jpg', alt: 'Harmonie noble et visuelle' },
                { src: 'asset/work/2.jpg', alt: 'Lumières & matières nobles' },
                { src: 'asset/bg/3.png', alt: 'Captation stylisée et ambiance' }
            ]
        },
        'Planning événementiel d’élite': {
            tags: 'Régie Logistique, Coordination Jour J & Protocole',
            sub: 'dans l’Excellence Opérationnelle',
            title: 'Planning événementiel d’élite',
            desc: 'Une planification rigoureuse et une présence feutrée en coulisses pour que chaque temps fort de votre célébration s’exécute avec une perfection millimétrée.',
            extended: 'Rétroplannings détaillés, synchronisation des artisans d’élite, gestion prédictive des flux et encadrement protocolaire : profitez sereinement de vos convives, nous maîtrisons chaque détail.',
            images: [
                { src: 'asset/team/Equipe3.jpg', alt: 'L’équipe de régie en action' },
                { src: 'asset/bg/gala-banner.jpg', alt: 'Coordination de grand banquet' },
                { src: 'asset/realisation/3.jpg', alt: 'Mise en place protocolaire' },
                { src: 'asset/work/3.jpg', alt: 'Orchestration en coulisses' },
                { src: 'asset/bg/4.png', alt: 'Célébration d’élite et fluidité' }
            ]
        },
        'Maquillage artistique & événementiel': {
            tags: 'Bridal Artistry, Beauté Nuptiale & Soins d’Apparat',
            sub: 'dans l’Art Sublimatoire & Prestige',
            title: 'Maquillage artistique & événementiel',
            desc: 'Mise en beauté nuptiale haute définition, travail d’orfèvre sur le teint réflecteur de lumière et soins préparatoires d’exception pour la reine du jour et son cortège.',
            extended: 'Nos artistes maquilleurs subliment les lignes naturelles et la carnation de chaque visage grâce à des techniques haute tenue pensées pour rayonner sous les feux des projecteurs comme sous la lumière du jour.',
            images: [
                { src: 'asset/beaute/posters/01.jpg', alt: 'Teint haute définition et éclat' },
                { src: 'asset/beaute/posters/02.jpg', alt: 'Mise en beauté nuptiale' },
                { src: 'asset/beaute/posters/03.jpg', alt: 'Regard sublimé & parure' },
                { src: 'asset/beaute/posters/04.jpg', alt: 'Soins d’apparat' },
                { src: 'asset/beaute/posters/05.jpg', alt: 'Mise en beauté festive' }
            ]
        },
        'Suivi & accompagnement personnalisé': {
            tags: 'Interlocuteur Dédié, Conseil Stratégique & Conciergerie',
            sub: 'dans la Relation Client de Prestige',
            title: 'Suivi & accompagnement personnalisé',
            desc: 'Une relation de proximité et de confiance absolue dès la première esquisse jusqu’aux lendemains de fête, portée par un interlocuteur privilégié.',
            extended: 'Écoute attentive, disponibilité constante, confidentialité absolue et anticipation de chaque souhait : nous vous accompagnons à chaque pas avec la déférence et l’attention que mérite votre projet.',
            images: [
                { src: 'asset/team/ceo-coco-miracles.jpg', alt: 'Direction de la Maison Coco Miracles' },
                { src: 'asset/work/4.jpg', alt: 'Consultations privées et esquisses' },
                { src: 'asset/realisation/1.jpg', alt: 'Création et suivi de projet' },
                { src: 'asset/bg/hero-optimized.jpg', alt: 'Concrétisation d’exception' },
                { src: 'asset/bg/1.png', alt: 'Intimité & élégance' }
            ]
        },
        'Événements privés & corporate': {
            tags: 'Dîners de Gala, Sommets Institutionnels & Célébrations',
            sub: 'dans les Réceptions de Grand Prestige',
            title: 'Événements privés & corporate',
            desc: 'Orchestration magistrale d’événements d’envergure pour institutions, marques de prestige et grandes familles : banquets d’État, galas et lancements officiels.',
            extended: 'Une scénographie monumentale alliée à une stricte maîtrise protocolaire pour offrir à vos hôtes et partenaires une expérience solennelle gravée dans les mémoires.',
            images: [
                { src: 'asset/bg/gala-banner.jpg', alt: 'Grand dîner de gala' },
                { src: 'asset/bg/villa-event.jpg', alt: 'Réception d’envergure' },
                { src: 'asset/realisation/4.jpg', alt: 'Protocole VIP' },
                { src: 'asset/personality/adebayor.jpg', alt: 'Hôtes d’honneur' },
                { src: 'asset/bg/5.png', alt: 'Scène de grand événement' }
            ]
        }
    };

    const catalogDialog = document.querySelector('#prestation-catalog-dialog');
    const popupTags = catalogDialog?.querySelector('#popup-catalog-tags');
    const popupSub = catalogDialog?.querySelector('#popup-catalog-sub');
    const popupTitle = catalogDialog?.querySelector('#popup-catalog-title');
    const popupDesc = catalogDialog?.querySelector('#popup-catalog-desc');
    const popupDescExtended = catalogDialog?.querySelector('#popup-catalog-desc-extended');
    const popupExtendedWrap = catalogDialog?.querySelector('#popup-catalog-extended-wrap');
    const popupReadMoreBtn = catalogDialog?.querySelector('#popup-catalog-readmore');
    const popupCloseBtn = catalogDialog?.querySelector('.popup-close-btn');
    const popupGallery = catalogDialog?.querySelector('.popup-carousel-track');
    const popupRequestBtn = catalogDialog?.querySelector('#popup-catalog-request-btn');
    const catalogTriggers = Array.from(document.querySelectorAll('.prestation-catalog-button'));

    if (
        !(catalogDialog instanceof HTMLDialogElement) ||
        !(popupTags instanceof HTMLElement) ||
        !(popupSub instanceof HTMLElement) ||
        !(popupTitle instanceof HTMLElement) ||
        !(popupDesc instanceof HTMLElement) ||
        !(popupGallery instanceof HTMLElement)
    ) {
        console.error('Impossible de configurer le catalogue des prestations : éléments introuvables.');
    } else {
        let catalogTrigger = null;

        const closeCatalog = () => {
            if (catalogDialog.open) catalogDialog.close();
            catalogTrigger?.focus({ preventScroll: true });
        };

        const renderCatalogCards = (images) => {
            return (images || []).map(img => `
                <article class="popup-card">
                    <img src="${img.src}" alt="${img.alt || 'Réalisation Coco Miracles'}" loading="lazy">
                </article>
            `).join('');
        };

        const openCatalogForService = (title) => {
            const data = PRESTATION_CATALOG_DATA[title] || PRESTATION_CATALOG_DATA['Décoration sur-mesure'];
            popupTags.textContent = data.tags;
            popupSub.textContent = data.sub;
            popupTitle.textContent = data.title;
            popupDesc.textContent = data.desc;
            if (popupDescExtended) popupDescExtended.textContent = data.extended;
            if (popupExtendedWrap) popupExtendedWrap.hidden = true;
            if (popupReadMoreBtn) {
                popupReadMoreBtn.setAttribute('aria-expanded', 'false');
                popupReadMoreBtn.textContent = 'En savoir plus';
            }

            popupGallery.innerHTML = renderCatalogCards(data.images);
            popupGallery.scrollLeft = 0;

            catalogDialog.showModal();
            popupCloseBtn?.focus({ preventScroll: true });
        };

        catalogTriggers.forEach(trigger => {
            if (!(trigger instanceof HTMLButtonElement)) return;
            trigger.addEventListener('click', () => {
                catalogTrigger = trigger;
                const serviceTitle = trigger.dataset.catalogTitle || trigger.closest('.prestation-card')?.querySelector('h3')?.textContent?.trim() || '';
                openCatalogForService(serviceTitle);
            });
        });

        popupCloseBtn?.addEventListener('click', closeCatalog);
        catalogDialog.addEventListener('click', event => {
            if (event.target === catalogDialog) closeCatalog();
        });
        catalogDialog.addEventListener('keydown', event => {
            if (event.key === 'Escape' && catalogDialog.open) {
                event.preventDefault();
                closeCatalog();
            }
        });

        // Toggle Read More / En savoir plus
        popupReadMoreBtn?.addEventListener('click', () => {
            if (!popupExtendedWrap) return;
            const isExpanded = popupReadMoreBtn.getAttribute('aria-expanded') === 'true';
            popupReadMoreBtn.setAttribute('aria-expanded', String(!isExpanded));
            popupExtendedWrap.hidden = isExpanded;
            popupReadMoreBtn.textContent = isExpanded ? 'En savoir plus' : 'Réduire';
        });

        // Clic sur bouton action héro ou éditorial => Fermer le catalogue et ouvrir le formulaire de contact
        popupGallery.addEventListener('click', event => {
            const btn = event.target.closest('[data-action="contact"]');
            if (!btn) return;
            closeCatalog();
            const contactAnchor = document.createElement('a');
            contactAnchor.href = '#contact-dialog';
            contactAnchor.className = 'sr-only';
            document.body.appendChild(contactAnchor);
            contactAnchor.click();
            contactAnchor.remove();
        });

        // Bouton Demande de projet dans le footer
        popupRequestBtn?.addEventListener('click', () => {
            closeCatalog();
        });

        // Défilement horizontal fluide avec la molette de souris
        popupGallery.addEventListener('wheel', event => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.preventDefault();
                popupGallery.scrollLeft += event.deltaY * 1.35;
            }
        }, { passive: false });

        // Glissement à la souris (Drag to scroll)
        let dragStartX = null;
        let dragStartScrollLeft = 0;
        let dragPointerId = null;

        popupGallery.addEventListener('pointerdown', event => {
            if (event.pointerType !== 'mouse' || event.button !== 0) return;
            dragStartX = event.clientX;
            dragStartScrollLeft = popupGallery.scrollLeft;
            dragPointerId = event.pointerId;
            popupGallery.classList.add('is-dragging');
            popupGallery.setPointerCapture(event.pointerId);
        });

        popupGallery.addEventListener('pointermove', event => {
            if (event.pointerId !== dragPointerId || dragStartX === null) return;
            const distance = event.clientX - dragStartX;
            if (Math.abs(distance) > 3) event.preventDefault();
            popupGallery.scrollLeft = dragStartScrollLeft - distance;
        });

        const cancelCatalogDrag = event => {
            if (event && event.pointerId !== dragPointerId) return;
            dragStartX = null;
            dragPointerId = null;
            popupGallery.classList.remove('is-dragging');
        };

        popupGallery.addEventListener('pointerup', cancelCatalogDrag);
        popupGallery.addEventListener('pointercancel', cancelCatalogDrag);
        popupGallery.addEventListener('lostpointercapture', cancelCatalogDrag);
    }

    const contactDialog = document.querySelector('#contact-dialog');
    const contactForm = contactDialog?.querySelector('.contact-dialog-form');
    const contactCloseButton = contactDialog?.querySelector('.contact-dialog-close');
    const contactSubmitButton = contactDialog?.querySelector('.contact-dialog-submit');
    const contactSubmitIcon = contactSubmitButton?.querySelector('.contact-submit-icon');
    const contactSubmitLabel = contactSubmitButton?.querySelector('.contact-submit-label');
    const contactStatus = contactDialog?.querySelector('.contact-dialog-status');
    const projectContactForm = document.querySelector('.project-contact-form');
    const projectContactStatus = projectContactForm?.querySelector('[role="status"]');

    if (
        !(contactDialog instanceof HTMLDialogElement) ||
        !(contactForm instanceof HTMLFormElement) ||
        !(contactCloseButton instanceof HTMLButtonElement) ||
        !(contactSubmitButton instanceof HTMLButtonElement) ||
        !(contactSubmitIcon instanceof HTMLElement) ||
        !(contactSubmitLabel instanceof HTMLElement) ||
        !(contactStatus instanceof HTMLElement)
    ) {
        console.error('Impossible de configurer le formulaire de contact.');
    } else {
        const contactSteps = Array.from(contactForm.querySelectorAll('.contact-dialog-step'));
        const contactStepProgress = contactDialog.querySelector('.contact-step-progress');
        const contactStepProgressLabel = contactDialog.querySelector('.contact-step-progress-label');
        const contactStepProgressFill = contactDialog.querySelector('.contact-step-progress-track > span');
        const contactStepTitles = ['Vos coordonnées', 'Votre événement', 'Votre préférence de contact'];
        let showContactStep;
        if (
            contactSteps.length !== contactStepTitles.length ||
            !(contactStepProgress instanceof HTMLElement) ||
            !(contactStepProgressLabel instanceof HTMLElement) ||
            !(contactStepProgressFill instanceof HTMLElement)
        ) {
            console.error('Impossible de configurer les étapes du formulaire de contact.');
        } else {
            showContactStep = (stepIndex, focusHeading = true) => {
                contactSteps.forEach((step, index) => {
                    const isActive = index === stepIndex;
                    step.hidden = !isActive;
                    step.inert = !isActive;
                    step.classList.toggle('is-active', isActive);
                });
                contactStepProgress.setAttribute('aria-valuenow', String(stepIndex + 1));
                contactStepProgressLabel.textContent =
                    `Étape ${stepIndex + 1} sur ${contactSteps.length} — ${contactStepTitles[stepIndex]}`;
                contactStepProgressFill.style.width =
                    `${((stepIndex + 1) / contactSteps.length) * 100}%`;
                contactDialog.scrollTop = 0;
                if (focusHeading) {
                    contactSteps[stepIndex].querySelector('h3')?.focus({ preventScroll: true });
                }
            };

            contactSteps.forEach((step, index) => {
                step.querySelector('.contact-step-next')?.addEventListener('click', () => {
                    const invalidField = Array.from(step.querySelectorAll('input, select, textarea'))
                        .find(field => !field.checkValidity());
                    if (invalidField instanceof HTMLInputElement ||
                        invalidField instanceof HTMLSelectElement ||
                        invalidField instanceof HTMLTextAreaElement) {
                        invalidField.reportValidity();
                        invalidField.focus({ preventScroll: true });
                        return;
                    }
                    showContactStep(Math.min(index + 1, contactSteps.length - 1));
                });

                step.querySelector('.contact-step-back')?.addEventListener('click', () => {
                    showContactStep(Math.max(index - 1, 0));
                });
            });
        }

        let contactTrigger = null;
        const openContactDialog = trigger => {
            contactTrigger = trigger;
            if (!contactDialog.open) {
                if (showContactStep) {
                    showContactStep(0, false);
                }
                lenisInstance?.stop();
                document.body.classList.add('contact-dialog-is-open');
                contactDialog.showModal();
            }
        };

        document.addEventListener('click', event => {
            if (!(event.target instanceof Element)) return;
            const trigger = event.target.closest(
                'a[href="index.html#footer-name"], a[href="#project-contact-title"], a[href="#contact-dialog"]'
            );
            if (!(trigger instanceof HTMLAnchorElement)) return;
            event.preventDefault();
            openContactDialog(trigger);
        });

        const closeContactDialog = () => {
            if (contactDialog.open) contactDialog.close();
        };

        contactCloseButton.addEventListener('click', closeContactDialog);
        contactDialog.addEventListener('click', event => {
            if (event.target === contactDialog) closeContactDialog();
        });
        contactDialog.addEventListener('close', () => {
            document.body.classList.remove('contact-dialog-is-open');
            lenisInstance?.start();
            if (contactTrigger instanceof HTMLElement && !contactTrigger.closest('dialog:not([open])')) {
                contactTrigger.focus({ preventScroll: true });
            }
        });

        const updateContactSubmitLabel = () => {
            const channel = contactForm.querySelector('input[name="channel"]:checked');
            const useEmail = channel?.value === 'email';
            contactSubmitIcon.textContent = useEmail ? '✉' : '↗';
            contactSubmitLabel.textContent = useEmail
                ? 'Envoyer ma demande par e-mail'
                : 'Envoyer ma demande via WhatsApp';
        };
        contactForm.querySelectorAll('input[name="channel"]').forEach(option => {
            option.addEventListener('change', updateContactSubmitLabel);
        });

        const sendContactRequest = async (data, button, status) => {
            button.disabled = true;
            status.textContent = 'Envoi de votre demande en cours…';
            status.dataset.state = 'pending';
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!response.headers.get('content-type')?.toLowerCase().includes('application/json')) {
                    throw new Error('Le serveur d’envoi n’est pas disponible. Lancez demarrer.bat et réessayez.');
                }
                let result;
                try {
                    result = await response.json();
                } catch {
                    throw new Error('Le serveur d’envoi a renvoyé une réponse illisible. Réessayez.');
                }
                if (!response.ok) {
                    throw new Error(typeof result.error === 'string'
                        ? result.error
                        : 'L’envoi a échoué. Réessayez ou contactez-nous directement.');
                }
                status.textContent = result.message;
                status.dataset.state = 'success';
            } catch (error) {
                status.textContent = error instanceof Error
                    ? error.message
                    : 'L’envoi a échoué. Réessayez ou contactez-nous directement.';
                status.dataset.state = 'error';
            } finally {
                button.disabled = false;
            }
        };

        contactForm.addEventListener('submit', event => {
            event.preventDefault();
            const invalidField = Array.from(contactForm.querySelectorAll('input, select, textarea'))
                .find(field => !field.checkValidity());
            if (invalidField instanceof HTMLInputElement ||
                invalidField instanceof HTMLSelectElement ||
                invalidField instanceof HTMLTextAreaElement) {
                const invalidStep = invalidField.closest('.contact-dialog-step');
                const invalidStepIndex = contactSteps.indexOf(invalidStep);
                if (invalidStepIndex >= 0 && showContactStep) {
                    showContactStep(invalidStepIndex, false);
                }
                invalidField.reportValidity();
                invalidField.focus({ preventScroll: true });
                return;
            }

            const formData = new FormData(contactForm);
            const value = name => String(formData.get(name) ?? '').trim();
            const fields = [
                ['Nom & prénom', value('name')],
                ['Téléphone / WhatsApp', value('phone')],
                ['Adresse e-mail', value('email')],
                ['Événement / services', value('event')],
                ['Date estimée', value('date')],
                ['Lieu', value('location')],
                ['Budget estimé', value('budget')],
                ['Message', value('message')]
            ].filter(([, content]) => content);
            const message = fields.map(([label, content]) => `${label} : ${content}`).join('\n');

            if (value('channel') === 'email') {
                sendContactRequest({
                    name: value('name'),
                    email: value('email'),
                    phone: value('phone'),
                    event: value('event'),
                    date: value('date'),
                    location: value('location'),
                    budget: value('budget'),
                    message: value('message')
                }, contactSubmitButton, contactStatus);
                return;
            }

            const whatsappMessage = encodeURIComponent(`Bonjour Coco Miracles, je souhaite échanger au sujet de mon projet :\n\n${message}`);
            window.open(`https://wa.me/22890499996?text=${whatsappMessage}`, '_blank', 'noopener,noreferrer');
            contactStatus.textContent = 'Votre demande est prête dans WhatsApp. Vérifiez les informations puis envoyez le message.';
        });

        if (projectContactForm instanceof HTMLFormElement && projectContactStatus instanceof HTMLElement) {
            projectContactForm.addEventListener('submit', event => {
                event.preventDefault();
                const formData = new FormData(projectContactForm);
                const data = Object.fromEntries(
                    ['name', 'email', 'phone', 'message']
                        .map(name => [name, String(formData.get(name) ?? '').trim()])
                );
                const button = projectContactForm.querySelector('button[type="submit"]');
                if (button instanceof HTMLButtonElement) {
                    sendContactRequest(data, button, projectContactStatus);
                }
            });
        }
    }

    const brand = document.querySelector('.hero-brand');
    const brandName = brand?.querySelector('.hero-brand-name');
    const logo = brand?.querySelector('.hero-logo');

    if (!(brand instanceof HTMLAnchorElement) || !(brandName instanceof HTMLSpanElement) || !(logo instanceof HTMLImageElement)) {
        console.error('Impossible de lancer l’animation du logo : éléments du header introuvables.');
        return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const characters = Array.from(brandName.textContent ?? '');
    brandName.replaceChildren(...characters.map((character, index) => {
        const letter = document.createElement('span');
        letter.className = 'brand-letter';
        letter.textContent = character === ' ' ? '\u00a0' : character;
        letter.style.setProperty('--letter-in-index', String(index));
        letter.style.setProperty('--letter-out-index', String(characters.length - index));
        return letter;
    }));

    let phaseTimer;

    const startCycle = () => {
        if (document.hidden) return;

        brand.classList.add('is-animating');
        brand.classList.remove('is-text-visible', 'is-text-hiding', 'is-logo-visible');
        window.requestAnimationFrame(() => {
            if (document.hidden) return;
            brand.classList.add('is-text-visible');

            phaseTimer = window.setTimeout(() => {
                brand.classList.remove('is-text-visible');
                brand.classList.add('is-text-hiding');

                phaseTimer = window.setTimeout(() => {
                    brand.classList.remove('is-text-hiding');
                    brand.classList.add('is-logo-visible');

                    phaseTimer = window.setTimeout(() => {
                        brand.classList.remove('is-logo-visible');
                        phaseTimer = window.setTimeout(startCycle, 500);
                    }, 1800);
                }, 600);
            }, 1600);
        });
    };

    document.addEventListener('visibilitychange', () => {
        window.clearTimeout(phaseTimer);
        brand.classList.remove('is-text-visible', 'is-text-hiding', 'is-logo-visible', 'is-animating');
        if (!document.hidden) startCycle();
    });

    startHeroBrandCycle = startCycle;
    if (initialPreloaderFinished) startCycle();
});
