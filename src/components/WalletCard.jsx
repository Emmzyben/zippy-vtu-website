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
    <div className="bg-gradient-to-r from-[#5C2D91] to-purple-600 p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white  bg-opacity-20 rounded-lg ">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm opacity-90 text-white">Wallet Balance</p>
            <p className="text-2xl font-bold text-white">
              {showBalance ? formatBalance(balance) : '••••••'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
        >
          {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="flex gap-3">
      <Link
       to={"/wallet"}
       className="flex-1 bg-[#F59E0B] text-white bg-opacity-20 hover:scale-105 hover:shadow-xl py-2 px-4 rounded-lg font-medium transition-all text-center"
      >
          Fund Wallet
       </Link>
      </div>
    </div>
  );
};

export default WalletCard;