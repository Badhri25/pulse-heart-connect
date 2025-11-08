import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/messaging";

// Public client-side config provided by you
const firebaseConfig = {
  apiKey: "AIzaSyCGbhM3MKa0SnySYt9xX6Gu8Yaq6ZOCTYQ",
  authDomain: "pulsepod-b80b5.firebaseapp.com",
  projectId: "pulsepod-b80b5",
  storageBucket: "pulsepod-b80b5.firebasestorage.app",
  messagingSenderId: "1040990884992",
  appId: "1:1040990884992:web:54fd9ce0223b797f57c265",
  measurementId: "G-L7B58B2WK0",
  databaseURL: "https://pulsepod-b80b5-default-rtdb.firebaseio.com",
};

const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);

export const rtdb = firebase.database(app);

// Auth: Anonymous sign-in for secured rules
export const auth = firebase.auth(app);
try {
  // If not signed in, sign in anonymously
  auth.onAuthStateChanged((user) => {
    if (!user) auth.signInAnonymously().catch(() => {});
  });
} catch {}

// Messaging (FCM)
export const messaging = firebase.messaging.isSupported() ? firebase.messaging(app) : null;
