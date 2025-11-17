import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { walletService } from '../services/walletService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Wallet as WalletIcon } from 'lucide-react';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('fund');
  const [fundAmount, setFundAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { balance, fundWallet, refreshWallet } = useWallet();

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleFundWallet = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const amount = parseFloat(fundAmount);
      if (amount < 100) throw new Error('Minimum funding amount is ₦100');

      const response = await fundWallet(amount);

      // Use Paystack popup instead of redirect
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_4dc96782ee661d5ee15dd5f9f0be5b28e9d7b85a',
        email: response.email,
        amount: amount * 100, // Convert to kobo
        ref: response.data.reference,
        onClose: function() {
          setError('Payment cancelled');
          setLoading(false);
        },
        callback: function(response) {
          // Handle payment success - call verification
          walletService.verifyPayment(response.reference)
            .then(() => {
              setSuccess('Payment completed and wallet funded successfully!');
              setFundAmount('');
              refreshWallet();
            })
            .catch((verifyError) => {
              console.error('Verification failed:', verifyError);
              setError('Payment completed but verification failed. Please contact support.');
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
      handler.openIframe();

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatBalance = (amount) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="mb-4 bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
          <h1 className="text-lg font-bold text-neutral-800">Wallet</h1>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm mb-6 transition hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-[#5C2D91] bg-opacity-10 rounded-xl text-[#fff]">
              <WalletIcon size={32} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Available Balance</p>
              <p className="text-3xl font-bold text-[#5C2D91]">
                {formatBalance(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Funding Section */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {activeTab === 'fund' && (
            <>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                Fund Wallet
              </h3>

              <form onSubmit={handleFundWallet}>
                {/* Quick Amount Buttons */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quick Amount
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setFundAmount(amount.toString())}
                        className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                          fundAmount === amount.toString()
                            ? 'border-[#5C2D91] bg-[#5C2D91] text-white'
                            : 'border-neutral-200 text-neutral-700 hover:border-[#5C2D91] hover:text-[#5C2D91]'
                        }`}
                      >
                        ₦{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Field */}
                <div className="mb-5">
                  <label
                    htmlFor="fundAmount"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Enter Custom Amount
                  </label>
                  <input
                    type="number"
                    id="fundAmount"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:outline-none transition"
                    placeholder="Enter amount (₦)"
                    min="100"
                    required
                  />
                </div>

                {/* Fund Button */}
                <button
                  type="submit"
                  disabled={loading || !fundAmount}
                  className="w-full bg-[#5C2D91] hover:bg-[#4B1E7C] text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Fund Wallet'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
