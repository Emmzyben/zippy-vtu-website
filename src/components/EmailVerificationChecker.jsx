import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EmailVerificationModal from './EmailVerificationModal';

const EmailVerificationChecker = () => {
  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !user.is_verified) {
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
