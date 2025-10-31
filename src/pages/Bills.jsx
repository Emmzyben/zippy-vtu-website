// components/Bills.jsx
import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Zap, Tv, Wifi } from "lucide-react";

const Bills = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    provider: "",
    accountNumber: "",
    amount: "",
    customerName: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { balance, processTransaction } = useWallet();

  const billCategories = [
    { id: "electricity", name: "Electricity", icon: Zap, color: "from-yellow-400 to-yellow-600" },
    { id: "cable", name: "Cable TV", icon: Tv, color: "from-blue-400 to-blue-600" },
    { id: "internet", name: "Internet", icon: Wifi, color: "from-green-400 to-green-600" },
  ];

  const providers = {
    electricity: [
      { id: "aedc", name: "AEDC (Abuja Electricity)", type: "postpaid" },
      { id: "ekedc", name: "EKEDC (Eko Electricity)", type: "postpaid" },
      { id: "iedc", name: "IEDC (Ikeja Electric)", type: "postpaid" },
      { id: "phedc", name: "PHEDC (Port Harcourt Electricity)", type: "postpaid" },
    ],
    cable: [
      { id: "dstv", name: "DStv", type: "subscription" },
      { id: "gotv", name: "GOtv", type: "subscription" },
      { id: "startimes", name: "StarTimes", type: "subscription" },
      { id: "showmax", name: "Showmax", type: "subscription" },
    ],
    internet: [
      { id: "spectranet", name: "Spectranet", type: "subscription" },
      { id: "smile", name: "Smile", type: "subscription" },
      { id: "swift", name: "Swift", type: "subscription" },
    ],
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData({
      provider: "",
      accountNumber: "",
      amount: "",
      customerName: "",
    });
  };

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const amount = parseFloat(formData.amount);
      if (amount > balance) throw new Error("Insufficient wallet balance");

      await processTransaction({
        type: "bill",
        amount,
        details: {
          category: selectedCategory,
          provider: formData.provider,
          accountNumber: formData.accountNumber,
          customerName: formData.customerName,
        },
      });

      setSuccess("✅ Bill payment successful!");
      setFormData({ provider: "", accountNumber: "", amount: "", customerName: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (amount) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FB] to-[#EDE9F7] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Pay Your Bills
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a category below to make a quick payment
          </p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-[#5C2D91] to-[#FF8C00] text-white rounded-2xl p-5 mb-8 shadow-lg flex items-center justify-between">
          <span className="text-lg font-medium opacity-90">Wallet Balance</span>
          <span className="text-2xl font-bold">{formatBalance(balance)}</span>
        </div>

        {/* Categories or Form */}
        {!selectedCategory ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Select Bill Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {billCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`relative overflow-hidden p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${cat.color} text-white group`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <Icon size={28} />
                      </div>
                      <span className="font-semibold">{cat.name}</span>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-black transition-all rounded-2xl" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-800">
                {billCategories.find((cat) => cat.id === selectedCategory)?.name} Payment
              </h3>
              <button
                onClick={() => setSelectedCategory("")}
                className="px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Change Category
              </button>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 border border-green-200 p-3 rounded-lg mb-4 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Service Provider</label>
                <select
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                >
                  <option value="">Select Provider</option>
                  {providers[selectedCategory]?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Account/Customer Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter your account number"
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="100"
                  placeholder="Enter amount"
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.provider ||
                  !formData.accountNumber ||
                  !formData.amount
                }
                className="w-full bg-[#5C2D91] hover:bg-[#FF8C00] text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all duration-200"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Pay Bill"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;
