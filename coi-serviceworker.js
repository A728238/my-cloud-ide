/*! coi-serviceworker v0.1.7 | MIT License | https://github.com */
if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", (e) => {
        // 同一オリジン（自分のGitHub Pages）の通信のみヘッダーを書き換える安全設計
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;
        e.respondWith(
            fetch(e.request)
                .then((response) => {
                    if (response.status === 0) return response;
                    const newHeaders = new Headers(response.headers);
                    // WebContainerの起動に必要な強力な鍵をブラウザにセット
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
    // ブラウザ側でのService Worker自動登録システム
    (() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register(window.location.pathname + "coi-serviceworker.js")
                .then((registration) => {
                    // スクリプトが更新されたら自動で画面をリロードして有効化する
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
