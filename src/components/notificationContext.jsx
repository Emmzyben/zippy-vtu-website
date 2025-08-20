import { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const showNotification = (notif) => {
    setNotification(notif);
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <div
        className={clsx(
          'fixed top-5 right-5 z-50 transition-transform duration-500 ease-in-out transform',
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0',
          'w-80 p-4 rounded-lg shadow-lg text-white flex justify-between items-start space-x-2',
          {
            'bg-green-600': notification?.type === 'success',
            'bg-red-600': notification?.type === 'error',
          }
        )}
      >
        <div className="text-sm">{notification?.message}</div>
        <button onClick={() => setIsOpen(false)} className="ml-auto">
          <X className="w-4 h-4" />
        </button>
      </div>
    </NotificationContext.Provider>
  );
};
