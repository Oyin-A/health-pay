import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from '../firebase';

const CheckEmailVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          navigate('/verify-email'); // Redirect to the email verification page
        } else {
          navigate('/dashboard'); // Redirect to dashboard
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return null; // No need to render anything
};

export default CheckEmailVerification;
