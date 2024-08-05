// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCpf3W60ejH2D5BHj1cosKSkcZnDvA-gqo",
  authDomain: "health-test-bab2f.firebaseapp.com",
  projectId: "health-test-bab2f",
  storageBucket: "health-test-bab2f.appspot.com",
  messagingSenderId: "855238988950",
  appId: "1:855238988950:web:cbfcdf3a372c71778f1eb7",
  measurementId: "G-BCF8DED0KV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(firestore).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log("Persistence failed: Multiple tabs open");
  } else if (err.code === 'unimplemented') {
    console.log("Persistence is not available in this browser");
  }
});

export { auth, googleProvider, firestore, storage };
