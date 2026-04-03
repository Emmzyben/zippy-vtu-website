import { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import PhoneBeneficiarySelector from "../../components/PhoneBeneficiarySelector";
import NotificationModal from "../../components/NotificationModal";
import TokenModal from "../../components/TokenModal";
import { Zap, ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { vtuService } from "../../services/vtuService";

const inputClass = "w-full bg-neutral-50 border border-neutral-100 focus:border-neutral-400 focus:bg-white rounded-md p-3 font-bold text-neutral-900 outline-none text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const labelClass = "text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2";

const Electricity = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedMeterType, setSelectedMeterType] = useState("");
  const [meterVerified, setMeterVerified] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [formData, setFormData] = useState({ accountNumber: "", amount: "", phone: "", customerName: "" });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [tokenModalState, setTokenModalState] = useState({ isOpen: false, token: '', meterNumber: '', customerName: '', amount: 0 });
  const { balance, refreshWallet } = useWallet();

  const providers = [
    { id: "abuja-electric", name: "AEDC", description: "Abuja Electricity Distribution" },
    { id: "eko-electric", name: "EKEDC", description: "Eko Electricity Distribution" },
    { id: "ikeja-electric", name: "IKEDC", description: "Ikeja Electricity Distribution" },
    { id: "portharcourt-electric", name: "PHEDC", description: "Port Harcourt Electricity" },
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const formatBalance = (amount) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const handleVerify = async () => {
    if (!formData.accountNumber) {
      setModalState({ isOpen: true, type: 'error', title: 'Required', message: 'Enter meter number first.' }); return;
    }
    setVerifying(true);
    try {
      const response = await vtuService.verifyMeter({ serviceID: selectedProvider, billersCode: formData.accountNumber, type: selectedMeterType });
      if (response?.content?.Customer_Name) {
        setCustomerInfo(response.content);
        setMeterVerified(true);
        setModalState({ isOpen: true, type: 'success', title: 'Meter Verified', message: 'Meter verified successfully!' });
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Verification Failed', message: response?.error || 'Invalid meter number.' });
      }
    } catch (err) {
      setModalState({ isOpen: true, type: 'error', title: 'Verification Failed', message: err.message });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amount = parseFloat(formData.amount);
      if (amount > balance) throw new Error("Insufficient wallet balance");
      const response = await vtuService.payBill({
        serviceID: selectedProvider, billersCode: formData.accountNumber,
        variation_code: selectedMeterType, amount, phone: formData.phone
      });
      if (response.success && response.status === "success") {
        if (selectedMeterType === "prepaid" && response.token) {
          setTokenModalState({ isOpen: true, token: response.token, meterNumber: formData.accountNumber, customerName: customerInfo?.Customer_Name || formData.customerName, amount: parseFloat(formData.amount) });
        } else {
          setModalState({ isOpen: true, type: 'success', title: 'Payment Successful', message: 'Bill payment confirmed!' });
        }
        await refreshWallet();
        setFormData({ accountNumber: "", amount: "", phone: "", customerName: "" });
        setMeterVerified(false); setCustomerInfo(null);
      } else if (response.status === "pending") {
        setModalState({ isOpen: true, type: 'warning', title: 'Payment Pending', message: 'Processing your payment. Check transactions for updates.' });
        await refreshWallet();
        setFormData({ accountNumber: "", amount: "", phone: "", customerName: "" });
        setMeterVerified(false); setCustomerInfo(null);
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Payment Failed', message: response.error || "Payment failed" });
      }
    } catch (err) {
      setModalState({ isOpen: true, type: 'error', title: 'Error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-10 mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Electricity</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Pay utility bills quickly and securely</p>
      </div>

      {/* Balance Strip */}
      <div className="bg-[#e3984d] text-white rounded-lg p-5 flex items-center justify-between mb-8 shadow-sm">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Wallet Balance</p>
        <p className="text-lg font-black tracking-tight">{formatBalance(balance)}</p>
      </div>

      {/* Step 1 — Provider */}
      {!selectedProvider && (
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-50">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select Provider</p>
          </div>
          <div className="divide-y divide-neutral-50">
            {providers.map((p) => (
              <button key={p.id} onClick={() => setSelectedProvider(p.id)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors group text-left">
                <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-[#e3984d] group-hover:text-white group-hover:border-[#e3984d] transition-all shrink-0">
                  <Zap size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-neutral-900 text-xs uppercase tracking-tight">{p.name}</p>
                  <p className="text-[10px] font-medium text-neutral-400">{p.description}</p>
                </div>
                <ChevronRight size={14} className="text-neutral-300 group-hover:text-neutral-900 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Meter Type */}
      {selectedProvider && !selectedMeterType && (
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select Meter Type</p>
            <button onClick={() => setSelectedProvider("")} className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors">
              <ArrowLeft size={12} /> Change
            </button>
          </div>
          <div className="divide-y divide-neutral-50">
            {[
              { id: 'prepaid', name: 'Prepaid Meter', desc: 'Receive token after payment' },
              { id: 'postpaid', name: 'Postpaid Meter', desc: 'Clear outstanding balance' }
            ].map(m => (
              <button key={m.id} onClick={() => setSelectedMeterType(m.id)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors group text-left">
                <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-[#e3984d] group-hover:text-white group-hover:border-[#e3984d] transition-all shrink-0">
                  <Zap size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-neutral-900 text-xs uppercase tracking-tight">{m.name}</p>
                  <p className="text-[10px] font-medium text-neutral-400">{m.desc}</p>
                </div>
                <ChevronRight size={14} className="text-neutral-300 group-hover:text-neutral-900 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Payment Form */}
      {selectedProvider && selectedMeterType && (
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {providers.find(p => p.id === selectedProvider)?.name} — {selectedMeterType}
            </p>
            <button onClick={() => setSelectedMeterType("")} className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors">
              <ArrowLeft size={12} /> Change
            </button>
          </div>

          {/* Meter number + verify */}
          <div>
            <label className={labelClass}>Meter / Account Number</label>
            <div className="flex gap-2">
              <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter meter number" required disabled={meterVerified} className={inputClass} />
              {!meterVerified && (
                <button type="button" onClick={handleVerify} disabled={verifying || !formData.accountNumber} className="bg-[#e3984d] text-white px-4 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-colors disabled:opacity-40 shrink-0">
                  {verifying ? <LoadingSpinner size="sm" /> : 'Verify'}
                </button>
              )}
            </div>
          </div>

          {/* Verified customer info */}
          {meterVerified && customerInfo && (
            <div className="bg-green-50 border border-green-100 rounded-md p-4 flex items-start gap-3">
              <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Meter Verified</p>
                <p className="text-xs font-bold text-green-700">{customerInfo.Customer_Name}</p>
                <p className="text-[10px] text-green-600">{customerInfo.Address}</p>
              </div>
            </div>
          )}

          {!meterVerified && (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Verify your meter number before proceeding with payment.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Amount (₦)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="100" placeholder="Enter amount" required className={inputClass} />
            </div>

            <PhoneBeneficiarySelector
              value={formData.phone}
              onSelect={(phone) => setFormData({ ...formData, phone })}
              onAdd={() => setModalState({ isOpen: true, type: 'success', title: 'Success', message: 'Beneficiary added!' })}
            />

            <div>
              <label className={labelClass}>Customer Name (Optional)</label>
              <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Enter customer name" className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.accountNumber || !formData.amount || !formData.phone || !meterVerified}
              className="w-full bg-[#e3984d] text-white font-bold py-3.5 rounded-md text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-all flex justify-center items-center gap-2 disabled:opacity-40"
            >
              {loading ? <LoadingSpinner size="sm" /> : <><Zap size={14} /> Pay ₦{formData.amount || '0'}</>}
            </button>
          </form>
        </div>
      )}

      <NotificationModal isOpen={modalState.isOpen} onClose={() => setModalState({ ...modalState, isOpen: false })} type={modalState.type} title={modalState.title} message={modalState.message} />
      <TokenModal isOpen={tokenModalState.isOpen} onClose={() => setTokenModalState({ ...tokenModalState, isOpen: false })} token={tokenModalState.token} meterNumber={tokenModalState.meterNumber} customerName={tokenModalState.customerName} amount={tokenModalState.amount} />
    </div>
  );
};

export default Electricity;
