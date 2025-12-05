// components/Bills.jsx
import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Zap, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Bills = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { balance } = useWallet();

  const billCategories = [
    { id: "electricity", name: "Electricity", icon: Zap, color: "from-yellow-400 to-yellow-600", path: "/electricity" },
    { id: "cable", name: "Cable TV", icon: Tv, color: "from-blue-400 to-blue-600", path: "/cable" },
  ];

  const handleCategorySelect = (category) => {
    const selectedCat = billCategories.find(cat => cat.id === category);
    if (selectedCat) {
      navigate(selectedCat.path);
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

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Select Bill Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
      </div>
    </div>
  );
};

export default Bills;
