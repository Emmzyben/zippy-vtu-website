import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { walletService } from '../services/walletService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmailBeneficiarySelector from '../components/EmailBeneficiarySelector';
import { Wallet as WalletIcon, Send, User, ArrowLeft } from 'lucide-react';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('fund');
  const [fundAmount, setFundAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [validatedRecipient, setValidatedRecipient] = useState(null);
  const [transferStep, setTransferStep] = useState('email'); // 'email' or 'amount'

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
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ,
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

  const handleValidateRecipient = async () => {
    if (!recipientEmail.trim()) {
      setError('Please enter a recipient email');
      return;
    }

    setLoading(true);
    setError('');
    setValidatedRecipient(null);

    try {
      const response = await walletService.validateRecipient(recipientEmail.trim());
      setValidatedRecipient(response.recipient);
      setTransferStep('amount');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const amount = parseFloat(transferAmount);
      if (amount < 1) throw new Error('Transfer amount must be greater than 0');

      const response = await walletService.transferFunds(recipientEmail, amount);

      setSuccess(`Transfer of ₦${amount.toLocaleString()} to ${response.data.recipient_name} completed successfully!`);
      setTransferAmount('');
      setRecipientEmail('');
      setValidatedRecipient(null);
      setTransferStep('email');
      refreshWallet();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setTransferStep('email');
    setValidatedRecipient(null);
    setTransferAmount('');
    setError('');
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

        {/* Tabs */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('fund')}
              className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'fund'
                ? 'bg-[#5C2D91] text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
            >
              Fund Wallet
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${activeTab === 'transfer'
                ? 'bg-[#5C2D91] text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
            >
              <Send size={16} />
              Transfer
            </button>
          </div>

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
                        className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${fundAmount === amount.toString()
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

          {activeTab === 'transfer' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                {transferStep === 'amount' && (
                  <button
                    onClick={handleBackToEmail}
                    className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h3 className="text-lg font-semibold text-neutral-800">
                  {transferStep === 'email' ? 'Transfer Funds' : 'Confirm Transfer'}
                </h3>
              </div>

              {transferStep === 'email' && (
                <>
                  {/* Info Note */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="text-blue-600 mt-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Note:</p>
                        <p className="text-sm text-blue-700">Transfers are only available between registered users on this platform. Enter the recipient's email address to continue.</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleValidateRecipient(); }}>
                    {/* Recipient Email Selector */}
                    <div className="mb-4">
                      <EmailBeneficiarySelector
                        value={recipientEmail}
                        onSelect={setRecipientEmail}
                        onAdd={() => setSuccess('Beneficiary added successfully!')}
                      />
                    </div>

                    {/* Validate Button */}
                    <button
                      type="submit"
                      disabled={loading || !recipientEmail.trim()}
                      className="w-full bg-[#5C2D91] hover:bg-[#4B1E7C] text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : 'Continue'}
                    </button>
                  </form>
                </>
              )}

              {transferStep === 'amount' && validatedRecipient && (
                <>
                  {/* Recipient Details */}
                  <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#5C2D91] bg-opacity-10 rounded-full">
                        <User size={20} className="text-[#5C2D91]" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{validatedRecipient.name}</p>
                        <p className="text-sm text-neutral-600">{validatedRecipient.email}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleTransfer}>
                    {/* Transfer Amount */}
                    <div className="mb-5">
                      <label
                        htmlFor="transferAmount"
                        className="block text-sm font-medium text-neutral-700 mb-2"
                      >
                        Transfer Amount
                      </label>
                      <input
                        type="number"
                        id="transferAmount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:outline-none transition"
                        placeholder="Enter amount (₦)"
                        min="1"
                        required
                      />
                    </div>

                    {/* Transfer Button */}
                    <button
                      type="submit"
                      disabled={loading || !transferAmount}
                      className="w-full bg-[#5C2D91] hover:bg-[#4B1E7C] text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all"
                    >
                      {loading ? <LoadingSpinner size="sm" /> : 'Transfer Funds'}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
