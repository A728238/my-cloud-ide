/*! coi-serviceworker v0.1.7 | MIT License | https://github.com */
if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", (e) => {
        // 【超重要】外部サイトへの不要なフェッチをすべて遮断し、自分のオリジン（GitHub Pages）内だけを処理
        if (!e.request.url.startsWith(self.location.origin)) {
            return; // 外部ドメイン（unpkgなど）の通信なら、Service Workerは一切手を出さずにスルーする
        }
        
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;
        e.respondWith(
            fetch(e.request)
                .then((response) => {
                    if (response.status === 0) return response;
                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    });
} else {
    (() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register(window.location.pathname + "coi-serviceworker.js")
                .then((registration) => {
                    registration.addEventListener("updatefound", () => {
                        window.location.reload();
                    });
                    if (registration.active && !navigator.serviceWorker.controller) {
                        window.location.reload();
                    }
                });
        }
    })();
}
