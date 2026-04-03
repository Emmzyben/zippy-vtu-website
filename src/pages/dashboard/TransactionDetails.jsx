import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, Check, X, Clock, Phone, Network, Calendar, Hash } from 'lucide-react';

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-md border border-neutral-100 hover:bg-white hover:border-neutral-200 transition-all">
    <div className="text-neutral-400 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="font-bold text-neutral-900 text-xs truncate">{value}</p>
    </div>
  </div>
);

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions } = useWallet();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transactionId = parseInt(id, 10);
    const found = transactions.find((t) => t.id === transactionId);
    if (found) {
      setTransaction(found);
      setLoading(false);
    } else {
      const fetchTransaction = async () => {
        try {
          const response = await api.get(`/transactions/${id}`);
          if (response.data.success) setTransaction(response.data.transaction);
        } catch (error) {
          console.error('Failed to fetch transaction:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [id, transactions]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return { icon: <Check size={16} />, style: 'bg-green-50 text-green-700 border-green-100' };
      case 'failed':
        return { icon: <X size={16} />, style: 'bg-red-50 text-red-600 border-red-100' };
      default:
        return { icon: <Clock size={16} />, style: 'bg-amber-50 text-amber-700 border-amber-100' };
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Math.abs(amount));

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return 'N/A'; }
  };

  const getTypeLabel = (type) => {
    const map = { wallet_fund: 'Wallet Funding', withdrawal: 'Withdrawal', airtime: 'Airtime Purchase', data: 'Data Purchase', bill: 'Bill Payment' };
    return map[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (!transaction)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Transaction not found</p>
        <button onClick={() => navigate('/transactions')} className="bg-[#e3984d] text-white px-6 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-[#c98542] transition-all">
          Back to Ledger
        </button>
      </div>
    );

  const statusCfg = getStatusConfig(transaction.status);

  return (
    <div className="p-4 lg:p-10 max-w-3xl mx-auto transition-all">
      {/* Back */}
      <button
        onClick={() => navigate('/transactions')}
        className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-10 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft size={14} /> Transaction Ledger
      </button>

      <div className="space-y-4">
        {/* Header Card */}
        <div className="bg-white border border-neutral-100 rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">Transaction Record</h1>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">REF #{transaction.id}</p>
        </div>

        {/* Status Banner */}
        <div className={`rounded-lg border p-5 flex items-center gap-4 ${statusCfg.style}`}>
          <div className="w-8 h-8 rounded-md bg-white/60 border border-current/20 flex items-center justify-center shrink-0">
            {statusCfg.icon}
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-tight">{getTypeLabel(transaction.type)}</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-0.5">
              Status: {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </p>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="bg-white border border-neutral-100 rounded-lg shadow-sm p-6">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-5">Transaction Data</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <InfoCard icon={<Hash size={16} />} label="Reference ID" value={transaction.id} />
            <InfoCard icon={<Calendar size={16} />} label="Date & Time" value={formatDate(transaction.date || transaction.created_at)} />
            <InfoCard
              icon={<span className="font-bold text-sm">₦</span>}
              label="Amount"
              value={`${transaction.amount < 0 ? '- ' : '+ '}${formatAmount(transaction.amount)}`}
            />
            {transaction.phone && <InfoCard icon={<Phone size={16} />} label="Phone Number" value={transaction.phone} />}
            {transaction.network && <InfoCard icon={<Network size={16} />} label="Network" value={transaction.network.toUpperCase()} />}
            {transaction.details?.biller && <InfoCard icon={<span className="font-bold text-xs">B</span>} label="Biller" value={transaction.details.biller} />}
            {transaction.description && <InfoCard icon={<span className="font-bold text-xs">i</span>} label="Description" value={transaction.description} />}
          </div>
        </div>

        {/* Extra Details */}
        {transaction.details && (
          <div className="bg-white border border-neutral-100 rounded-lg shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-5">Additional Metadata</h3>
            <div className="divide-y divide-neutral-50">
              {Object.entries(transaction.details).map(([key, value]) => {
                let displayValue = value;
                if (['original_amount', 'fee', 'amount'].includes(key) && !isNaN(parseFloat(value))) {
                  displayValue = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
                }
                return (
                  <div key={key} className="flex justify-between py-3 text-xs">
                    <span className="capitalize font-bold text-neutral-400 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-neutral-900">{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
