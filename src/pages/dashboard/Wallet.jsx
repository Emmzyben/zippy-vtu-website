import { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { walletService } from '../../services/walletService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Building2, User, Hash } from 'lucide-react';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('fund'); // 'fund' or 'withdraw'
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    bank_name: '',
    account_number: '',
    account_name: ''
  });
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

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: response.email,
        amount: amount * 100,
        ref: response.data.reference,
        onClose: function () {
          setError('Payment cancelled');
          setLoading(false);
        },
        callback: function (response) {
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

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const amount = parseFloat(withdrawData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error('Please enter a valid amount');
      if (amount > balance) throw new Error('Insufficient balance');
      if (amount < 1000) throw new Error('Minimum withdrawal amount is ₦1,000');
      if (!withdrawData.bank_name || !withdrawData.account_number || !withdrawData.account_name) {
        throw new Error('Please fill all bank details');
      }

      const response = await walletService.withdraw(withdrawData);

      if (response.success) {
        setSuccess('Withdrawal request submitted successfully! Funds will be processed shortly.');
        setWithdrawData({
          amount: '',
          bank_name: '',
          account_number: '',
          account_name: ''
        });
        refreshWallet();
      } else {
        setError(response.message || 'Withdrawal failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
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
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Wallet Management</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">
            {activeTab === 'fund' ? 'Top up your balance via Paystack' : 'Withdraw funds to your bank account'}
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-white border border-neutral-100 p-6 rounded-lg shadow-sm mb-3">
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

      {/* Action Tabs / Premium Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl">
        <button
          onClick={() => { setActiveTab('fund'); setError(''); setSuccess(''); }}
          className={`relative p-6 rounded-xl border-2 transition-all group overflow-hidden ${
            activeTab === 'fund' 
            ? 'border-[#e3984d] bg-[#e3984d] shadow-lg shadow-[#e3984d]/20 text-white' 
            : 'border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${activeTab === 'fund' ? 'text-white/80' : 'text-neutral-400'}`}>Add Money</p>
              <h3 className="text-lg font-black tracking-tight">Fund Wallet</h3>
            </div>
            <div className={`p-3 rounded-lg transition-colors ${activeTab === 'fund' ? 'bg-white/20 text-white' : 'bg-neutral-50 text-neutral-400 group-hover:bg-[#e3984d]/10 group-hover:text-[#e3984d]'}`}>
              <ArrowDownRight size={24} />
            </div>
          </div>
          {activeTab === 'fund' && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30" />
          )}
        </button>

        <button
          onClick={() => { setActiveTab('withdraw'); setError(''); setSuccess(''); }}
          className={`relative p-6 rounded-xl border-2 transition-all group overflow-hidden ${
            activeTab === 'withdraw' 
            ? 'border-neutral-900 bg-neutral-900 shadow-lg shadow-neutral-900/20 text-white' 
            : 'border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${activeTab === 'withdraw' ? 'text-white/80' : 'text-neutral-400'}`}>Send to Bank</p>
              <h3 className="text-lg font-black tracking-tight">Withdraw Funds</h3>
            </div>
            <div className={`p-3 rounded-lg transition-colors ${activeTab === 'withdraw' ? 'bg-white/20 text-white' : 'bg-neutral-50 text-neutral-400 group-hover:bg-neutral-900/10 group-hover:text-neutral-900'}`}>
              <ArrowUpRight size={24} />
            </div>
          </div>
          {activeTab === 'withdraw' && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30" />
          )}
        </button>
      </div>

      <div className="bg-white border border-neutral-100 rounded-lg shadow-sm p-6 max-w-2xl">
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

        {activeTab === 'fund' ? (
          <>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Top Up Account</h3>
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
                <label htmlFor="fundAmount" className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
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

              <button
                type="submit"
                disabled={loading || !fundAmount}
                className="w-full bg-[#e3984d] hover:bg-[#c98542] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-md shadow-sm transition-all flex justify-center items-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <>Confirm Payment <ArrowUpRight size={14} /></>}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Withdraw to Bank</h3>
            <form onSubmit={handleWithdrawal} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">₦</span>
                  <input
                    type="number"
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-md py-3 pl-8 pr-3 font-bold text-neutral-900 focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="0.00"
                    min="1000"
                    required
                  />
                </div>
                <p className="text-[9px] text-neutral-400 mt-1 uppercase font-bold tracking-tight">Min. withdrawal: ₦1,000</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Bank Name</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={withdrawData.bank_name}
                      onChange={(e) => setWithdrawData({ ...withdrawData, bank_name: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-md py-3 pl-10 pr-3 font-bold text-neutral-900 focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-sm"
                      placeholder="e.g. GTBank"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Account Number</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      maxLength="10"
                      value={withdrawData.account_number}
                      onChange={(e) => setWithdrawData({ ...withdrawData, account_number: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-md py-3 pl-10 pr-3 font-bold text-neutral-900 focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-sm"
                      placeholder="0123456789"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Account Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={withdrawData.account_name}
                    onChange={(e) => setWithdrawData({ ...withdrawData, account_name: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-md py-3 pl-10 pr-3 font-bold text-neutral-900 focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="Enter full account name"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !withdrawData.amount || !withdrawData.bank_name}
                className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest py-4 rounded-md shadow-sm transition-all flex justify-center items-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <>Request Withdrawal <ArrowUpRight size={14} /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Wallet;
