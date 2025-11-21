import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { vtuService } from '../services/vtuService';
import NetworkSelector from '../components/NetworkSelector';
import PhoneBeneficiarySelector from '../components/PhoneBeneficiarySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationModal from '../components/NotificationModal';

const Airtime = () => {
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const { balance, refreshWallet } = useWallet();
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNetworkChange = (network) => setFormData({ ...formData, network });
  const handleQuickAmount = (amount) => setFormData({ ...formData, amount: amount.toString() });

  const formatBalance = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (!formData.network) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a network.',
      });
      setLoading(false);
      return;
    }

    if (!formData.phone || !validatePhoneNumber(formData.phone)) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Invalid Phone Number',
        message: 'Please enter a valid Nigerian phone number (11 digits).',
      });
      setLoading(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 50 || amount > 50000) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Invalid Amount',
        message: 'Amount must be between ₦50 and ₦50,000.',
      });
      setLoading(false);
      return;
    }

    if (amount > balance) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Insufficient Balance',
        message: 'Insufficient wallet balance.',
      });
      setLoading(false);
      return;
    }

    try {

      const response = await vtuService.buyAirtime({
        network: formData.network,
        phone: formData.phone,
        amount,
      });

      if (response.status === 'success') {
        await refreshWallet();
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Purchase Successful',
          message: `${formData.network.toUpperCase()} airtime purchase successful!`,
        });
        setFormData({ network: '', phone: '', amount: '' });
      } else if (response.status === 'pending') {
        await refreshWallet();
        setModalState({
          isOpen: true,
          type: 'warning',
          title: 'Transaction Pending',
          message: 'Transaction is pending. Please wait for confirmation.',
        });
        setFormData({ network: '', phone: '', amount: '' });
      } else {
        await refreshWallet();
        throw new Error('Airtime purchase failed, please try again.');
      }
    } catch (err) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Purchase Failed',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-white to-purple-50 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-800">Buy Airtime</h1>
          <span className="text-sm text-neutral-500">Instant Top-up</span>
        </div>

        {/* Wallet Balance Card */}
        <div className="mb-6 bg-gradient-to-r from-[#5C2D91] to-purple-600 text-white p-4 rounded-2xl shadow-md flex justify-between items-center">
          <span className="text-sm opacity-90">Wallet Balance</span>
          <span className="text-2xl font-semibold">{formatBalance(balance)}</span>
        </div>

        {/* Airtime Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all duration-200 hover:shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Network Selector */}
            <NetworkSelector
              value={formData.network}
              onChange={handleNetworkChange}
            />

            {/* Phone Number */}
            <div className="mt-5">
              <PhoneBeneficiarySelector
                value={formData.phone}
                onSelect={(phone) => setFormData({ ...formData, phone })}
                onAdd={() => setModalState({
                  isOpen: true,
                  type: 'success',
                  title: 'Success',
                  message: 'Beneficiary added successfully!',
                })}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Amount</label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${formData.amount === amount.toString()
                      ? 'bg-[#5C2D91] text-white border-[#5C2D91] shadow-md'
                      : 'border-gray-200 hover:border-[#5C2D91] hover:bg-purple-50'
                      }`}
                  >
                    ₦{amount}
                  </button>
                ))}
              </div>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] transition"
                placeholder="Enter custom amount"
                min="50"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.network || !formData.phone || !formData.amount}
              className="w-full mt-6 bg-[#5C2D91] text-white font-semibold py-3 rounded-lg hover:bg-[#4A1F7C] transition-all shadow-md hover:shadow-lg flex justify-center items-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Buy Airtime'}
            </button>
          </form>
        </div>

        {/* Notification Modal */}
        <NotificationModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          type={modalState.type}
          title={modalState.title}
          message={modalState.message}
        />
      </div>
    </div>
  );
};

export default Airtime;
