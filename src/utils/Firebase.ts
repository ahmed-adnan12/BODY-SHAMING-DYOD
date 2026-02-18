import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxiRQXk-q-YAjmqYab3KWVdwwzAHNWxxg",
  authDomain: "dyod-campaign.firebaseapp.com",
  projectId: "dyod-campaign",
  storageBucket: "dyod-campaign.firebasestorage.app",
  messagingSenderId: "906572688052",
  appId: "1:906572688052:web:63ed498f06eb136ce505e1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);