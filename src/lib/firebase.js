import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "bbd-social-wallet.firebaseapp.com",
  projectId: "bbd-social-wallet",
  storageBucket: "bbd-social-wallet.appspot.com",
  messagingSenderId: "559401178581",
  appId: "1:559401178581:web:4f24a2d3c0c7c81cf5195c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    console.log("User logged in", user)
    //console.log("User", user)
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

const logout = () => {
  signOut(auth);
}

//window.logout10 = logout;

export {
  auth,
  signInWithGoogle,
  logout
};