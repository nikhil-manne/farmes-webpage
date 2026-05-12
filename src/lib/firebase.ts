import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApw92ildm8x9iNsyvNfVHhu-FZ_eO2OHc",
  authDomain: "farmes-5fbcd.firebaseapp.com",
  projectId: "farmes-5fbcd",
  storageBucket: "farmes-5fbcd.firebasestorage.app",
  messagingSenderId: "869213694661",
  appId: "1:869213694661:web:e4cb3d5b1ce6a6a8c51eac",
  measurementId: "G-8M50WTTGJK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
