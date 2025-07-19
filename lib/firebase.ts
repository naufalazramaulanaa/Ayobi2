// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX3GiAChzCyYiXVl-v_BLp41FEJfFL6nQ",
  authDomain: "ayobilms.firebaseapp.com",
  projectId: "ayobilms",
  storageBucket: "ayobilms.firebasestorage.app",
  messagingSenderId: "229649323347",
  appId: "1:229649323347:web:727cdffa32bb82805e3da6",
  measurementId: "G-KDQ83GC0FL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);    
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider } // ✅ inilah yang dipakai di login-form