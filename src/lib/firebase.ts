import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBykgm6tjrs933oDtc3uyQ_I8AXImejy7g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "test-e815b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "test-e815b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "test-e815b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "792092800839",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:792092800839:web:1718f4b7f27a946188be62",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9VM3FNYZVE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
