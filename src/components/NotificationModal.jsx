import { useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const NotificationModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="text-green-400" size={24} />;
      case 'error':
        return <X className="text-red-400" size={24} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400" size={24} />;
      default:
        return <AlertCircle className="text-blue-400" size={24} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-400/40';
      case 'error':
        return 'border-red-400/40';
      case 'warning':
        return 'border-yellow-400/40';
      default:
        return 'border-blue-400/40';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-200';
      case 'error':
        return 'text-red-200';
      case 'warning':
        return 'text-yellow-200';
      default:
        return 'text-blue-200';
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-100';
      case 'error':
        return 'text-red-100';
      case 'warning':
        return 'text-yellow-100';
      default:
        return 'text-blue-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`rounded-2xl border ${getBorderColor()} bg-white/10 backdrop-blur-md shadow-2xl max-w-md w-full mx-4 transition-all duration-300`}
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${getTitleColor()}`}>
                {title}
              </h3>
              <p className={`text-sm mt-1 ${getMessageColor()}`}>{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-neutral-300 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
