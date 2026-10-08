// Service Worker：把詩歌資料與網頁存在裝置上，第二次開啟幾乎瞬間載入，也可離線使用
const CACHE_NAME = 'hymnssearch-v1';
const PRECACHE_URLS = ['./', 'index.html', 'hymns.json'];
const TAILWIND_ORIGIN = 'https://cdn.tailwindcss.com';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    // 清除舊版快取
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    if (url.origin === self.location.origin && url.pathname.endsWith('/hymns.json')) {
        event.respondWith(staleWhileRevalidate(event, request));
    } else if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
    } else if (url.origin === self.location.origin || url.origin === TAILWIND_ORIGIN) {
        event.respondWith(networkFirst(request));
    }
    // 其他外部請求 (Google 字型、表單、計數器) 交給瀏覽器處理
});

// 詩歌資料：先回傳裝置上的版本，同時在背景更新；有新資料時通知頁面重新載入資料
async function staleWhileRevalidate(event, request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });

    const update = fetch(request, { cache: 'no-cache' }).then(async (response) => {
        if (!response.ok) return response;
        const changed = cached && versionOf(cached) !== versionOf(response);
        await cache.put(request, response.clone());
        if (changed) notifyClients({ type: 'hymns-updated' });
        return response;
    });

    if (cached) {
        event.waitUntil(update.catch(() => { }));
        return cached;
    }
    return update;
}

// 網頁與程式：優先抓最新版，沒有網路或伺服器出錯時才用裝置上的版本
async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const fromCache = () => cache.match(request, { ignoreSearch: request.mode === 'navigate' });
    try {
        const response = await fetch(request);
        if (response.ok || response.type === 'opaque') {
            await cache.put(request, response.clone());
            return response;
        }
        return (await fromCache()) || response;
    } catch (error) {
        const cached = await fromCache();
        if (cached) return cached;
        throw error;
    }
}

function versionOf(response) {
    return response.headers.get('ETag') || response.headers.get('Last-Modified') || '';
}

async function notifyClients(message) {
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.postMessage(message));
}
