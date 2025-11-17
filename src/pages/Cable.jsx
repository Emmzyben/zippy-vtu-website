// components/Cable.jsx
import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import LoadingSpinner from "../components/LoadingSpinner";
import NotificationModal from "../components/NotificationModal";
import BeneficiarySelector from "../components/BeneficiarySelector";
import { Tv, CheckCircle } from "lucide-react";
import { vtuService } from "../services/vtuService";

const Cable = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [step, setStep] = useState("provider"); // provider, verify, options, payment
  const [formData, setFormData] = useState({
    accountNumber: "",
    amount: "",
    phone: ""
  });
  const [verificationData, setVerificationData] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState("");
  const [subscriptionType, setSubscriptionType] = useState(""); // renew or change
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const { balance, refreshWallet } = useWallet();

  const providers = [
    { id: "dstv", name: "DStv", type: "subscription" },
    { id: "gotv", name: "GOtv", type: "subscription" },
    { id: "startimes", name: "StarTimes", type: "subscription" },
    { id: "showmax", name: "Showmax", type: "subscription" },
  ];

  const resetForm = () => {
    setSelectedProvider("");
    setStep("provider");
    setFormData({ accountNumber: "", amount: "", phone: "" });
    setVerificationData(null);
    setVariations([]);
    setSelectedVariation("");
    setSubscriptionType("");
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    if (provider === "dstv" || provider === "gotv") {
      setStep("verify");
    } else if (provider === "startimes" || provider === "showmax") {
      // Fetch variations for Startimes or Showmax
      setLoading(true);
      vtuService.getVariations(provider)
        .then((response) => {
          if (response.response_description === "000") {
            setVariations(response.content.variations);
            setSubscriptionType("change"); // to show variation selector
            setStep("payment");
          } else {
            throw new Error('Failed to load subscription options');
          }
        })
        .catch((err) => {
          setModalState({
            isOpen: true,
            type: 'error',
            title: 'Error',
            message: 'Failed to load subscription options.',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setStep("payment");
    }
  };

  const handleVerifySmartcard = async () => {
    if (!formData.accountNumber) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter your smartcard number.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await vtuService.verifySmartcard({
        serviceID: selectedProvider,
        billersCode: formData.accountNumber
      });

      if (response.code === "000") {
        setVerificationData(response.content);
        setStep("options");
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Verification Failed',
          message: 'Smartcard verification failed. Please check the number and try again.',
        });
      }
    } catch (err) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Verification Failed',
        message: err.message || 'Verification failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChoice = async (type) => {
    setSubscriptionType(type);

    if (type === "change") {
      // Fetch variations for bouquet change
      setLoading(true);
      try {
        const response = await vtuService.getVariations(selectedProvider);
        if (response.response_description === "000") {
          setVariations(response.content.variations);
        }
        setStep("payment");
      } catch (err) {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Error',
          message: 'Failed to load bouquet options.',
        });
      } finally {
        setLoading(false);
      }
    } else {
      // For renew, use the renewal amount from verification
      setFormData(prev => ({
        ...prev,
        amount: verificationData.Renewal_Amount || ""
      }));
      setStep("payment");
    }
  };

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (amount > balance) throw new Error("Insufficient wallet balance");

      const billData = {
        serviceID: selectedProvider,
        billersCode: formData.accountNumber,
        amount
      };

      // Add phone for DSTV/GOTV/Startimes, but not for Showmax
      if (selectedProvider !== "showmax") {
        billData.phone = formData.phone;
      }

      // Add DSTV/GOTV specific fields
      if (selectedProvider === "dstv" || selectedProvider === "gotv") {
        if (subscriptionType === "change") {
          billData.variation_code = selectedVariation;
          billData.subscription_type = "change";
        } else {
          billData.subscription_type = "renew";
        }
      }

      // Add Startimes and Showmax specific fields
      if (selectedProvider === "startimes" || selectedProvider === "showmax") {
        billData.variation_code = selectedVariation;
      }

      const response = await vtuService.payBill(billData);

      if (response.success) {
        if (response.status === "success") {
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Payment Successful',
            message: 'Bill payment successful!',
          });
          await refreshWallet();
          setTimeout(() => resetForm(), 3000);
        } else if (response.status === "pending") {
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Payment Processing',
            message: 'Payment is being processed. Check your transactions for updates.',
          });
          await refreshWallet();
          setTimeout(() => resetForm(), 3000);
        } else {
          setModalState({
            isOpen: true,
            type: 'error',
            title: 'Payment Failed',
            message: response.error || 'Payment failed.',
          });
        }
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Payment Failed',
          message: response.error || 'Payment failed.',
        });
      }
    } catch (err) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.message,
      });
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
            Cable TV Payment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pay for your DSTV, GOTV, Startimes, and Showmax subscriptions
          </p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-[#5C2D91] to-[#FF8C00] text-white rounded-2xl p-5 mb-8 shadow-lg flex items-center justify-between">
          <span className="text-lg font-medium opacity-90">Wallet Balance</span>
          <span className="text-2xl font-bold">{formatBalance(balance)}</span>
        </div>

        {/* Global Notifications */}

        {/* Step-based Form */}
        {step === "provider" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Select Cable Provider
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-[#5C2D91] hover:bg-[#5C2D91]/5 transition-all text-left"
                >
                  <div className="font-semibold text-gray-800">{provider.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{provider.type}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-800">
                Verify {selectedProvider.toUpperCase()} Smartcard
              </h3>
              <button
                onClick={() => setStep("provider")}
                className="px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Back
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Smartcard Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter your smartcard number"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                />
              </div>

              <button
                onClick={handleVerifySmartcard}
                disabled={loading || !formData.accountNumber}
                className="w-full bg-[#5C2D91] hover:bg-[#FF8C00] text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all duration-200"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Verify Smartcard"}
              </button>
            </div>
          </div>
        )}

        {step === "options" && verificationData && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-800">
                Customer Details Verified
              </h3>
              <button
                onClick={() => setStep("verify")}
                className="px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Back
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="font-semibold text-green-800">Verification Successful</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {verificationData.Customer_Name}</div>
                <div><strong>Current Bouquet:</strong> {verificationData.Current_Bouquet}</div>
                <div><strong>Due Date:</strong> {new Date(verificationData.Due_Date).toLocaleDateString()}</div>
                <div><strong>Renewal Amount:</strong> ₦{verificationData.Renewal_Amount}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">What would you like to do?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleSubscriptionChoice("renew")}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <div className="font-semibold text-gray-800">Renew Current Bouquet</div>
                  <div className="text-sm text-gray-600">₦{verificationData.Renewal_Amount}</div>
                </button>
                <button
                  onClick={() => handleSubscriptionChoice("change")}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="font-semibold text-gray-800">Change Bouquet</div>
                  <div className="text-sm text-gray-600">Select a different plan</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-800">
                {subscriptionType === "change" ? "Change Bouquet" : "Complete Payment"}
              </h3>
              <button
                onClick={() => {
                  if (selectedProvider === "dstv" || selectedProvider === "gotv") {
                    setStep(subscriptionType === "change" ? "options" : "provider");
                  } else {
                    setStep("provider");
                  }
                }}
                className="px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Back
              </button>
            </div>



            <form onSubmit={handleSubmit} className="space-y-4">
              {subscriptionType === "change" && variations.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Select New Bouquet</label>
                  <select
                    value={selectedVariation}
                    onChange={(e) => {
                      const selectedVar = variations.find(v => v.variation_code === e.target.value);
                      setSelectedVariation(e.target.value);
                      if (selectedVar) {
                        setFormData(prev => ({ ...prev, amount: selectedVar.variation_amount }));
                      }
                    }}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                  >
                    <option value="">Choose a bouquet</option>
                    {variations.map((variation) => (
                      <option key={variation.variation_code} value={variation.variation_code}>
                        {variation.name} - ₦{variation.variation_amount}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(selectedProvider === "dstv" || selectedProvider === "gotv") && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Smartcard Number</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    readOnly
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                  />
                </div>
              )}

              {(selectedProvider === "startimes" || selectedProvider === "showmax") && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{selectedProvider === "showmax" ? "Phone Number" : "Smartcard Number"}</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder={selectedProvider === "showmax" ? "Enter your phone number" : "Enter your smartcard number"}
                    required
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                  />
                </div>
              )}

              {subscriptionType !== "renew" && (
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
              )}

              {selectedProvider !== "showmax" && (
                <BeneficiarySelector
                  selectedNetwork={selectedProvider}
                  value={formData.phone}
                  onSelect={(beneficiary) => setFormData(prev => ({ ...prev, phone: beneficiary.phone_number }))}
                  onAdd={() => setModalState({
                  isOpen: true,
                  type: 'success',
                  title: 'Success',
                  message: 'Beneficiary added successfully!',
                })}
                />
              )}

              <button
                type="submit"
                disabled={loading || (subscriptionType !== "renew" && (!formData.amount || (selectedProvider !== "showmax" && !formData.phone))) || (subscriptionType === "change" && !selectedVariation) || ((selectedProvider === "startimes" || selectedProvider === "showmax") && !formData.accountNumber)}
                className="w-full bg-[#5C2D91] hover:bg-[#FF8C00] text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all duration-200"
              >
                {loading ? <LoadingSpinner size="sm" /> : `Pay ₦${formData.amount || 0}`}
              </button>
            </form>
          </div>
        )}

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

export default Cable;
