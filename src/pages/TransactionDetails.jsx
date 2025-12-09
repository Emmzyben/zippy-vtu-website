import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  Phone,
  Network,
  Calendar,
  Hash,
} from 'lucide-react';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions } = useWallet();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Convert id to number for comparison since URL params are strings
    const transactionId = parseInt(id, 10);
    const foundTransaction = transactions.find((t) => t.id === transactionId);
    if (foundTransaction) {
      setTransaction(foundTransaction);
      setLoading(false);
    } else {
      const fetchTransaction = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/transactions/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setTransaction(data.transaction);
          }
        } catch (error) {
          console.error('Failed to fetch transaction:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [id, transactions]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <Check className="text-green-500" size={24} />;
      case 'failed':
        return <X className="text-red-500" size={24} />;
      default:
        return <Clock className="text-yellow-500" size={24} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'border-green-100 bg-green-50 text-green-700';
      case 'failed':
        return 'border-red-100 bg-red-50 text-red-700';
      default:
        return 'border-yellow-100 bg-yellow-50 text-yellow-700';
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(Math.abs(amount));

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString('en-US', {
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

  const getTransactionTypeLabel = (type) => {
    const map = {
      wallet_fund: 'Wallet Funding',
      withdrawal: 'Withdrawal',
      airtime: 'Airtime Purchase',
      data: 'Data Purchase',
      bill: 'Bill Payment',
    };
    return map[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (!transaction)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 text-neutral-600">
        <p className="mb-4 text-lg">Transaction not found</p>
        <button
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
        >
          Back to Transactions
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Title */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-2 text-neutral-900">
            Transaction Details
          </h1>
          <p className="text-sm text-neutral-500">
            Transaction ID: <span className="text-neutral-700">{transaction.id}</span>
          </p>
        </div>

        {/* Status Card */}
        <div
          className={`rounded-2xl border p-6 shadow-sm flex items-center gap-4 ${getStatusStyle(
            transaction.status
          )}`}
        >
          {getStatusIcon(transaction.status)}
          <div>
            <h2 className="text-lg font-semibold">
              {getTransactionTypeLabel(transaction.type)}
            </h2>
            <p className="text-sm opacity-80">
              Status:{' '}
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </p>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-neutral-900">
            Transaction Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard icon={<Hash size={18} />} label="Transaction ID" value={transaction.id} />
            <InfoCard
              icon={<Calendar size={18} />}
              label="Date & Time"
              value={formatDate(transaction.date || transaction.created_at)}
            />
            <InfoCard
              icon={<span className="font-semibold text-neutral-600">₦</span>}
              label="Amount"
              value={`${transaction.amount < 0 ? '-' : ''}${formatAmount(transaction.amount)}`}
            />

            {transaction.phone && (
              <InfoCard
                icon={<Phone size={18} />}
                label="Phone Number"
                value={transaction.phone}
              />
            )}

            {transaction.network && (
              <InfoCard
                icon={<Network size={18} />}
                label="Network"
                value={transaction.network.toUpperCase()}
              />
            )}

            {transaction.details?.biller && (
              <InfoCard
                icon={<span className="font-bold text-neutral-500 text-sm">B</span>}
                label="Biller"
                value={transaction.details.biller}
              />
            )}

            {transaction.description && (
              <InfoCard
                icon={<span className="font-bold text-neutral-500 text-sm">i</span>}
                label="Description"
                value={transaction.description}
              />
            )}
          </div>
        </div>

        {/* Additional Details */}
        {transaction.details && (
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">
              Additional Details
            </h3>
            <div className="divide-y divide-neutral-100">
              {Object.entries(transaction.details).map(([key, value]) => {
                let displayValue = value;
                // Format currency values
                if (['original_amount', 'fee', 'amount'].includes(key) && !isNaN(parseFloat(value))) {
                  displayValue = new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                  }).format(value);
                }
                // Humanize keys (replace underscores with spaces)
                const displayKey = key.replace(/_/g, ' ');

                return (
                  <div
                    key={key}
                    className="flex justify-between py-2 text-sm text-neutral-600"
                  >
                    <span className="capitalize">{displayKey}</span>
                    <span className="font-medium text-neutral-800">{displayValue}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 hover:bg-neutral-100 transition-all">
    <div className="text-neutral-500">{icon}</div>
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-800">{value}</p>
    </div>
  </div>
);

export default TransactionDetails;
