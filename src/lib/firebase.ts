import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBykgm6tjrs933oDtc3uyQ_I8AXImejy7g",
  authDomain: "test-e815b.firebaseapp.com",
  projectId: "test-e815b",
  storageBucket: "test-e815b.firebasestorage.app",
  messagingSenderId: "792092800839",
  appId: "1:792092800839:web:1718f4b7f27a946188be62",
  measurementId: "G-9VM3FNYZVE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
