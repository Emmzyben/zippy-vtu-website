import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import WalletCard from '../../components/WalletCard';
import QuickActions from '../../components/QuickActions';
import TransactionCard from '../../components/TransactionCard';
import { useNavigate } from 'react-router-dom';

import { Smartphone } from 'lucide-react';

import { useInstall } from '../../context/InstallContext';

const Home = () => {
   const { user } = useAuth();
   const { transactions } = useWallet();
   const { install, isInstalled } = useInstall();

   const recentTransactions = transactions.slice(0, 5);
   const navigate = useNavigate();
   return (
      <div className="p-4 lg:p-10">
         <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                  Hello, {user?.full_name?.split(' ')[0]}
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               </h1>
               <p className="text-xs text-neutral-500 font-medium mt-1">Welcome to your ZippyPay Dashboard</p>
            </div>

            {!isInstalled && (
               <button
                  onClick={install}
                  className="inline-flex items-center justify-center gap-2 bg-[#e3984d] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#c98542] transition-colors"
               >
                  <Smartphone size={14} />
                  <span className="font-bold text-[10px] uppercase tracking-widest">Install App</span>
               </button>
            )}
         </div>

         <div className="grid lg:grid-cols-12 gap-6 mb-10">
            <div className="lg:col-span-5">
               <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 px-1">Financial Status</h3>
               <WalletCard />
            </div>
            <div className="lg:col-span-7">
               <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 px-1">Quick Utilities</h3>
               <QuickActions />
            </div>
         </div>

         <div className="mb-10">
            <div className="flex items-center justify-between mb-4 px-1">
               <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Recent Activity</h3>
               <button
                  onClick={() => navigate('/transactions')}
                  className="text-[10px] font-bold text-[#e3984d] uppercase tracking-widest hover:underline">View All</button>
            </div>

            {recentTransactions.length > 0 ? (
               <div className="space-y-2">
                  {recentTransactions.map((transaction) => (
                     <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
               </div>
            ) : (
               <div className="bg-white border border-neutral-100 rounded-lg text-center py-10">
                  <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">No transactions yet</p>
                  <p className="text-[10px] text-neutral-400 mt-1">
                     Your recent activity will appear automatically
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};

export default Home;