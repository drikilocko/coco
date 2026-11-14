const CACHE_NAME = 'coco-miracles-site-v9';
const CORE_ASSETS = [
    './index.html',
    './css/style.css?v=mobile-ux-pagination-v9',
    './css/galleries.css?v=overscroll-fix-v2',
    './css/footer.css?v=footer-v1',
    './css/site-header.css?v=shared-header-v1',
    './js/site-header.js?v=shared-header-v1',
    './js/footer.js?v=footer-v1',
    './js/portfolio-videos.js?v=local-video-gallery-v3',
    './js/portfolio-gallery.js?v=local-video-gallery-v4',
    './js/beauty-videos.js?v=beauty-gallery-v2',
    './js/main.js?v=mobile-ux-pagination-v6',
    './js/chatbot.js?v=chat-shared-transition-v2',
    './js/text-roll.js?v=text-roll-v5',
    './js/nav-transition.js?v=nav-transition-v3',
    './js/rose-snow.js',
    './asset/bg/new.webp',
    './gg.webp',
    './asset/logo/logo-coco.webp'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key.startsWith('coco-miracles-site-') && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const requestUrl = new URL(request.url);

    if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(request, response.clone());
                }
                return response;
            } catch (error) {
                const cachedPage = await caches.match(request) || await caches.match('./index.html');
                if (cachedPage) return cachedPage;
                console.error('Aucune page en cache n’est disponible hors connexion.', error);
                return new Response(
                    '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Hors connexion</title><body><main><h1>Connexion indisponible</h1><p>Vérifiez votre connexion, puis actualisez la page.</p></main></body></html>',
                    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                );
            }
        })());
        return;
    }

    if (!['image', 'style', 'script', 'font'].includes(request.destination)) return;

    event.respondWith((async () => {
        const cachedAsset = await caches.match(request);
        if (cachedAsset) return cachedAsset;

        const response = await fetch(request);
        if (response.ok && response.type === 'basic') {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
        }
        return response;
    })());
});
