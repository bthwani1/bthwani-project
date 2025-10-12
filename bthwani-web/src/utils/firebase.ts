import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDcj9GF6Jsi7aIWHoOmH9OKwdOs2pRswS0",
  authDomain: "bthwani-app.firebaseapp.com",
  projectId: "bthwani-app",
  storageBucket: "bthwani-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export async function getMessagingIfSupported(): Promise<Messaging | null> {
  try {
    const supported = await isSupported();
    if (!supported) return null;
    return getMessaging(app);
  } catch {
    return null;
  }
}

export async function requestFcmToken(): Promise<string | null> {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return null;
  if (Notification.permission === 'default') {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return null;
  }
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
  try {
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.getRegistration() ?? undefined });
    return token ?? null;
  } catch (err) {
    console.error('FCM getToken error', err);
    return null;
  }
}

export function listenForegroundMessages(cb: (payload: { data?: Record<string, string>; notification?: { title?: string; body?: string } }) => void) {
  getMessagingIfSupported().then((messaging) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => cb(payload));
  });
}
export default app;
