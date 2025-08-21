import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { vtuService } from '../services/vtuService';
import NetworkSelector from '../components/NetworkSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const Airtime = () => {
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { balance, processTransaction } = useWallet();

  const networks = [
    { code: 'mtn', name: 'MTN', logo: 'https://i.ibb.co/C3tdr1Z4/mtn.png' },
    { code: 'glo', name: 'Glo', logo: 'https://i.ibb.co/mFrFmfPT/glo.jpg' },
    { code: 'airtel', name: 'Airtel', logo: 'https://i.ibb.co/Wv8t0NGk/airtel.png' },
    { code: '9mobile', name: '9mobile', logo: 'https://i.ibb.co/Sw5Rc7KY/9mobile.png' }
  ];
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNetworkChange = (network) => {
    setFormData({
      ...formData,
      network
    });
  };

  const handleQuickAmount = (amount) => {
    setFormData({
      ...formData,
      amount: amount.toString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const amount = parseFloat(formData.amount);
      
      if (amount > balance) {
        throw new Error('Insufficient wallet balance');
      }

      await processTransaction({
        type: 'airtime',
        amount,
        details: {
          network: formData.network,
          phone: formData.phone
        }
      });

      setSuccess('Airtime purchase successful!');
      setFormData({ network: '', phone: '', amount: '' });
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
          <h1 className="text-1xl lg:text-2xl font-bold text-neutral-800 mb-2">
            Buy Airtime
          </h1>
       
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
              <label className="form-label">Amount</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className={`py-2 px-4 rounded-lg border transition-colors ${
                      formData.amount === amount.toString()
                       ? 'border-[#5C2D91] bg-[#5C2D91] text-white'
                            : 'border-neutral-200 hover:border-[#5C2D91]'
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
                 className="form-input border border-neutral-300 p-2 mb-2 w-full rounded-lg focus:bg-[#dae2f0ff]"
                placeholder="Enter amount"
                min="50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.network || !formData.phone || !formData.amount}
                    className="w-full bg-[#5C2D91] text-white font-semibold py-3 rounded-lg hover:bg-[#FF8C00]  flex justify-center items-center transition"
             
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Buy Airtime'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Airtime;