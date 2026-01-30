import { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2 } from 'lucide-react';

import { useInstall } from '../context/InstallContext';

const InstallPromptModal = () => {
    const { canInstall, install, isInstalled } = useInstall();
    const [isVisible, setIsVisible] = useState(false);

    console.log('InstallPromptModal State - canInstall:', canInstall, 'isInstalled:', isInstalled, 'isVisible:', isVisible);

    useEffect(() => {
        if (canInstall && !isInstalled) {
            // Check if user has already dismissed it in this session
            const isDismissed = sessionStorage.getItem('installPromptDismissed');
            if (!isDismissed) {
                // Show the modal after a short delay
                const timer = setTimeout(() => setIsVisible(true), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [canInstall, isInstalled]);

    const handleInstall = async () => {
        await install();
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // Don't show again in this session
        sessionStorage.setItem('installPromptDismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden transform animate-in slide-in-from-bottom-8 duration-500">
                {/* Header/Banner */}
                <div className="bg-gradient-to-br from-[#5C2D91] to-[#2E1647] p-8 flex flex-col items-center relative">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                        <img src="/bg.png" alt="Zippy Pay" className="w-16 h-16 rounded-xl object-cover" />
                    </div>

                    <h3 className="text-white text-xl font-bold">Install Zippy Pay</h3>
                    <p className="text-purple-200 text-sm mt-1">Faster access & better experience</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-50 p-1 rounded-full flex-shrink-0">
                                <CheckCircle2 size={16} className="text-green-600" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Add to your home screen for quick access</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-50 p-1 rounded-full flex-shrink-0">
                                <CheckCircle2 size={16} className="text-green-600" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Works offline and loads lightning fast</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-50 p-1 rounded-full flex-shrink-0">
                                <CheckCircle2 size={16} className="text-green-600" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Save data and storage space</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleDismiss}
                            className="py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                            Later
                        </button>
                        <button
                            onClick={handleInstall}
                            className="bg-[#5C2D91] py-3 px-4 rounded-xl font-bold text-white shadow-lg shadow-purple-200 flex items-center justify-center gap-2 hover:bg-[#4A2475] transition-all transform hover:scale-[1.02]"
                        >
                            <Download size={20} />
                            Install Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallPromptModal;
