import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleSignInButton = ({ referralCode = '', onSuccess, onError }) => {
  const googleButtonRef = useRef(null);
  const { googleLogin } = useAuth();

  useEffect(() => {
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(checkGoogle);
        }
      }, 100);

      return () => clearInterval(checkGoogle);
    }
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left'
    });
  };

  const handleGoogleResponse = async (response) => {
    try {
      const result = await googleLogin(response.credential, referralCode);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (onError) {
        onError(error.message);
      }
    }
  };

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full flex justify-center"></div>
    </div>
  );
};

export default GoogleSignInButton;