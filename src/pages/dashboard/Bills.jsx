import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";
import { Zap, Tv, ChevronRight } from "lucide-react";

const Bills = () => {
  const navigate = useNavigate();
  const { balance } = useWallet();

  const formatBalance = (amount) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const billCategories = [
    { id: "electricity", name: "Electricity", description: "PHCN prepaid & postpaid tokens", icon: Zap, path: "/electricity" },
    { id: "cable", name: "Cable TV", description: "DSTV, GOtv, Startimes subscriptions", icon: Tv, path: "/cable" },
  ];

  return (
    <div className="p-4 lg:p-10 mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Bill Payments</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Settle your utility and subscription bills</p>
      </div>

      {/* Balance Strip */}
      <div className="bg-[#e3984d] text-white rounded-lg p-5 flex items-center justify-between mb-8 shadow-sm">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Wallet Balance</p>
        <p className="text-lg font-black tracking-tight">{formatBalance(balance)}</p>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-50">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select Category</p>
        </div>
        <div className="divide-y divide-neutral-50">
          {billCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(cat.path)}
                className="w-full flex items-center gap-4 px-6 py-5 hover:bg-neutral-50 transition-colors group text-left"
              >
                <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-[#e3984d] group-hover:text-white group-hover:border-[#e3984d] transition-all shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-900 text-sm uppercase tracking-tight">{cat.name}</p>
                  <p className="text-[10px] font-medium text-neutral-400 mt-0.5 uppercase tracking-wide">{cat.description}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-900 transition-colors shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bills;
