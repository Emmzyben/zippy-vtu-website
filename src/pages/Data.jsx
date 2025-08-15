import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { vtuService } from '../services/vtuService';
import NetworkSelector from '../components/NetworkSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const Data = () => {
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    plan: ''
  });
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { balance, processTransaction } = useWallet();

  const networks = [
    { code: 'mtn', name: 'MTN', logo: 'https://i.ibb.co/C3tdr1Z4/mtn.png' },
    { code: 'glo', name: 'Glo', logo: 'https://i.ibb.co/mFrFmfPT/glo.jpg' },
    { code: 'airtel', name: 'Airtel', logo: 'https://i.ibb.co/Wv8t0NGk/airtel.png' },
    { code: '9mobile', name: '9mobile', logo: 'https://i.ibb.co/Sw5Rc7KY/9mobile.png' }
  ];

  // Mock data plans for demo
  const mockPlans = {
    mtn: [
      { id: 'mtn-1gb', name: '1GB - 30 Days', price: 350, data: '1GB', validity: '30 Days' },
      { id: 'mtn-2gb', name: '2GB - 30 Days', price: 700, data: '2GB', validity: '30 Days' },
      { id: 'mtn-5gb', name: '5GB - 30 Days', price: 1500, data: '5GB', validity: '30 Days' },
      { id: 'mtn-10gb', name: '10GB - 30 Days', price: 2500, data: '10GB', validity: '30 Days' }
    ],
    glo: [
      { id: 'glo-1gb', name: '1GB - 30 Days', price: 350, data: '1GB', validity: '30 Days' },
      { id: 'glo-2gb', name: '2GB - 30 Days', price: 700, data: '2GB', validity: '30 Days' },
      { id: 'glo-5gb', name: '5GB - 30 Days', price: 1500, data: '5GB', validity: '30 Days' },
      { id: 'glo-10gb', name: '10GB - 30 Days', price: 2500, data: '10GB', validity: '30 Days' }
    ],
    airtel: [
      { id: 'airtel-1gb', name: '1GB - 30 Days', price: 350, data: '1GB', validity: '30 Days' },
      { id: 'airtel-2gb', name: '2GB - 30 Days', price: 700, data: '2GB', validity: '30 Days' },
      { id: 'airtel-5gb', name: '5GB - 30 Days', price: 1500, data: '5GB', validity: '30 Days' },
      { id: 'airtel-10gb', name: '10GB - 30 Days', price: 2500, data: '10GB', validity: '30 Days' }
    ],
    '9mobile': [
      { id: '9mobile-1gb', name: '1GB - 30 Days', price: 350, data: '1GB', validity: '30 Days' },
      { id: '9mobile-2gb', name: '2GB - 30 Days', price: 700, data: '2GB', validity: '30 Days' },
      { id: '9mobile-5gb', name: '5GB - 30 Days', price: 1500, data: '5GB', validity: '30 Days' },
      { id: '9mobile-10gb', name: '10GB - 30 Days', price: 2500, data: '10GB', validity: '30 Days' }
    ]
  };

  useEffect(() => {
    if (formData.network) {
      loadDataPlans(formData.network);
    }
  }, [formData.network]);

  const loadDataPlans = async (network) => {
    setLoadingPlans(true);
    try {
      // For demo, use mock data
      setDataPlans(mockPlans[network] || []);
    } catch (err) {
      setError('Failed to load data plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNetworkChange = (network) => {
    setFormData({
      ...formData,
      network,
      plan: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selectedPlan = dataPlans.find(plan => plan.id === formData.plan);
      
      if (!selectedPlan) {
        throw new Error('Please select a data plan');
      }

      if (selectedPlan.price > balance) {
        throw new Error('Insufficient wallet balance');
      }

      await processTransaction({
        type: 'data',
        amount: selectedPlan.price,
        details: {
          network: formData.network,
          phone: formData.phone,
          plan: selectedPlan.name
        }
      });

      setSuccess('Data purchase successful!');
      setFormData({ network: '', phone: '', plan: '' });
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

  const selectedPlan = dataPlans.find(plan => plan.id === formData.plan);

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
            Buy Data
          </h1>
          <p className="text-neutral-600">
            Purchase data bundles for your phone
          </p>
        </div>

        <div className="card mb-6 bg-[#5C2D91] text-[#fff] p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-white-600">Wallet Balance</span>
            <span className="text-xl font-semibold text-primary">
              {formatBalance(balance)}
            </span>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
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

            <NetworkSelector
              value={formData.network}
              onChange={handleNetworkChange}
              networks={networks}
            />

            <div className="form-group mt-4 mb-4">
              <label htmlFor="phone" className="form-label">
              Enter phone number or  <button className=' text-[#FF8C00] font-semibold'>Select from beneficiaries</button>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                 className="form-input border border-neutral-300 p-2 mb-2 w-full rounded-lg focus:bg-[#dae2f0ff]"
                placeholder="08012345678"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Data Plan</label>
              {loadingPlans ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-2">
                  {dataPlans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.plan === plan.id
                          ? 'border-[#5C2D91] bg-[#5C2D91] bg-opacity-10'
                          : 'border-[#5C2D91]  hover:border-[#5C2D91] hover:bg-[#5C2D91] hover:text-[#FF8C00]'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="plan"
                          value={plan.id}
                          checked={formData.plan === plan.id}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div>
                          <p className="font-medium">{plan.data}</p>
                          <p className="text-sm text-[#FF8C00]">{plan.validity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        ₦{plan.price}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {selectedPlan && (
              <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-neutral-800 mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm">
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
                <button className='mt-3 bg-[#FF8C00] text-[#fff] p-2 rounded-lg'>Add Number to beneficiaries</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.network || !formData.phone || !formData.plan}
                    className="w-full bg-[#5C2D91] text-white font-semibold py-3 rounded-lg hover:bg-[#FF8C00]  flex justify-center items-center transition"
             
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Buy Data'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Data;