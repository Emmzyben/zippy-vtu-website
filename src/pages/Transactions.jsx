import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import TransactionCard from '../components/TransactionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search } from 'lucide-react';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const { transactions, loading } = useWallet();

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType, filterStatus]);

  const filterTransactions = () => {
    let filtered = transactions;

    // Search
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.details?.phone?.includes(searchTerm) ||
        t.details?.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type
    if (filterType !== 'all') filtered = filtered.filter((t) => t.type === filterType);

    // Status
    if (filterStatus !== 'all') filtered = filtered.filter((t) => t.status === filterStatus);

    setFilteredTransactions(filtered);
  };

  const getTransactionStats = () => {
    const total = transactions.length;
    const success = transactions.filter(t => t.status === 'success' || t.status === 'completed').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    const failed = transactions.filter(t => t.status === 'failed').length;
    return { total, success, pending, failed };
  };

  const stats = getTransactionStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 p-4 lg:p-8 transition-all">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Transaction History
          </h1>
          <p className="text-sm text-neutral-500">
            View, search, and filter your transaction activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} color="text-neutral-800" bg="bg-white" />
          <StatCard label="Success" value={stats.success} color="text-green-600" bg="bg-green-50" />
          <StatCard label="Pending" value={stats.pending} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard label="Failed" value={stats.failed} color="text-red-600" bg="bg-red-50" />
        </div>

        {/* Search + Filters */}
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search size={20} className="absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="airtime">Airtime</option>
                <option value="data">Data</option>
                <option value="bill">Bill</option>
                <option value="wallet_fund">Wallet Fund</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="animate-fadeIn"
              >
                <TransactionCard transaction={transaction} />
              </div>
            ))
          ) : (
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm text-center py-10">
              <p className="text-neutral-600 font-medium">No transactions found</p>
              <p className="text-sm text-neutral-400 mt-1">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Your transactions will appear here once you make a purchase.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, bg }) => (
  <div className={`${bg} rounded-2xl border border-neutral-200 p-5 shadow-sm text-center transition-all hover:shadow-md`}>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-neutral-500">{label}</p>
  </div>
);

export default Transactions;
