import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import WalletCard from '../components/WalletCard';
import QuickActions from '../components/QuickActions';
import TransactionCard from '../components/TransactionCard';

const Home = () => {
  const { user } = useAuth();
  const { transactions } = useWallet();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-neutral-600">
            Manage your airtime, data, and bills all in one place
          </p>
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