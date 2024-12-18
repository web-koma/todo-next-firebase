import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebaseプロジェクトの設定情報
const firebaseConfig = {
    apiKey: "AIzaSyDXUDiQpLXYpKQWO0_Up9lEp02p_EPHJQQ",
    authDomain: "koma-react.firebaseapp.com",
    projectId: "koma-react",
    storageBucket: "koma-react.firebasestorage.app",
    messagingSenderId: "1037451311745",
    appId: "1:1037451311745:web:c1d7fee1d1a939a2eb2b80"
  };

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firestoreインスタンスをエクスポート
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();