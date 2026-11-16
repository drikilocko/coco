const CACHE_NAME = 'coco-miracles-site-v83';
const NAVIGATION_TIMEOUT_MS = 4000;
const CORE_ASSETS = [
    './index.html',
    './galerie-portfolio.html',
    './galerie-beaute.html',
    './event-planner.html',
    './css/style.css?v=hero-bg-v1',
    './css/galleries.css?v=wallpaper-v1',
    './css/footer.css?v=ambroise-v2',
    './css/site-header.css?v=consult-v3',
    './js/network.js?v=network-v1',
    './js/site-header.js?v=consult-v1',
    './js/footer.js?v=footer-v1',
    './js/portfolio-videos.js?v=local-video-gallery-v3',
    './js/portfolio-gallery.js?v=play-now-v1',
    './js/beauty-videos.js?v=beauty-gallery-v2',
    './js/main.js?v=hosts-videos-v1',
    './js/detail-content.js?v=detail-content-v3',
    './js/detail-sheet.js?v=detail-sheet-v1',
    './js/page-reveal.js?v=page-reveal-v2',
    './js/chatbot.js?v=chat-all-pages-v1',
    './css/chat.css?v=chat-v1',
    './js/text-roll.js?v=text-roll-v5',
    './js/nav-transition.js?v=nav-transition-v3',
    './js/rose-snow.js?v=lazy-network-v1',
    './asset/bg/new-optimized.webp',
    './gg.webp',
    './asset/bg/reception-lustres.jpg',
    './asset/logo/logo-coco.webp',
    './asset/fonts/ambroise-regular.otf'
];

const OFFLINE_PAGE = '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hors connexion — Coco Miracles</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#211c18;color:#f5f0e8;font-family:Georgia,serif;text-align:center;padding:24px}button{margin-top:18px;padding:12px 22px;border:1px solid #f5f0e8;border-radius:999px;background:none;color:inherit;font:inherit;cursor:pointer}</style><body><main><h1>Connexion indisponible</h1><p>Vérifiez votre connexion, puis réessayez.</p><button onclick="location.reload()">Réessayer</button></main></body></html>';

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        // Un fichier manquant ne doit pas bloquer l’installation du cache hors connexion.
        await Promise.all(CORE_ASSETS.map(url =>
            cache.add(url).catch(error => console.warn(`Mise en cache impossible : ${url}`, error))
        ));
        await self.skipWaiting();
    })());
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

const putInCache = async (request, response) => {
    if (!response || !response.ok || response.type !== 'basic') return;
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
};

self.addEventListener('fetch', event => {
    const request = event.request;
    const requestUrl = new URL(request.url);

    if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;
    if (requestUrl.pathname.startsWith('/api/')) return;

    if (request.mode === 'navigate') {
        // Réseau d’abord, mais si la connexion est trop lente on sert la version en cache
        // immédiatement, puis le cache est mis à jour en arrière-plan.
        event.respondWith((async () => {
            const networkFetch = fetch(request).then(response => {
                event.waitUntil(putInCache(request, response.clone()));
                return response;
            });
            networkFetch.catch(() => {});
            const cachedPage = await caches.match(request, { ignoreSearch: true });

            if (cachedPage) {
                const timeout = new Promise(resolve => setTimeout(() => resolve(cachedPage), NAVIGATION_TIMEOUT_MS));
                try {
                    return await Promise.race([networkFetch, timeout]);
                } catch (error) {
                    return cachedPage;
                }
            }

            try {
                return await networkFetch;
            } catch (error) {
                const fallback = await caches.match('./index.html');
                if (fallback) return fallback;
                console.error('Aucune page en cache n’est disponible hors connexion.', error);
                return new Response(OFFLINE_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
            }
        })());
        return;
    }

    // Les vidéos et l’audio utilisent des requêtes partielles : on laisse le navigateur gérer.
    if (!['image', 'style', 'script', 'font'].includes(request.destination)) return;

    event.respondWith((async () => {
        const cachedAsset = await caches.match(request);
        if (cachedAsset) return cachedAsset;

        try {
            const response = await fetch(request);
            event.waitUntil(putInCache(request, response.clone()));
            return response;
        } catch (error) {
            if (request.destination === 'image') {
                // Image transparente : la mise en page reste intacte même hors connexion.
                return new Response(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
                    { headers: { 'Content-Type': 'image/svg+xml' } }
                );
            }
            throw error;
        }
    })());
});
