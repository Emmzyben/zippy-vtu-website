import { ArrowUpRight, ArrowDownRight, Check, X, Clock } from 'lucide-react';

const TransactionCard = ({ transaction }) => {
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
        return <Check className="text-green-500" size={16} />;
      case 'failed':
        return <X className="text-red-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card border-l-4 border-l-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 rounded-lg">
            {getTransactionIcon(transaction.type)}
          </div>
          <div>
            <h3 className="font-medium text-neutral-800">
              {transaction.type === 'wallet_fund' ? 'Wallet Funding' : 
               transaction.type === 'withdrawal' ? 'Withdrawal' :
               `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Purchase`}
            </h3>
            <p className="text-sm text-neutral-500">
              {formatDate(transaction.created_at)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-neutral-800">
            {formatAmount(transaction.amount)}
          </p>
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
            {getStatusIcon(transaction.status)}
            <span className="capitalize">{transaction.status}</span>
          </div>
        </div>
      </div>
      
      {transaction.details && (
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <p className="text-sm text-neutral-600">
            {transaction.details.phone && `Phone: ${transaction.details.phone}`}
            {transaction.details.plan && ` • Plan: ${transaction.details.plan}`}
            {transaction.details.reference && ` • Ref: ${transaction.details.reference}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;