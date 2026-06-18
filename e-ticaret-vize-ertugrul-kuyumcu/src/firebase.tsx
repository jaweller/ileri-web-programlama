import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
// Firebase yapılandırma bilgilerinizi buraya ekleyin public olarak paylaşılmaması gereken bilgiler
const firebaseConfig = {

};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();