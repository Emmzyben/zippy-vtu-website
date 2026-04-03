import { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { walletService } from '../../services/walletService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Wallet as WalletIcon, ArrowUpRight } from 'lucide-react';

const Wallet = () => {
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
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: response.email,
        amount: amount * 100, // Convert to kobo
        ref: response.data.reference,
        onClose: function () {
          setError('Payment cancelled');
          setLoading(false);
        },
        callback: function (response) {
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
    <div className="p-4 lg:p-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Wallet Funding</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Manage your balance and top up via Paystack</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-white border border-neutral-100 p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#e3984d] flex items-center justify-center text-white shadow-sm">
            <WalletIcon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-left">Current Wallet Balance</p>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tighter">
              {formatBalance(balance)}
            </h2>
          </div>
        </div>
      </div>

      {/* Fund Wallet Form */}
      <div className="bg-white border border-neutral-100 rounded-lg shadow-sm p-6">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Top Up Account</h3>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-xs font-bold uppercase tracking-wide">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-700 rounded-md text-xs font-bold uppercase tracking-wide">
            {success}
          </div>
        )}

        <form onSubmit={handleFundWallet} className="space-y-6">
          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
              Quick Selection
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFundAmount(amount.toString())}
                  className={`py-2 px-3 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${fundAmount === amount.toString()
                    ? 'border-[#e3984d] bg-[#e3984d] text-white shadow-md'
                    : 'border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-300'
                    }`}
                >
                  ₦{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div>
            <label
              htmlFor="fundAmount"
              className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2"
            >
              Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">₦</span>
              <input
                type="number"
                id="fundAmount"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-100 rounded-md py-3 pl-8 pr-3 font-bold text-neutral-900 focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-sm"
                placeholder="0.00"
                min="100"
                required
              />
            </div>

            {/* Fee Disclaimer */}
            {fundAmount && !isNaN(parseFloat(fundAmount)) && parseFloat(fundAmount) >= 100 && (
              <div className="mt-4 p-4 bg-neutral-50 border border-neutral-100 rounded-md space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-neutral-400">Transaction Fee</span>
                  <span className="text-neutral-600">
                    {(() => {
                      let amount = parseFloat(fundAmount);
                      let fee = amount < 2500 ? amount * 0.015 : (amount * 0.015) + 100;
                      return `₦${fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    })()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2 text-xs font-black uppercase tracking-widest">
                  <span className="text-neutral-400">To be Credited</span>
                  <span className="text-[#e3984d]">
                    {(() => {
                      let amount = parseFloat(fundAmount);
                      let fee = amount < 2500 ? amount * 0.015 : (amount * 0.015) + 100;
                      return `₦${(amount - fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    })()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fund Button */}
          <button
            type="submit"
            disabled={loading || !fundAmount}
            className="w-full bg-[#e3984d] hover:bg-[#c98542] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-md shadow-sm transition-all flex justify-center items-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : <>Confirm Payment <ArrowUpRight size={14} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Wallet;
