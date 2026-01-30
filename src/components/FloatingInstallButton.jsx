import React from 'react';
import { Smartphone } from 'lucide-react';
import { useInstall } from '../context/InstallContext';
import { useLocation } from 'react-router-dom';

const FloatingInstallButton = () => {
    const { canInstall, isInstalled, install } = useInstall();
    const location = useLocation();

    // List of dashboard paths where we want to hide the floating button
    const dashboardPaths = ['/home', '/wallet', '/transactions', '/profile', '/airtime', '/data', '/bills', '/electricity', '/cable', '/flights'];
    const isDashboard = dashboardPaths.includes(location.pathname) || location.pathname.startsWith('/transactions/');

    if (isInstalled || isDashboard) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <button
                onClick={install}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#5C2D91] to-[#2E1647] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group ring-4 ring-white/20"
            >
                <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-md">
                    <Smartphone size={20} className="group-hover:rotate-12 transition-transform" />
                </div>
                <span className="font-semibold text-sm md:text-base">Install App</span>
            </button>
        </div>
    );
};

export default FloatingInstallButton;
