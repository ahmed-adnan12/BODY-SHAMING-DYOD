import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2vq066vB87AE3-8oEBtKBljFR9sZq-xM",
  authDomain: "body-shame.firebaseapp.com",
  projectId: "body-shame",
  storageBucket: "body-shame.firebasestorage.app",
  messagingSenderId: "495440863660",
  appId: "1:495440863660:web:32e057910ea2b557fc9a09",
  measurementId: "G-9WVSPRE56B",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);