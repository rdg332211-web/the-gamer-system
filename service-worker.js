// Service Worker para The Gamer System - Notificações Push

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(clients.claim());
});

// Listener para notificações push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recebido:', event);

  if (!event.data) {
    console.log('[Service Worker] Sem dados no push');
    return;
  }

  let notificationData;
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: 'The Gamer System',
      body: event.data.text(),
    };
  }

  const {
    title = '⚔️ The Gamer System',
    body = 'Você tem uma nova notificação!',
    icon = '/icon-192x192.png',
    badge = '/badge-72x72.png',
    tag = 'gamer-system-notification',
    requireInteraction = false,
    data = {},
  } = notificationData;

  const options = {
    body,
    icon,
    badge,
    tag,
    requireInteraction,
    data,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
      },
      {
        action: 'close',
        title: 'Fechar',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listener para cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notificação clicada:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Abrir ou focar a janela do app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Procurar por uma janela já aberta
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não houver janela aberta, abrir uma nova
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Listener para fechar notificações
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notificação fechada:', event);
});
