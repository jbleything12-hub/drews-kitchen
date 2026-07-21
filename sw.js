// Drew's Kitchen — service worker
// Handles incoming push messages and notification taps.
// This file must be served from the site root (same folder as index.html).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: "Drew's Kitchen", body: 'Something changed.' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    // fall back to defaults above if payload isn't JSON
  }

  const options = {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: 'drews-kitchen-status', // reuses one notification slot instead of stacking
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
