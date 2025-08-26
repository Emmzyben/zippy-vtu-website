import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Wallet as WalletIcon} from 'lucide-react';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('fund');
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { balance, fundWallet } = useWallet();

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleFundWallet = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const amount = parseFloat(fundAmount);
      
      if (amount < 100) {
        throw new Error('Minimum funding amount is ₦100');
      }

      const response = await fundWallet(amount);
      
      if (response.payment_url) {
        // Redirect to payment gateway
        window.location.href = response.payment_url;
      } else {
        setSuccess('Wallet funded successfully!');
        setFundAmount('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const amount = parseFloat(withdrawAmount);
      
      if (amount < 500) {
        throw new Error('Minimum withdrawal amount is ₦500');
      }

      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      // Implement withdrawal logic here
      setSuccess('Withdrawal request submitted successfully!');
      setWithdrawAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-4 bg-white p-2 rounded-lg shadow">
          <h1 className="text-lg font-bold text-neutral-800 mb-2">
           Wallet
          </h1>
       
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600  p-6 rounded-xl  shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg text-[#F59E0B]">
              <WalletIcon size={32} />
            </div>
            <div>
              <p className="text-sm opacity-90 text-white">Available Balance</p>
              <p className="text-3xl font-bold text-white">{formatBalance(balance)}</p>
            </div>
          </div>
          
         
        </div>

        {/* Tab Content */}
        <div className="card">
          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              {success}
            </div>
          )}

          {activeTab === 'fund' && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Fund Wallet
              </h3>
              
              <form onSubmit={handleFundWallet}>
                <div className="form-group">
                  <label className="form-label">Quick Amount</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setFundAmount(amount.toString())}
                        className={`py-2 px-4 rounded-lg border transition-colors ${
                          fundAmount === amount.toString()
                            ? 'border-[#5C2D91] bg-[#5C2D91] text-white'
                            : 'border-neutral-200 hover:border-[#5C2D91]'
                        }`}
                      >
                        ₦{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group flex-col">
                <div>
                  <label htmlFor="fundAmount" className="form-label">
                    Amount
                  </label>
                  </div>
                  <div>
                  <input
                    type="number"
                    id="fundAmount"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="form-input border border-neutral-300 p-2 mb-2 w-full rounded-lg focus:bg-[#dae2f0ff]"
                    placeholder="Enter amount"
                    min="100"
                    required
                  />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !fundAmount}
                     className="w-full bg-[#5C2D91] text-white font-semibold py-3 rounded-lg hover:bg-[#FF8C00]  flex justify-center items-center transition"
             
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Fund Wallet'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Withdraw Funds
              </h3>
              
              <form onSubmit={handleWithdraw}>
                <div className="form-group">
                  <label htmlFor="withdrawAmount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="withdrawAmount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="form-input"
                    placeholder="Enter amount"
                    min="500"
                    max={balance}
                    required
                  />
                  <p className="text-sm text-neutral-500 mt-1">
                    Minimum withdrawal: ₦500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !withdrawAmount}
                  className="btn btn-primary w-full"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Withdraw'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;