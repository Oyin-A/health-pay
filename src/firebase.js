// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDPxE6DAr41NxHxwtKx23nx4nHTcu4B3jA",
  authDomain: "health-pay-f2292.firebaseapp.com",
  projectId: "health-pay-f2292",
  storageBucket: "health-pay-f2292.appspot.com",
  messagingSenderId: "136953406340",
  appId: "1:136953406340:web:0a32fcb2cce072a9d733d1",
  measurementId: "G-C0CQCX7KPZ"
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
