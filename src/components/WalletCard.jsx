import { Wallet, Eye, EyeOff, ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Link } from 'react-router-dom';

const WalletCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const { balance } = useWallet();

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white border border-neutral-200 p-5 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#e3984d] flex items-center justify-center text-white">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Available Balance</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                {showBalance ? formatBalance(balance) : '₦ ••••••'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1.5 hover:bg-neutral-50 rounded-md text-neutral-400 transition-colors"
              >
                {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Link
          to="/wallet"
          className="flex items-center justify-center gap-2 bg-[#e3984d] hover:bg-[#4b2378] text-white py-2.5 rounded-md text-xs font-bold transition-colors shadow-sm"
        >
          <Plus size={14} /> Fund Wallet
        </Link>
        <Link
          to="/transactions"
          className="flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 py-2.5 rounded-md text-xs font-bold hover:bg-neutral-50 transition-colors"
        >
          <ArrowUpRight size={14} /> History
        </Link>
      </div>
    </div>
  );
};

export default WalletCard;
