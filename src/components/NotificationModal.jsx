import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

const NotificationModal = ({
  isOpen,
  onClose,
  type = 'info',
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

  const getIcon = () => {
    if (type === 'success') return <CheckCircle2 size={18} className="text-green-600" />;
    if (type === 'error') return <AlertCircle size={18} className="text-red-500" />;
    if (type === 'warning') return <AlertCircle size={18} className="text-amber-500" />;
    return <Info size={18} className="text-neutral-900" />;
  };

  return (
    <div
      className={clsx(
        'fixed top-5 right-5 z-[10000] transition-all duration-300 ease-in-out transform',
        isOpen ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95 pointer-events-none',
        'w-80 min-h-[64px] bg-white border border-neutral-100 rounded-lg shadow-xl shadow-[#e3984d]/5 p-4 flex items-start gap-3'
      )}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-xs font-bold text-neutral-900 mb-0.5 line-clamp-1">{title}</p>
        )}
        <p className="text-[10px] font-medium text-neutral-500 leading-relaxed text-balance">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose} 
        className="shrink-0 p-1 -mr-1 -mt-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default NotificationModal;
