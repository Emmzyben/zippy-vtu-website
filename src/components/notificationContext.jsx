import { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
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

  // We support showNotification(notificationObject) or showNotification(type, title, message)
  const showNotification = (arg1, arg2, arg3) => {
    if (typeof arg1 === 'object') {
      setNotification({ type: arg1.type || 'info', title: arg1.title || '', message: arg1.message || '' });
    } else {
      setNotification({ type: arg1 || 'info', title: arg2 || '', message: arg3 || '' });
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle2 size={18} className="text-green-600" />;
    if (type === 'error') return <AlertCircle size={18} className="text-red-500" />;
    if (type === 'warning') return <AlertCircle size={18} className="text-amber-500" />;
    return <Info size={18} className="text-neutral-900" />;
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <div
        className={clsx(
          'fixed top-5 right-5 z-[9999] transition-all duration-300 ease-in-out transform',
          isOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95 pointer-events-none',
          'w-80 min-h-[64px] bg-white border border-neutral-100 rounded-lg shadow-xl shadow-[#e3984d]/5 p-4 flex items-start gap-3'
        )}
      >
        <div className="shrink-0 mt-0.5">{getIcon(notification?.type)}</div>
        <div className="flex-1 min-w-0">
          {(notification?.title) && (
            <p className="text-xs font-bold text-neutral-900 mb-0.5 line-clamp-1">{notification.title}</p>
          )}
          <p className="text-[10px] font-medium text-neutral-500 leading-relaxed text-balance">
            {notification?.message}
          </p>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="shrink-0 p-1 -mr-1 -mt-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </NotificationContext.Provider>
  );
};
