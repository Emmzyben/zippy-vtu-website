import React from 'react';
import { X, Share, PlusSquare, ArrowUp, Menu } from 'lucide-react';
import { useInstall } from '../context/InstallContext';

const InstallInstructions = () => {
    const { showInstructions, setShowInstructions, isIOS } = useInstall();

    if (!showInstructions) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden p-8 relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setShowInstructions(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#5C2D91] to-[#2E1647] rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                        <img src="/bg.png" alt="Zippy Pay" className="w-16 h-16 rounded-xl" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Install Zippy Pay</h3>
                    <p className="text-gray-500 mb-8 max-w-[240px]">
                        Add Zippy Pay to your home screen for lightning fast access.
                    </p>

                    <div className="w-full space-y-6">
                        {isIOS ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                    <div className="bg-white p-2 rounded-xl shadow-sm text-blue-500">
                                        <Share size={24} />
                                    </div>
                                    <p className="text-left text-sm font-medium text-gray-700">
                                        1. Tap the <span className="font-bold">Share</span> button in the browser toolbar.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl text-center">
                                    <div className="bg-white p-2 rounded-xl shadow-sm text-gray-700">
                                        <PlusSquare size={24} />
                                    </div>
                                    <p className="text-left text-sm font-medium text-gray-700">
                                        2. Scroll down and tap <span className="font-bold">"Add to Home Screen"</span>.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                    <div className="bg-white p-2 rounded-xl shadow-sm text-gray-700">
                                        <Menu size={24} />
                                    </div>
                                    <p className="text-left text-sm font-medium text-gray-700">
                                        1. Tap the <span className="font-bold">Menu</span> button in your browser.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                    <div className="bg-white p-2 rounded-xl shadow-sm text-gray-700">
                                        <ArrowUp size={24} />
                                    </div>
                                    <p className="text-left text-sm font-medium text-gray-700">
                                        2. Look for <span className="font-bold">"Install App"</span> or <span className="font-bold">"Add to Home Screen"</span>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowInstructions(false)}
                        className="mt-8 w-full bg-[#5C2D91] py-4 rounded-2xl text-white font-bold shadow-lg shadow-purple-200 hover:bg-[#4A2475] transition-all"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallInstructions;
