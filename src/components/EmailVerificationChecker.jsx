import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EmailVerificationModal from './EmailVerificationModal';

const EmailVerificationChecker = () => {
  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isVerified = user?.is_verified === 1 || user?.is_verified === "1" || user?.is_verified === true;
    if (isAuthenticated && user && !isVerified) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isAuthenticated, user]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <EmailVerificationModal
      isOpen={showModal}
      onClose={handleCloseModal}
    />
  );
};

export default EmailVerificationChecker;
