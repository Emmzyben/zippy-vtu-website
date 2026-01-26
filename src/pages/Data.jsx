import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { vtuService } from '../services/vtuService';
import NetworkSelector from '../components/NetworkSelector';
import PhoneBeneficiarySelector from '../components/PhoneBeneficiarySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationModal from '../components/NotificationModal';

const Data = () => {
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    variation_code: '',
    amount: 0,
  });
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [activeTab, setActiveTab] = useState('Monthly');

  const { balance, refreshWallet } = useWallet();

  const networks = [
    { code: 'mtn', name: 'MTN', logo: '/assets/MTN.jpg' },
    { code: 'glo', name: 'Glo', logo: '/assets/glo.jpg' },
    { code: 'airtel', name: 'Airtel', logo: '/assets/airtel.png' },
    { code: 'etisalat', name: '9mobile', logo: '/assets/9mobile.jpeg' },
  ];

  useEffect(() => {
    if (formData.network) loadDataPlans(formData.network);
  }, [formData.network]);

  const loadDataPlans = async (network) => {
    setLoadingPlans(true);
    setDataPlans([]); // Clear old plans before fetching new ones
    try {
      const serviceMap = {
        mtn: 'mtn-data',
        glo: 'glo-data',
        airtel: 'airtel-data',
        etisalat: 'etisalat-data',
      };
      const serviceID = serviceMap[network];
      if (!serviceID) throw new Error('Invalid network selected');

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
    } catch (err) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to load data plans. Please try again.',
      });
      setDataPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNetworkChange = (network) => {
    setFormData({
      ...formData,
      network,
      variation_code: '',
      amount: 0,
    });
  };

  const handlePlanChange = (planId) => {
    const selected = dataPlans.find((plan) => plan.id === planId);
    setFormData({
      ...formData,
      variation_code: selected?.variation_code || '',
      amount: selected?.amount || 0,
    });
  };

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

    if (!formData.variation_code) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a data plan.',
      });
      setLoading(false);
      return;
    }

    const selectedPlan = dataPlans.find(
      (plan) => plan.variation_code === formData.variation_code
    );

    if (!selectedPlan) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Selected data plan is invalid.',
      });
      setLoading(false);
      return;
    }

    if (selectedPlan.price > balance) {
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

      const response = await vtuService.buyData({
        network: formData.network,
        phone: formData.phone,
        variation_code: formData.variation_code,
        amount: formData.amount,
      });

      if (response.success) {
        await refreshWallet();
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Purchase Successful',
          message: `${formData.network.toUpperCase()} data purchase successful!`,
        });
        setFormData({ network: '', phone: '', variation_code: '', amount: 0 });
      } else if (response.status === 'pending') {
        await refreshWallet();
        setModalState({
          isOpen: true,
          type: 'warning',
          title: 'Transaction Pending',
          message: 'Transaction is pending. Please wait for confirmation.',
        });
        setFormData({ network: '', phone: '', variation_code: '', amount: 0 });
      } else {
        await refreshWallet();
        throw new Error(response.error || 'Data purchase failed');
      }
    } catch (err) {
      console.error('Data purchase error:', err);
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

  const formatBalance = (amount) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

  const selectedPlan = dataPlans.find(
    (plan) => plan.variation_code === formData.variation_code
  );

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <h1 className="text-xl font-semibold text-gray-800">Buy Data</h1>
          <p className="text-gray-500 text-sm mt-1">Purchase data instantly with wallet balance</p>
        </div>

        {/* Wallet balance */}
        <div className="mb-6 bg-gradient-to-r from-[#5C2D91] to-purple-600 text-white p-4 rounded-2xl shadow-md flex justify-between items-center">
          <span className="text-sm opacity-90">Wallet Balance</span>
          <span className="text-2xl font-semibold">{formatBalance(balance)}</span>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-2xl shadow-sm border space-y-6"
        >
          <NetworkSelector
            value={formData.network}
            onChange={handleNetworkChange}
            networks={networks}
          />

          <PhoneBeneficiarySelector
            value={formData.phone}
            onSelect={(phone) =>
              setFormData({ ...formData, phone })
            }
            onAdd={() => setModalState({
              isOpen: true,
              type: 'success',
              title: 'Success',
              message: 'Beneficiary added successfully!',
            })}
          />

          {/* Validity Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl">
            {['Daily', 'Weekly', 'Monthly', 'Special Plans'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                  ? 'bg-[#5C2D91] text-white shadow-md'
                  : 'text-gray-500 hover:text-[#5C2D91] hover:bg-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Data Plans */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Data Plan
            </label>

            {loadingPlans ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid gap-3">
                {dataPlans
                  .filter(plan => {
                    const name = plan.name.toLowerCase();
                    const getDays = (n) => {
                      if (n.includes('month')) {
                        const m = n.match(/(\d+)\s*month/);
                        return m ? parseInt(m[1]) * 30 : 30;
                      }
                      if (n.includes('week')) {
                        const w = n.match(/(\d+)\s*week/);
                        return w ? parseInt(w[1]) * 7 : 7;
                      }
                      const d = n.match(/(\d+)\s*day/);
                      if (d) return parseInt(d[1]);
                      return null;
                    };

                    const days = getDays(name);
                    if (activeTab === 'Daily') return days !== null && days >= 1 && days <= 5;
                    if (activeTab === 'Weekly') return days !== null && days > 5 && days <= 7;
                    if (activeTab === 'Monthly') return days !== null && days > 7;
                    if (activeTab === 'Special Plans') return days === null;
                    return true;
                  })
                  .map((plan) => (
                    <label
                      key={plan.id}
                      className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-all ${formData.variation_code === plan.variation_code
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-400 hover:bg-gray-50'
                        }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={formData.variation_code === plan.variation_code}
                        onChange={(e) => handlePlanChange(e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <p className="font-medium">{plan.data}</p>
                        <p className="text-sm text-gray-500">{plan.validity}</p>
                      </div>
                      <span className="font-semibold">₦{plan.price}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {selectedPlan && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-1 text-sm">
              <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
              <div className="flex justify-between">
                <span>Data Plan:</span>
                <span>{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone Number:</span>
                <span>{formData.phone}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Amount:</span>
                <span>₦{selectedPlan.price}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.network || !formData.phone || !formData.variation_code}
            className="w-full mt-6 bg-[#5C2D91] text-white font-semibold py-3 rounded-lg hover:bg-[#4A1F7C] transition-all shadow-md hover:shadow-lg flex justify-center items-center"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Buy Data'}
          </button>
        </form>

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

export default Data;
