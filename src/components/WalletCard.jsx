import { Wallet, Eye, EyeOff } from 'lucide-react';
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
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#5C2D91]/10">
            <Wallet size={24} className="text-[#5C2D91]" />
          </div>
          <div>
            <p className="text-sm text-neutral-500 font-medium">Wallet Balance</p>
            <p className="text-2xl font-semibold text-neutral-900">
              {showBalance ? formatBalance(balance) : '••••••'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 rounded-lg text-neutral-500 hover:text-[#5C2D91] hover:bg-[#5C2D91]/10 transition-colors"
        >
          {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex gap-3">
        <Link
          to="/wallet"
          className="flex-1 bg-[#5C2D91] hover:bg-[#4b2378] text-white py-3 rounded-xl font-medium transition-all duration-300 text-center hover:scale-[1.02] shadow-md"
        >
          Fund Wallet
        </Link>
      </div>
    </div>
  );
};

export default WalletCard;
