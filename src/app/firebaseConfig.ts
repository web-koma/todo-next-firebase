import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDXUDiQpLXYpKQWO0_Up9lEp02p_EPHJQQ",
    authDomain: "koma-react.firebaseapp.com",
    projectId: "koma-react",
    storageBucket: "koma-react.firebasestorage.app",
    messagingSenderId: "1037451311745",
    appId: "1:1037451311745:web:c1d7fee1d1a939a2eb2b80"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);