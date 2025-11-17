import { ArrowUpRight, ArrowDownRight, Check, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransactionCard = ({ transaction }) => {
  const navigate = useNavigate();

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'wallet_fund':
        return <ArrowDownRight className="text-green-500" size={20} />;
      case 'withdrawal':
        return <ArrowUpRight className="text-red-500" size={20} />;
      default:
        return <ArrowUpRight className="text-blue-500" size={20} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <Check className="text-green-500" size={14} />;
      case 'failed':
        return <X className="text-red-500" size={14} />;
      default:
        return <Clock className="text-yellow-500" size={14} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'bg-green-50 text-green-600 border border-green-100';
      case 'failed':
        return 'bg-red-50 text-red-600 border border-red-100';
      default:
        return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleClick = () => {
    navigate(`/transactions/${transaction.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white/60 backdrop-blur-sm border border-neutral-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:bg-white/80 transition-all cursor-pointer"
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-neutral-100 flex items-center justify-center">
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <h3 className="font-medium text-neutral-800 leading-tight">
            {transaction.type === 'wallet_fund'
              ? 'Wallet Funding'
              : transaction.type === 'withdrawal'
              ? 'Withdrawal'
               : transaction.type === 'bill'
              ? 'Bill Payment'
              : `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Purchase`}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            {formatDate(transaction.date || transaction.created_at)}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="text-right space-y-1">
        <p className="font-semibold text-neutral-900 text-sm">
          {formatAmount(transaction.amount)}
        </p>
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            transaction.status
          )}`}
        >
          {getStatusIcon(transaction.status)}
          <span className="capitalize">{transaction.status}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
