import { Check, X, Copy } from 'lucide-react';
import { useState } from 'react';

const TokenModal = ({ isOpen, onClose, token, meterNumber, customerName, amount }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopyToken = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
                {/* Success Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                    <div className="flex items-center justify-center mb-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <Check size={32} className="text-white" strokeWidth={3} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center">Payment Successful!</h2>
                    <p className="text-center text-white/90 text-sm mt-1">
                        Your electricity bill has been paid
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {customerName && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Customer Name:</span>
                                <span className="font-medium text-gray-900">{customerName}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Meter Number:</span>
                            <span className="font-medium text-gray-900">{meterNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount Paid:</span>
                            <span className="font-medium text-gray-900">
                                {new Intl.NumberFormat('en-NG', {
                                    style: 'currency',
                                    currency: 'NGN',
                                }).format(amount)}
                            </span>
                        </div>
                    </div>

                    {/* Token Display */}
                    <div className="bg-gradient-to-br from-[#5C2D91]/10 to-[#FF8C00]/10 border-2 border-[#5C2D91]/20 rounded-xl p-5">
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                            Your Electricity Token:
                        </label>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between gap-3">
                                <code className="text-lg font-mono font-bold text-[#5C2D91] break-all">
                                    {token}
                                </code>
                                <button
                                    onClick={handleCopyToken}
                                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Copy token"
                                >
                                    {copied ? (
                                        <Check size={20} className="text-green-600" />
                                    ) : (
                                        <Copy size={20} className="text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {copied && (
                            <p className="text-xs text-green-600 mt-2 text-center font-medium">
                                Token copied to clipboard!
                            </p>
                        )}
                    </div>

                    {/* Important Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800">
                            <strong>Important:</strong> Please save this token. You'll need it to recharge your meter.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-[#5C2D91] to-[#FF8C00] hover:from-[#4A2373] hover:to-[#E67E00] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenModal;
