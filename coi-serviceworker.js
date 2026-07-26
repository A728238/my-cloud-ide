// coi-serviceworker.js の中身をこれだけにしてください
self.addEventListener('activate', e => {
    self.registration.unregister().then(() => self.clients.claim());
});
