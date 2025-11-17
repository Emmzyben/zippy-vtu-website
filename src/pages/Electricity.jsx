// components/Electricity.jsx
import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import LoadingSpinner from "../components/LoadingSpinner";
import BeneficiarySelector from "../components/BeneficiarySelector";
import NotificationModal from "../components/NotificationModal";
import { Zap } from "lucide-react";
import { vtuService } from "../services/vtuService";

const Electricity = () => {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedMeterType, setSelectedMeterType] = useState("");
  const [meterVerified, setMeterVerified] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [formData, setFormData] = useState({
    accountNumber: "",
    amount: "",
    phone: "",
    customerName: "",
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [token, setToken] = useState("");

  const { balance, refreshWallet } = useWallet();

  const providers = [
    { id: "abuja-electric", name: "AEDC (Abuja Electricity)", type: "prepaid/postpaid" },
    { id: "eko-electric", name: "EKEDC (Eko Electricity)", type: "prepaid/postpaid" },
    { id: "ikeja-electric", name: "IKEDC (Ikeja Electricity)", type: "prepaid/postpaid" },
    { id: "portharcourt-electric", name: "PHEDC (Port Harcourt Electricity)", type: "prepaid/postpaid" },
  ];

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
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
        variation_code: selectedMeterType,
        amount,
        phone: formData.phone
      };

      const response = await vtuService.payBill(billData);

      if (response.success) {
        if (response.status === "success") {
          let successMessage = "Bill payment successful!";
          if (selectedMeterType === "prepaid" && response.token) {
            setToken(response.token);
            successMessage += `\n\nYour Token: ${response.token}`;
          }
          setModalState({
            isOpen: true,
            type: 'success',
            title: 'Payment Successful',
            message: successMessage
          });
          await refreshWallet();
          setFormData({ accountNumber: "", amount: "", phone: "", customerName: "" });
          setMeterVerified(false);
          setCustomerInfo(null);
        } else if (response.status === "pending") {
          setModalState({
            isOpen: true,
            type: 'warning',
            title: 'Payment Pending',
            message: 'Payment is being processed. Check your transactions for updates.'
          });
          await refreshWallet();
          setFormData({ accountNumber: "", amount: "", phone: "", customerName: "" });
          setMeterVerified(false);
          setCustomerInfo(null);
        } else {
          setModalState({
            isOpen: true,
            type: 'error',
            title: 'Payment Failed',
            message: response.error || "Payment failed"
          });
        }
      } else {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Payment Failed',
          message: response.error || "Payment failed"
        });
      }
    } catch (err) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err.message
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
            Electricity Bill Payment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pay your electricity bills quickly and securely
          </p>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-[#5C2D91] to-[#FF8C00] text-white rounded-2xl p-5 mb-8 shadow-lg flex items-center justify-between">
          <span className="text-lg font-medium opacity-90">Wallet Balance</span>
          <span className="text-2xl font-bold">{formatBalance(balance)}</span>
        </div>

        {/* Provider Selection */}
        {!selectedProvider ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Select Electricity Provider
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
        ) : (selectedProvider === "portharcourt-electric" || selectedProvider === "abuja-electric" || selectedProvider === "eko-electric" || selectedProvider === "ikeja-electric") && !selectedMeterType ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-800">
                Select Meter Type
              </h3>
              <button
                onClick={() => setSelectedProvider("")}
                className="px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Change Provider
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedMeterType("prepaid")}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#5C2D91] hover:bg-[#5C2D91]/5 transition-all text-left"
              >
                <div className="font-semibold text-gray-800">Prepaid Meter</div>
                <div className="text-sm text-gray-500">Get token after payment</div>
              </button>
              <button
                onClick={() => setSelectedMeterType("postpaid")}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#5C2D91] hover:bg-[#5C2D91]/5 transition-all text-left"
              >
                <div className="font-semibold text-gray-800">Postpaid Meter</div>
                <div className="text-sm text-gray-500">Pay outstanding bill</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-800">
                {providers.find((p) => p.id === selectedProvider)?.name} Payment
                {selectedMeterType && ` - ${selectedMeterType.charAt(0).toUpperCase() + selectedMeterType.slice(1)}`}
              </h3>
              <button
                onClick={() => {
                  if (selectedMeterType) {
                    setSelectedMeterType("");
                  } else {
                    setSelectedProvider("");
                  }
                }}
                className="px-3 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Change {selectedMeterType ? "Type" : "Provider"}
              </button>
            </div>



            {(selectedProvider === "portharcourt-electric" || selectedProvider === "abuja-electric" || selectedProvider === "eko-electric" || selectedProvider === "ikeja-electric") && !meterVerified && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  Please verify your meter number before proceeding with payment.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.accountNumber) {
                      setModalState({
                        isOpen: true,
                        type: 'error',
                        title: 'Validation Error',
                        message: 'Please enter meter number first'
                      });
                      return;
                    }
                    setVerifying(true);
                    try {
                      const verifyData = {
                        serviceID: selectedProvider,
                        billersCode: formData.accountNumber,
                        type: selectedMeterType
                      };
                      const response = await vtuService.verifyMeter(verifyData);
                      if (response && response.content && response.content.Customer_Name) {
                        setCustomerInfo(response.content);
                        setMeterVerified(true);
                        setModalState({
                          isOpen: true,
                          type: 'success',
                          title: 'Meter Verified',
                          message: 'Meter verified successfully!'
                        });
                      } else {
                        // Use specific error message from backend if available
                        const errorMessage = response?.error || "Meter verification failed. Please check your meter number.";
                        setModalState({
                          isOpen: true,
                          type: 'error',
                          title: 'Verification Failed',
                          message: errorMessage
                        });
                      }
                    } catch (err) {
                      setModalState({
                        isOpen: true,
                        type: 'error',
                        title: 'Verification Failed',
                        message: err.message || "Meter verification failed"
                      });
                    } finally {
                      setVerifying(false);
                    }
                  }}
                  disabled={verifying || !formData.accountNumber}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {verifying ? <LoadingSpinner size="sm" /> : "Verify Meter"}
                </button>
              </div>
            )}

            {meterVerified && customerInfo && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-green-800">Customer Information</h4>
                <p className="text-sm text-green-700">Name: {customerInfo.Customer_Name}</p>
                <p className="text-sm text-green-700">Meter Number: {formData.accountNumber}</p>
                <p className="text-sm text-green-700">Address: {customerInfo.Address}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Account/Meter Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter your account number"
                  required
                  disabled={meterVerified}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent disabled:bg-gray-100"
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
<BeneficiarySelector
  value={formData.phone}
  onSelect={(beneficiary) =>
    setFormData({ ...formData, phone: beneficiary.phone_number })
  }
   onAdd={() => setModalState({
                  isOpen: true,
                  type: 'success',
                  title: 'Success',
                  message: 'Beneficiary added successfully!',
                })}
/>

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
                  !formData.accountNumber ||
                  !formData.amount ||
                  !formData.phone
                }
                className="w-full bg-[#5C2D91] hover:bg-[#FF8C00] text-white font-semibold py-3 rounded-lg flex justify-center items-center transition-all duration-200"
              >
                {loading ? <LoadingSpinner size="sm" /> : `Pay ₦${formData.amount || 0}`}
              </button>
            </form>
          </div>
        )}
      </div>

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

export default Electricity;
