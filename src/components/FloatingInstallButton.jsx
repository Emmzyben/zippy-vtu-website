import React from 'react';
import { Smartphone } from 'lucide-react';
import { useInstall } from '../context/InstallContext';
import { useLocation } from 'react-router-dom';

const FloatingInstallButton = () => {
    const { canInstall, isInstalled, install } = useInstall();
    const location = useLocation();

    // Hide the floating button on ALL authenticated dashboard pages
    // The install button is already available in the Home header
    const dashboardPaths = [
        '/home', '/wallet', '/transactions', '/profile', 
        '/airtime', '/data', '/bills', '/electricity', '/cable', '/flights',
        '/app/explore-events', '/app/events', '/my-tickets', '/organizer'
    ];
    
    const isDashboard = dashboardPaths.some(path => location.pathname.startsWith(path));

    if (isInstalled || isDashboard) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <button
                onClick={install}
                className="flex items-center justify-center gap-2 bg-[#e3984d] text-white px-5 py-3 rounded-md shadow-lg border border-neutral-800 hover:bg-[#c98542] transition-all hover:-translate-y-0.5 active:translate-y-0 group"
            >
                <Smartphone size={16} className="text-neutral-300" />
                <span className="font-bold text-[10px] uppercase tracking-widest mt-0.5">Install App</span>
            </button>
        </div>
    );
};

export default FloatingInstallButton;
