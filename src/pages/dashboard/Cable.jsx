import { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotificationModal from "../../components/NotificationModal";
import PhoneBeneficiarySelector from "../../components/PhoneBeneficiarySelector";
import { Tv, ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { vtuService } from "../../services/vtuService";

const inputClass = "w-full bg-neutral-50 border border-neutral-100 focus:border-neutral-400 focus:bg-white rounded-md p-3 font-bold text-neutral-900 outline-none text-xs transition-all";
const readOnlyClass = "w-full bg-neutral-100 border border-neutral-100 rounded-md p-3 font-bold text-neutral-500 outline-none text-xs cursor-not-allowed";
const labelClass = "text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2";

const Cable = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [step, setStep] = useState("provider");
  const [formData, setFormData] = useState({ accountNumber: "", amount: "", phone: "" });
  const [verificationData, setVerificationData] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const { balance, refreshWallet } = useWallet();

  const providers = [
    { id: "dstv", name: "DStv", description: "Premium satellite television" },
    { id: "gotv", name: "GOtv", description: "Affordable digital cable TV" },
    { id: "startimes", name: "StarTimes", description: "Digital TV subscription" },
    { id: "showmax", name: "Showmax", description: "Streaming subscription" },
  ];

  const formatBalance = (amount) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  const resetForm = () => {
    setSelectedProvider(""); setStep("provider");
    setFormData({ accountNumber: "", amount: "", phone: "" });
    setVerificationData(null); setVariations([]); setSelectedVariation(""); setSubscriptionType("");
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    if (provider === "dstv" || provider === "gotv") {
      setStep("verify");
    } else {
      setLoading(true);
      vtuService.getVariations(provider)
        .then((response) => {
          if (response.response_description === "000") {
            setVariations(response.content.variations);
            setSubscriptionType("change");
            setStep("payment");
          } else throw new Error('Failed to load subscription options');
        })
        .catch(() => setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to load subscription options.' }))
        .finally(() => setLoading(false));
    }
  };

  const handleVerifySmartcard = async () => {
    if (!formData.accountNumber) {
      setModalState({ isOpen: true, type: 'error', title: 'Required', message: 'Enter your smartcard number.' }); return;
    }
    setLoading(true);
    try {
      const response = await vtuService.verifySmartcard({ serviceID: selectedProvider, billersCode: formData.accountNumber });
      if (response.code === "000") {
        setVerificationData(response.content); setStep("options");
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Verification Failed', message: 'Smartcard verification failed. Check number and retry.' });
      }
    } catch (err) {
      setModalState({ isOpen: true, type: 'error', title: 'Verification Failed', message: err.message || 'Verification failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChoice = async (type) => {
    setSubscriptionType(type);
    if (type === "change") {
      setLoading(true);
      try {
        const response = await vtuService.getVariations(selectedProvider);
        if (response.response_description === "000") setVariations(response.content.variations);
        setStep("payment");
      } catch {
        setModalState({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to load bouquet options.' });
      } finally { setLoading(false); }
    } else {
      setFormData(prev => ({ ...prev, amount: verificationData.Renewal_Amount || "" }));
      setStep("payment");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const amount = parseFloat(formData.amount);
      if (amount > balance) throw new Error("Insufficient wallet balance");

      const billData = { serviceID: selectedProvider, billersCode: formData.accountNumber, amount };
      if (selectedProvider !== "showmax") billData.phone = formData.phone;
      if (selectedProvider === "dstv" || selectedProvider === "gotv") {
        if (subscriptionType === "change") { billData.variation_code = selectedVariation; billData.subscription_type = "change"; }
        else billData.subscription_type = "renew";
      }
      if (selectedProvider === "startimes" || selectedProvider === "showmax") billData.variation_code = selectedVariation;

      const response = await vtuService.payBill(billData);
      if (response.success && (response.status === "success" || response.status === "pending")) {
        setModalState({ isOpen: true, type: 'success', title: response.status === 'success' ? 'Payment Successful' : 'Payment Processing', message: response.status === 'success' ? 'Subscription activated!' : 'Processing. Check transactions for updates.' });
        await refreshWallet();
        setTimeout(() => resetForm(), 3000);
      } else {
        setModalState({ isOpen: true, type: 'error', title: 'Payment Failed', message: response.error || 'Payment failed.' });
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
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Cable TV</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">DStv, GOtv, StarTimes & Showmax subscriptions</p>
      </div>

      {/* Balance Strip */}
      <div className="bg-[#e3984d] text-white rounded-lg p-5 flex items-center justify-between mb-8 shadow-sm">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Wallet Balance</p>
        <p className="text-lg font-black tracking-tight">{formatBalance(balance)}</p>
      </div>

      {loading && step === "provider" && (
        <div className="flex justify-center py-8"><LoadingSpinner /></div>
      )}

      {/* Step: Provider */}
      {step === "provider" && !loading && (
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-50">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select Provider</p>
          </div>
          <div className="divide-y divide-neutral-50">
            {providers.map((p) => (
              <button key={p.id} onClick={() => handleProviderSelect(p.id)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors group text-left">
                <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-[#e3984d] group-hover:text-white group-hover:border-[#e3984d] transition-all shrink-0">
                  <Tv size={16} />
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

      {/* Step: Verify Smartcard */}
      {step === "verify" && (
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Verify {selectedProvider.toUpperCase()} Smartcard</p>
            <button onClick={() => setStep("provider")} className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors">
              <ArrowLeft size={12} /> Back
            </button>
          </div>
          <div>
            <label className={labelClass}>Smartcard Number</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter your smartcard number" className={inputClass} />
          </div>
          <button
            onClick={handleVerifySmartcard}
            disabled={loading || !formData.accountNumber}
            className="w-full bg-[#e3984d] text-white font-bold py-3.5 rounded-md text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-all flex justify-center items-center gap-2 disabled:opacity-40"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Verify Smartcard"}
          </button>
        </div>
      )}

      {/* Step: Options (Renew or Change) */}
      {step === "options" && verificationData && (
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Subscription Options</p>
            <button onClick={() => setStep("verify")} className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors">
              <ArrowLeft size={12} /> Back
            </button>
          </div>

          {/* Customer Info */}
          <div className="bg-green-50 border border-green-100 rounded-md p-4 flex items-start gap-3">
            <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Verified</p>
              <p className="text-xs font-bold text-green-800">{verificationData.Customer_Name}</p>
              <p className="text-[10px] text-green-700">Bouquet: {verificationData.Current_Bouquet}</p>
              <p className="text-[10px] text-green-700">Due: {new Date(verificationData.Due_Date).toLocaleDateString()}</p>
              <p className="text-[10px] text-green-700">Renewal: ₦{verificationData.Renewal_Amount}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleSubscriptionChoice("renew")} className="flex flex-col gap-1 p-4 border border-neutral-100 rounded-md hover:border-[#e3984d] hover:bg-neutral-50 transition-all text-left">
              <p className="font-bold text-neutral-900 text-xs uppercase tracking-tight">Renew</p>
              <p className="text-[10px] text-neutral-400">₦{verificationData.Renewal_Amount}</p>
            </button>
            <button onClick={() => handleSubscriptionChoice("change")} className="flex flex-col gap-1 p-4 border border-neutral-100 rounded-md hover:border-[#e3984d] hover:bg-neutral-50 transition-all text-left">
              <p className="font-bold text-neutral-900 text-xs uppercase tracking-tight">Change Bouquet</p>
              <p className="text-[10px] text-neutral-400">Select new plan</p>
            </button>
          </div>
        </div>
      )}

      {/* Step: Payment */}
      {step === "payment" && (
        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {subscriptionType === "change" ? "Change Bouquet" : "Complete Payment"}
            </p>
            <button
              onClick={() => {
                if (selectedProvider === "dstv" || selectedProvider === "gotv") {
                  setStep(subscriptionType === "change" ? "options" : "provider");
                } else { setStep("provider"); }
              }}
              className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft size={12} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Bouquet selector for change */}
            {subscriptionType === "change" && variations.length > 0 && (
              <div>
                <label className={labelClass}>Select New Bouquet</label>
                <select
                  value={selectedVariation}
                  onChange={(e) => {
                    const v = variations.find(x => x.variation_code === e.target.value);
                    setSelectedVariation(e.target.value);
                    if (v) setFormData(prev => ({ ...prev, amount: v.variation_amount }));
                  }}
                  required
                  className={inputClass}
                >
                  <option value="">Choose a bouquet</option>
                  {variations.map((v) => (
                    <option key={v.variation_code} value={v.variation_code}>
                      {v.name} — ₦{v.variation_amount}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Smartcard (read-only for dstv/gotv) */}
            {(selectedProvider === "dstv" || selectedProvider === "gotv") && (
              <div>
                <label className={labelClass}>Smartcard Number</label>
                <input type="text" value={formData.accountNumber} readOnly className={readOnlyClass} />
              </div>
            )}

            {/* Smartcard/phone for startimes/showmax */}
            {(selectedProvider === "startimes" || selectedProvider === "showmax") && (
              <div>
                <label className={labelClass}>{selectedProvider === "showmax" ? "Phone Number" : "Smartcard Number"}</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder={selectedProvider === "showmax" ? "Phone number" : "Smartcard number"} required className={inputClass} />
              </div>
            )}

            {/* Amount (hidden for renew since it's pre-filled) */}
            {subscriptionType !== "renew" && (
              <div>
                <label className={labelClass}>Amount (₦)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} min="100" placeholder="Enter amount" required className={inputClass} />
              </div>
            )}

            {subscriptionType === "renew" && (
              <div className="bg-neutral-50 border border-neutral-100 rounded-md p-4 flex justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Renewal Amount</span>
                <span className="text-xs font-black text-neutral-900">₦{formData.amount}</span>
              </div>
            )}

            {selectedProvider !== "showmax" && (
              <PhoneBeneficiarySelector
                value={formData.phone}
                onSelect={(phone) => setFormData(prev => ({ ...prev, phone }))}
                onAdd={() => setModalState({ isOpen: true, type: 'success', title: 'Success', message: 'Beneficiary added!' })}
              />
            )}

            <button
              type="submit"
              disabled={
                loading ||
                (subscriptionType !== "renew" && (!formData.amount || (selectedProvider !== "showmax" && !formData.phone))) ||
                (subscriptionType === "change" && !selectedVariation) ||
                ((selectedProvider === "startimes" || selectedProvider === "showmax") && !formData.accountNumber)
              }
              className="w-full bg-[#e3984d] text-white font-bold py-3.5 rounded-md text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-all flex justify-center items-center gap-2 disabled:opacity-40"
            >
              {loading ? <LoadingSpinner size="sm" /> : <><Tv size={14} /> Pay ₦{formData.amount || '0'}</>}
            </button>
          </form>
        </div>
      )}

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

export default Cable;
