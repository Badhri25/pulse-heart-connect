import { useEffect, useState } from "react";
import { auth, messaging, rtdb } from "@/integrations/firebase";

export function usePush(pairId: string | null) {
  const [supported, setSupported] = useState<boolean>(!!messaging);
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  const [token, setToken] = useState<string | null>(null);
  const vapidKey = (import.meta as any).env?.VITE_FCM_VAPID_KEY as string | undefined;

  useEffect(() => {
    setSupported(!!messaging);
    setPermission(Notification.permission);
    // Foreground handler: vibrate/show notice when app is open
    if (messaging) {
      try {
        messaging.onMessage(async (payload: any) => {
          const quiet = localStorage.getItem('quietHours') === 'on';
          const haptics = localStorage.getItem('haptics') || 'strong';
          const hour = new Date().getHours();
          const inQuiet = quiet && (hour >= 22 || hour < 7);
          if (!inQuiet && haptics !== 'off' && navigator.vibrate) {
            const pattern = haptics === 'soft' ? [30, 40, 30] : [60, 80, 60];
            try { navigator.vibrate(pattern); } catch {}
          }
          if (Notification.permission === 'granted') {
            try {
              const title = (payload?.notification && (payload.notification.title || 'Pulse received')) || 'Pulse received';
              const body = (payload?.notification && payload.notification.body) || 'Tap to open';
              new Notification(title, { body });
            } catch {}
          }
        });
      } catch {}
    }
  }, []);

  const enable = async () => {
    if (!pairId || !messaging || !vapidKey) return { ok: false, reason: "missing" as const };
    try {
      if (!auth.currentUser) await auth.signInAnonymously();
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      if (permissionResult !== "granted") return { ok: false, reason: "denied" as const };
      // Ensure messaging service worker is present
      const reg = (await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js'))
        || (await navigator.serviceWorker.register('/firebase-messaging-sw.js'));
      const tok = await messaging.getToken({ vapidKey, serviceWorkerRegistration: reg as any });
      setToken(tok);
      const uid = auth.currentUser?.uid || "anon";
      await rtdb.ref(`/pairs/${pairId}/tokens/${uid}`).set({ token: tok, ts: Date.now() });
      return { ok: true } as const;
    } catch (e) {
      return { ok: false, reason: "error" as const };
    }
  };

  return { supported, permission, token, enable, vapidConfigured: !!vapidKey };
}
