/* global importScripts, firebase */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCGbhM3MKa0SnySYt9xX6Gu8Yaq6ZOCTYQ",
  authDomain: "pulsepod-b80b5.firebaseapp.com",
  projectId: "pulsepod-b80b5",
  storageBucket: "pulsepod-b80b5.firebasestorage.app",
  messagingSenderId: "1040990884992",
  appId: "1:1040990884992:web:54fd9ce0223b797f57c265",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Pulse received';
  const body = payload.notification?.body || 'Tap to open and feel the pulse';
  const color = payload.data?.color || '#FF5C8D';
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [60, 80, 60],
    data: payload.data || {},
    actions: [],
  });
});
