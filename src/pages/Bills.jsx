import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Zap, Tv, Wifi } from 'lucide-react';

const Bills = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    provider: '',
    accountNumber: '',
    amount: '',
    customerName: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { balance, processTransaction } = useWallet();

  const billCategories = [
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'bg-white-500' },
    { id: 'cable', name: 'Cable TV', icon: Tv, color: 'bg-white-500' },
    { id: 'internet', name: 'Internet', icon: Wifi, color: 'bg-white-500' }
  ];

  const providers = {
    electricity: [
      { id: 'aedc', name: 'AEDC (Abuja Electricity)', type: 'postpaid' },
      { id: 'ekedc', name: 'EKEDC (Eko Electricity)', type: 'postpaid' },
      { id: 'iedc', name: 'IEDC (Ikeja Electric)', type: 'postpaid' },
      { id: 'phedc', name: 'PHEDC (Port Harcourt Electricity)', type: 'postpaid' }
    ],
    cable: [
      { id: 'dstv', name: 'DStv', type: 'subscription' },
      { id: 'gotv', name: 'GOtv', type: 'subscription' },
      { id: 'startimes', name: 'StarTimes', type: 'subscription' },
      { id: 'showmax', name: 'Showmax', type: 'subscription' }
    ],
    internet: [
      { id: 'spectranet', name: 'Spectranet', type: 'subscription' },
      { id: 'smile', name: 'Smile', type: 'subscription' },
      { id: 'swift', name: 'Swift', type: 'subscription' }
    ],
 
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData({
      provider: '',
      accountNumber: '',
      amount: '',
      customerName: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        type: 'bill',
        amount,
        details: {
          category: selectedCategory,
          provider: formData.provider,
          accountNumber: formData.accountNumber,
          customerName: formData.customerName
        }
      });

      setSuccess('Bill payment successful!');
      setFormData({ provider: '', accountNumber: '', amount: '', customerName: '' });
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
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
            Pay Bills
          </h1>
          <p className="text-neutral-600">
            Pay your electricity, cable TV, internet, and water bills
          </p>
        </div>

        <div className="card mb-6 bg-[#5C2D91] text-[#fff] p-2 rounded">
          <div className="flex items-center justify-between">
            <span className="text-white-600">Wallet Balance</span>
            <span className="text-xl font-semibold text-primary">
              {formatBalance(balance)}
            </span>
          </div>
        </div>

        {!selectedCategory ? (
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Select Bill Category
            </h3>
            <div className="grid grid-cols gap-2">
              {billCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`${category.color} text-gray-600 p-6 border border-[#FF8C00] hover:bg-[#5C2D91] hover:text-[#FF8C00] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-white bg-opacity-20 rounded-full border border-[#FF8C00]">
                        <IconComponent size={24} />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                {billCategories.find(cat => cat.id === selectedCategory)?.name} Payment
              </h3>
              <button
                onClick={() => setSelectedCategory('')}
                className="bg-[#FF8C00] text-[#000] p-2 rounded-lg hover:bg-[#5C2D91] hover:text-[#fff]"
              >
                Change Category
              </button>
            </div>

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

              <div className="form-group">
                <label htmlFor="provider" className="form-label">
                  Service Provider
                </label>
                <select
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                   className="form-input border border-neutral-300 p-2 mb-2 w-full rounded-lg focus:bg-[#dae2f0ff]"
                  required
                >
                  <option value="">Select Provider</option>
                  {providers[selectedCategory]?.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="accountNumber" className="form-label">
                  Account/Customer Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                   className="form-input border border-neutral-300 p-2 mb-2 w-full rounded-lg focus:bg-[#dae2f0ff]"
                  placeholder="Enter your account number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                   className="form-input border border-neutral-300 p-2 mb-2 w-full rounded-lg focus:bg-[#dae2f0ff]"
                  placeholder="Enter amount"
                  min="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="customerName" className="form-label">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                   className="form-input border border-neutral-300 p-2 mb-2 w-full rounded-lg focus:bg-[#dae2f0ff]"
                  placeholder="Enter customer name"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.provider || !formData.accountNumber || !formData.amount}
                    className="w-full bg-[#5C2D91] text-white font-semibold py-3 rounded-lg hover:bg-[#FF8C00]  flex justify-center items-center transition mt-2"
             
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Pay Bill'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;