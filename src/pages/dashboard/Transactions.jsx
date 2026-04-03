import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import TransactionCard from '../../components/TransactionCard';
import LoadingSpinner from '../../components/LoadingSpinner';
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
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 p-6">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 transition-all">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Transaction History</h1>
          <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Review and manage your financial activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Activity" value={stats.total} color="text-neutral-900" bg="bg-white" />
          <StatCard label="Completed" value={stats.success} color="text-green-600" bg="bg-white" />
          <StatCard label="Processing" value={stats.pending} color="text-amber-600" bg="bg-white" />
          <StatCard label="Failed" value={stats.failed} color="text-red-600" bg="bg-white" />
        </div>

        {/* Search + Filters */}
        <div className="bg-white border border-neutral-100 rounded-lg p-5 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by type or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-100 rounded-md focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-xs font-bold text-neutral-900"
              />
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 lg:flex-none bg-neutral-50 border border-neutral-100 rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-600 focus:border-[#e3984d] outline-none"
              >
                <option value="all">All Types</option>
                <option value="airtime">Airtime</option>
                <option value="data">Data</option>
                <option value="bill">Bill</option>
                <option value="wallet_fund">Wallet Fund</option>
                <option value="p2p_transfer">Transfer</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 lg:flex-none bg-neutral-50 border border-neutral-100 rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-600 focus:border-[#e3984d] outline-none"
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
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Entry Log</h3>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{filteredTransactions.length} items</p>
          </div>

          <div className="space-y-2">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id}>
                  <TransactionCard transaction={transaction} />
                </div>
              ))
            ) : (
              <div className="bg-white border border-neutral-100 rounded-lg text-center py-12">
                <p className="text-xs font-bold text-neutral-900 uppercase tracking-widest">No entries match your search</p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, bg }) => (
  <div className={`${bg} rounded-lg border border-neutral-100 p-4 shadow-sm transition-all`}>
    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 text-left">{label}</p>
    <p className={`text-xl font-black ${color}`}>{value}</p>
  </div>
);

export default Transactions;
