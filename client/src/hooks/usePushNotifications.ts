import { useEffect, useState, useCallback } from 'react';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: Record<string, unknown>;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // Verificar suporte a notificações
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      registerServiceWorker();
      checkSubscription();
    }
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('[Push Notifications] Service Worker registrado:', registration);
      }
    } catch (error) {
      console.error('[Push Notifications] Erro ao registrar Service Worker:', error);
    }
  };

  // Verificar se já está inscrito
  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setIsSubscribed(!!sub);
    } catch (error) {
      console.error('[Push Notifications] Erro ao verificar subscrição:', error);
    }
  };

  // Inscrever em notificações push
  const subscribe = useCallback(async () => {
    try {
      // Solicitar permissão
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[Push Notifications] Permissão negada');
        return false;
      }

      // Obter Service Worker registration
      const registration = await navigator.serviceWorker.ready;

      // Inscrever em push (usando VAPID key se disponível)
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
      });

      setSubscription(sub);
      setIsSubscribed(true);

      // Enviar subscrição para o servidor
      await sendSubscriptionToServer(sub);

      console.log('[Push Notifications] Inscrito com sucesso');
      return true;
    } catch (error) {
      console.error('[Push Notifications] Erro ao inscrever:', error);
      return false;
    }
  }, []);

  // Desinscrever de notificações push
  const unsubscribe = useCallback(async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);

        // Notificar servidor
        await removeSubscriptionFromServer(subscription);

        console.log('[Push Notifications] Desinscrito com sucesso');
        return true;
      }
    } catch (error) {
      console.error('[Push Notifications] Erro ao desinscrever:', error);
      return false;
    }
  }, [subscription]);

  // Enviar subscrição para o servidor
  const sendSubscriptionToServer = async (sub: PushSubscription) => {
    try {
      const response = await fetch('/api/trpc/notifications.subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: sub.toJSON(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar subscrição para o servidor');
      }

      console.log('[Push Notifications] Subscrição enviada para o servidor');
    } catch (error) {
      console.error('[Push Notifications] Erro ao enviar subscrição:', error);
    }
  };

  // Remover subscrição do servidor
  const removeSubscriptionFromServer = async (sub: PushSubscription) => {
    try {
      const response = await fetch('/api/trpc/notifications.unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: sub.toJSON(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao remover subscrição do servidor');
      }

      console.log('[Push Notifications] Subscrição removida do servidor');
    } catch (error) {
      console.error('[Push Notifications] Erro ao remover subscrição:', error);
    }
  };

  // Enviar notificação local (para teste)
  const sendLocalNotification = useCallback((options: PushNotificationOptions) => {
    if (!isSupported) {
      console.warn('[Push Notifications] Notificações não suportadas');
      return;
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/icon-192x192.png',
      badge: options.badge || '/badge-72x72.png',
      tag: options.tag || 'gamer-system',
      requireInteraction: options.requireInteraction || false,
      data: options.data || {},
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }, [isSupported]);

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe,
    sendLocalNotification,
  };
}
