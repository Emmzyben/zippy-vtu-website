import { ArrowUpRight, ArrowDownRight, Check, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransactionCard = ({ transaction }) => {
  const navigate = useNavigate();

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'wallet_fund':
        return <ArrowDownRight className="text-green-600" size={16} />;
      case 'withdrawal':
        return <ArrowUpRight className="text-red-600" size={16} />;
      case 'p2p_transfer':
        return transaction.details?.transfer_type === 'credit' ? (
          <ArrowDownRight className="text-green-600" size={16} />
        ) : (
          <ArrowUpRight className="text-red-600" size={16} />
        );
      default:
        return <ArrowUpRight className="text-[#e3984d]" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
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
      className="bg-white border border-neutral-100 rounded-lg p-3 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center group-hover:bg-white transition-colors">
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <h3 className="text-xs font-bold text-neutral-900 leading-tight">
            {transaction.type === 'wallet_fund'
              ? 'Wallet Funding'
              : transaction.type === 'withdrawal'
                ? 'Withdrawal'
                : transaction.type === 'bill'
                  ? 'Bill Payment'
                  : transaction.type === 'p2p_transfer'
                    ? transaction.details?.transfer_type === 'credit'
                      ? `Received: ${transaction.details?.sender_name || 'User'}`
                      : `Transfer: ${transaction.details?.recipient_name || 'User'}`
                    : `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Purchase`}
          </h3>
          <p className="text-[10px] text-neutral-500 font-medium mt-0.5 uppercase tracking-wider">
            {formatDate(transaction.date || transaction.created_at)}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="text-right flex flex-col items-end gap-1">
        <p className={`text-xs font-black tracking-tight ${
           transaction.type === 'wallet_fund' || transaction.details?.transfer_type === 'credit' 
           ? 'text-green-600' 
           : 'text-neutral-900'
        }`}>
          {transaction.type === 'wallet_fund' || transaction.details?.transfer_type === 'credit' ? '+' : '-'}
          {formatAmount(transaction.amount)}
        </p>
        <div
          className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${getStatusColor(
            transaction.status
          )}`}
        >
          {transaction.status}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
