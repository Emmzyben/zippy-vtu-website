import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { vtuService } from '../../services/vtuService';
import NetworkSelector from '../../components/NetworkSelector';
import PhoneBeneficiarySelector from '../../components/PhoneBeneficiarySelector';
import LoadingSpinner from '../../components/LoadingSpinner';
import NotificationModal from '../../components/NotificationModal';
import { Wifi, CheckCircle2 } from 'lucide-react';

const Data = () => {
  const [formData, setFormData] = useState({ network: '', phone: '', variation_code: '', amount: 0 });
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [activeTab, setActiveTab] = useState('Monthly');
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const { balance, refreshWallet } = useWallet();

  const tabs = ['Daily', 'Weekly', 'Monthly', 'Special'];

  useEffect(() => {
    if (formData.network) loadDataPlans(formData.network);
  }, [formData.network]);

  const loadDataPlans = async (network) => {
    setLoadingPlans(true);
    setDataPlans([]);
    try {
      const serviceMap = { mtn: 'mtn-data', glo: 'glo-data', airtel: 'airtel-data', etisalat: 'etisalat-data' };
      const serviceID = serviceMap[network];
      if (!serviceID) throw new Error('Invalid network');
      const response = await vtuService.getVariations(serviceID);
      const variations = response.content?.variations || [];
      const plans = variations.map((v) => ({
        id: v.variation_code,
        name: v.name,
        price: parseFloat(v.variation_amount),
        data: v.name.split(' ')[0],
        validity: v.name.split(' ').slice(1).join(' '),
        variation_code: v.variation_code,
        amount: parseFloat(v.variation_amount),
      })).sort((a, b) => a.amount - b.amount);
      setDataPlans(plans);
    } catch {
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to load plans. Please try again.' });
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleNetworkChange = (network) => setFormData({ ...formData, network, variation_code: '', amount: 0 });

  const handlePlanChange = (planId) => {
    const selected = dataPlans.find((p) => p.id === planId);
    setFormData({ ...formData, variation_code: selected?.variation_code || '', amount: selected?.amount || 0 });
  };

  const validatePhoneNumber = (phone) => /^(\+234|0)[789][01]\d{8}$/.test(phone);

  const filterPlans = (plans) => {
    return plans.filter(plan => {
      const name = plan.name.toLowerCase();
      const getDays = (n) => {
        if (n.includes('month')) { const m = n.match(/(\d+)\s*month/); return m ? parseInt(m[1]) * 30 : 30; }
        if (n.includes('week')) { const w = n.match(/(\d+)\s*week/); return w ? parseInt(w[1]) * 7 : 7; }
        const d = n.match(/(\d+)\s*day/); return d ? parseInt(d[1]) : null;
      };
      const days = getDays(name);
      if (activeTab === 'Daily') return days !== null && days >= 1 && days <= 5;
      if (activeTab === 'Weekly') return days !== null && days > 5 && days <= 7;
      if (activeTab === 'Monthly') return days !== null && days > 7;
      if (activeTab === 'Special') return days === null;
      return true;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.network) { setModalState({ isOpen: true, type: 'error', title: 'Select Network', message: 'Please choose a network.' }); setLoading(false); return; }
    if (!formData.phone || !validatePhoneNumber(formData.phone)) { setModalState({ isOpen: true, type: 'error', title: 'Invalid Phone', message: 'Enter a valid Nigerian phone number.' }); setLoading(false); return; }
    if (!formData.variation_code) { setModalState({ isOpen: true, type: 'error', title: 'Select Plan', message: 'Please choose a data plan.' }); setLoading(false); return; }

    const selectedPlan = dataPlans.find(p => p.variation_code === formData.variation_code);
    if (selectedPlan?.price > balance) { setModalState({ isOpen: true, type: 'error', title: 'Insufficient Balance', message: 'Not enough funds in your wallet.' }); setLoading(false); return; }

    try {
      const response = await vtuService.buyData({ network: formData.network, phone: formData.phone, variation_code: formData.variation_code, amount: formData.amount });
      if (response.success || response.status === 'pending') {
        await refreshWallet();
        setModalState({ isOpen: true, type: response.success ? 'success' : 'warning', title: response.success ? 'Data Activated' : 'Pending', message: response.success ? `${formData.network.toUpperCase()} data delivered!` : 'Pending confirmation.' });
        setFormData({ network: '', phone: '', variation_code: '', amount: 0 });
      } else {
        throw new Error(response.error || 'Data purchase failed');
      }
    } catch (err) {
      setModalState({ isOpen: true, type: 'error', title: 'Purchase Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  const selectedPlan = dataPlans.find(p => p.variation_code === formData.variation_code);
  const filteredPlans = filterPlans(dataPlans);

  return (
    <div className="p-4 lg:p-10 mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Buy Data</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Instantly purchase mobile data bundles</p>
      </div>

      {/* Balance Strip */}
      <div className="bg-[#e3984d] text-white rounded-lg p-5 flex items-center justify-between mb-8 shadow-sm">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Wallet Balance</p>
        <p className="text-lg font-black tracking-tight">{formatBalance(balance)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Network + Phone */}
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-6">
          <NetworkSelector value={formData.network} onChange={handleNetworkChange} />
          <PhoneBeneficiarySelector
            value={formData.phone}
            onSelect={(phone) => setFormData({ ...formData, phone })}
            onAdd={() => setModalState({ isOpen: true, type: 'success', title: 'Success', message: 'Beneficiary added!' })}
          />
        </div>

        {/* Plan Selection */}
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-neutral-100">
            {tabs.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab
                  ? 'bg-[#e3984d] text-white'
                  : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Select Data Plan</p>

            {loadingPlans ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : !formData.network ? (
              <div className="text-center py-8">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select a network first</p>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">No {activeTab.toLowerCase()} plans found</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredPlans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-all ${formData.variation_code === plan.variation_code
                      ? 'border-[#e3984d] bg-neutral-50'
                      : 'border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50'
                      }`}
                  >
                    <input type="radio" name="plan" value={plan.id} checked={formData.variation_code === plan.variation_code} onChange={(e) => handlePlanChange(e.target.value)} className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${formData.variation_code === plan.variation_code ? 'bg-[#e3984d] border-[#e3984d]' : 'border-neutral-200'}`}>
                        {formData.variation_code === plan.variation_code && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 text-xs">{plan.data}</p>
                        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">{plan.validity}</p>
                      </div>
                    </div>
                    <span className="font-black text-neutral-900 text-xs">₦{plan.price.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {selectedPlan && (
          <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-5 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Order Summary</p>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-neutral-400 uppercase tracking-wide">Plan</span>
              <span className="font-bold text-neutral-900">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-neutral-400 uppercase tracking-wide">Phone</span>
              <span className="font-bold text-neutral-900">{formData.phone || '—'}</span>
            </div>
            <div className="flex justify-between text-xs border-t border-neutral-100 pt-2 mt-2">
              <span className="font-bold text-neutral-400 uppercase tracking-wide">Total</span>
              <span className="font-black text-neutral-900">₦{selectedPlan.price.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.network || !formData.phone || !formData.variation_code}
          className="w-full bg-[#e3984d] text-white font-bold py-3.5 rounded-md text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-all flex justify-center items-center gap-2 disabled:opacity-40"
        >
          {loading ? <LoadingSpinner size="sm" /> : <><Wifi size={14} /> Buy Data Bundle</>}
        </button>
      </form>

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

export default Data;
