import React, { useState, useEffect } from 'react';
import MakeClaims from './MakeClaims';
import AddNewClaim from './AddNewClaim';
import { db, auth } from '../firebase'; // Importing Firebase configuration and authentication
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

function ClaimsManager() {
  const [userDetails, setUserDetails] = useState(null);
  const [claims, setClaims] = useState([
    { id: 12345, date: '01/10/2023', amount: '$500.00', status: 'Pending' },
    { id: 12346, date: '01/11/2023', amount: '$300.00', status: 'Approved' },
    { id: 12347, date: '01/12/2023', amount: '$200.00', status: 'Rejected' },
    { id: 12348, date: '01/13/2023', amount: '$700.00', status: 'Pending' },
    { id: 12349, date: '01/14/2023', amount: '$900.00', status: 'Approved' },
    { id: 12350, date: '01/15/2023', amount: '$100.00', status: 'Rejected' },
    { id: 12351, date: '01/16/2023', amount: '$250.00', status: 'Pending' },
    { id: 12352, date: '01/17/2023', amount: '$350.00', status: 'Approved' },
    { id: 12353, date: '01/18/2023', amount: '$450.00', status: 'Rejected' },
  ]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user-specific claims from Firebase
        const userClaims = await fetchUserClaims(currentUser.uid);
        setClaims((prevClaims) => [...prevClaims, ...userClaims]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserClaims = async (userId) => {
    const userClaims = [];
    try {
      const claimsRef = collection(db, 'claims');
      const q = query(claimsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userClaims.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('Error fetching user claims:', error);
    }
    return userClaims;
  };

  const handleSubmitClaim = async (newClaim) => {
    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'claims'), {
          ...newClaim,
          userId: user.uid,
          status: 'Pending', // Default status
        });
        setClaims((prevClaims) => [
          ...prevClaims,
          { id: docRef.id, ...newClaim, status: 'Pending' },
        ]);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      console.log('User not authenticated');
    }
  };

  return (
    <div>
      <MakeClaims claims={claims} />
      <AddNewClaim onSubmitClaim={handleSubmitClaim} />
    </div>
  );
}

export default ClaimsManager;
