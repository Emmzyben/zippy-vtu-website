import { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { vtuService } from '../../services/vtuService';
import NetworkSelector from '../../components/NetworkSelector';
import PhoneBeneficiarySelector from '../../components/PhoneBeneficiarySelector';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationModal from '../../components/NotificationModal';
import { Zap } from 'lucide-react';

const Airtime = () => {
  const [formData, setFormData] = useState({ network: '', phone: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const { balance, refreshWallet } = useWallet();
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNetworkChange = (network) => setFormData({ ...formData, network });
  const handleQuickAmount = (amount) => setFormData({ ...formData, amount: amount.toString() });

  const formatBalance = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

  const validatePhoneNumber = (phone) => /^(\+234|0)[789][01]\d{8}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.network) {
      setModalState({ isOpen: true, type: 'error', title: 'Validation Error', message: 'Please select a network.' });
      setLoading(false); return;
    }
    if (!formData.phone || !validatePhoneNumber(formData.phone)) {
      setModalState({ isOpen: true, type: 'error', title: 'Invalid Phone', message: 'Enter a valid Nigerian phone number.' });
      setLoading(false); return;
    }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 50 || amount > 50000) {
      setModalState({ isOpen: true, type: 'error', title: 'Invalid Amount', message: 'Amount must be between ₦50 and ₦50,000.' });
      setLoading(false); return;
    }
    if (amount > balance) {
      setModalState({ isOpen: true, type: 'error', title: 'Insufficient Balance', message: 'Not enough funds in your wallet.' });
      setLoading(false); return;
    }

    try {
      const response = await vtuService.buyAirtime({ network: formData.network, phone: formData.phone, amount });
      if (response.status === 'success' || response.status === 'pending') {
        await refreshWallet();
        setModalState({
          isOpen: true, type: response.status === 'success' ? 'success' : 'warning',
          title: response.status === 'success' ? 'Purchase Successful' : 'Transaction Pending',
          message: response.status === 'success' ? `${formData.network.toUpperCase()} airtime delivered!` : 'Pending confirmation.'
        });
        setFormData({ network: '', phone: '', amount: '' });
      } else {
        throw new Error('Airtime purchase failed, please try again.');
      }
    } catch (err) {
      setModalState({ isOpen: true, type: 'error', title: 'Purchase Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-10  mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Buy Airtime</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Instant top-up to any network</p>
      </div>

      {/* Balance Strip */}
      <div className="bg-[#e3984d] text-white rounded-lg p-5 flex items-center justify-between mb-8 shadow-sm">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Wallet Balance</p>
        <p className="text-lg font-black tracking-tight">{formatBalance(balance)}</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-6">
        <NetworkSelector value={formData.network} onChange={handleNetworkChange} />

        <div>
          <PhoneBeneficiarySelector
            value={formData.phone}
            onSelect={(phone) => setFormData({ ...formData, phone })}
            onAdd={() => setModalState({ isOpen: true, type: 'success', title: 'Success', message: 'Beneficiary added!' })}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Amount</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleQuickAmount(amount)}
                className={`py-2.5 px-4 rounded-md border text-xs font-bold transition-all ${formData.amount === amount.toString()
                  ? 'bg-[#e3984d] text-white border-[#e3984d]'
                  : 'border-neutral-100 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
              >
                ₦{amount.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full bg-neutral-50 border border-neutral-100 focus:border-neutral-400 focus:bg-white rounded-md p-3 font-bold text-neutral-900 outline-none text-xs transition-all"
            placeholder="Or enter custom amount"
            min="50"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !formData.network || !formData.phone || !formData.amount}
          className="w-full bg-[#e3984d] text-white font-bold py-3.5 rounded-md text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-all flex justify-center items-center gap-2 disabled:opacity-40"
        >
          {loading ? <LoadingSpinner size="sm" /> : <><Zap size={14} /> Buy Airtime</>}
        </button>
      </div>

      <NotificationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
      />
    </div>
  );
};

export default Airtime;
