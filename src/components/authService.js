import { auth, googleProvider, firestore } from '../firebase';
import { signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('Google Sign-In User:', user);

    const userDoc = doc(firestore, 'users', user.uid);
    await setDoc(userDoc, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      paymentMethods: []
    }, { merge: true });
    return user;
  } catch (error) {
    console.error('Error during Google sign-in:', error);
  }
};

// Sign up with Email and Password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    console.log('Attempting to create user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created:', userCredential.user);

    await updateProfile(userCredential.user, { displayName });
    console.log('Profile updated with display name:', displayName);

    const user = userCredential.user;
    const userDocRef = doc(firestore, 'users', user.uid);

    await setDoc(userDocRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      paymentMethods: []
    });

    console.log('User document created in Firestore:', user.uid);
    return user;
  } catch (error) {
    console.error('Error during email sign-up:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

// Get user details
export const getUserDetails = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user signed in');
  }
  const userDoc = doc(firestore, 'users', user.uid);
  const docSnapshot = await getDoc(userDoc);
  if (!docSnapshot.exists()) {
    throw new Error('User document not found');
  }
  return docSnapshot.data();
};

// Fetch user data
export const fetchUserData = async (user) => {
  try {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    if (error.message.includes('client is offline')) {
      console.error('Network error: The client is offline. Please check your internet connection.');
    } else {
      console.error('Error fetching user data: ', error);
    }
  }
};

// Add payment method
export const addPaymentMethod = async (type, details) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user signed in');
  }
  const userDoc = doc(firestore, 'users', user.uid);
  const docSnapshot = await getDoc(userDoc);
  const paymentMethods = docSnapshot.data().paymentMethods || [];
  const newMethod = { id: new Date().toISOString(), type, details };
  paymentMethods.push(newMethod);
  await updateDoc(userDoc, { paymentMethods });
};

// Update payment method
export const updatePaymentMethod = async (method, isDefault) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user signed in');
  }
  const userDoc = doc(firestore, 'users', user.uid);
  const docSnapshot = await getDoc(userDoc);
  const paymentMethods = docSnapshot.data().paymentMethods || [];
  const updatedMethods = paymentMethods.map((pm) =>
    pm.id === method.id ? { ...pm, isDefault } : pm
  );
  await updateDoc(userDoc, { paymentMethods: updatedMethods });
};

// Remove payment method
export const removePaymentMethod = async (method) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user signed in');
  }
  const userDoc = doc(firestore, 'users', user.uid);
  const docSnapshot = await getDoc(userDoc);
  const paymentMethods = docSnapshot.data().paymentMethods || [];
  const updatedMethods = paymentMethods.filter((pm) => pm.id !== method.id);
  await updateDoc(userDoc, { paymentMethods: updatedMethods });
};
