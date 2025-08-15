import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import TransactionCard from '../components/TransactionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.details?.phone?.includes(searchTerm) ||
        transaction.details?.plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionStats = () => {
    const total = transactions.length;
    const success = transactions.filter(t => t.status === 'success').length;
    const pending = transactions.filter(t => t.status === 'pending').length;
    const failed = transactions.filter(t => t.status === 'failed').length;

    return { total, success, pending, failed };
  };

  const stats = getTransactionStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
            Transaction History
          </h1>
          <p className="text-neutral-600">
            View and manage all your transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-[#5C2D91] p-2 rounded">
          <div className="card text-center">
            <p className="text-2xl font-bold text-[#fff]">{stats.total}</p>
            <p className="text-sm text-[#fff]">Total</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
            <p className="text-sm text-[#fff]">Success</p>
          </div>
          <div className="card text-center">
              <p className="text-2xl font-bold text-[#F59E0B]">{stats.pending}</p>
            <p className="text-sm text-[#fff]">Pending</p>
          </div>
          <div className="card text-center">
              <p className="text-2xl font-bold text-[#EF4444]">{stats.failed}</p>
            <p className="text-sm text-[#fff]">Failed</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input p-2 pl-10 border rounded"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                <option value="all">All Types</option>
                <option value="airtime">Airtime</option>
                <option value="data">Data</option>
                <option value="bill">Bills</option>
                <option value="wallet_fund">Wallet Fund</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="card text-center py-8">
              <p className="text-neutral-500">No transactions found</p>
              <p className="text-sm text-neutral-400">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Your transactions will appear here once you make a purchase'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;