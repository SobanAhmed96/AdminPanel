// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBJksNm2HyXF-DjiGI0Ej2sydkXlj4G2s",
  authDomain: "maazportfolio-6188d.firebaseapp.com",
  projectId: "maazportfolio-6188d",
  storageBucket: "maazportfolio-6188d.firebasestorage.app",
  messagingSenderId: "580750681904",
  appId: "1:580750681904:web:f0a41c8c79e1d3ae47caf5"
};

// Firebase initialize karein
const app = initializeApp(firebaseConfig);

// Firestore aur Auth export karein
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
