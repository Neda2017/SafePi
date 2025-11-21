import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "safepi-admin.firebaseapp.com",
  projectId: "safepi-admin",
  storageBucket: "safepi-admin.appspot.com",
  messagingSenderId: "xxxxxx",
  appId: "xxxxxx",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
