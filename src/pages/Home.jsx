import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import WalletCard from '../components/WalletCard';
import QuickActions from '../components/QuickActions';
import TransactionCard from '../components/TransactionCard';

import { Smartphone } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { transactions } = useWallet();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-800">
              Hello, {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Welcome back to Zippy Pay</p>
          </div>

          <a
            href="https://expo.dev/artifacts/eas/uFpfGDL96oxtFEo9HwgmpF.apk"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Smartphone size={18} />
            <span className="font-semibold text-sm">Get Mobile App</span>
          </a>
        </div>

        <div className="grid gap-6 mb-8">
          <WalletCard />
          <QuickActions />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Recent Transactions
          </h2>

          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-neutral-500">No transactions yet</p>
              <p className="text-sm text-neutral-400">
                Your recent transactions will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;