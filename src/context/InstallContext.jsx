import React, { createContext, useContext, useState, useEffect } from 'react';

const InstallContext = createContext();

export const InstallProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [canInstall, setCanInstall] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        console.log('Is Standalone:', isStandalone);
        setIsInstalled(isStandalone);

        // Platform detection
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        console.log('Is IOS:', isIOSDevice);
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setCanInstall(true);
            console.log('beforeinstallprompt event fired');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null);
            setCanInstall(true); // Keep it true or false? usually false after install
            setIsInstalled(true);
            console.log('PWA was installed');
        });

        // If it's iOS, we can always show "install" instructions because they don't have the event
        if (isIOSDevice && !isStandalone) {
            setCanInstall(true);
            console.log('Enabling canInstall for iOS');
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [isInstalled]);

    const install = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setCanInstall(false);
            }
        } else if (isIOS) {
            setShowInstructions(true);
        } else {
            // Fallback for other browsers/states
            setShowInstructions(true);
        }
    };

    return (
        <InstallContext.Provider value={{
            canInstall,
            isInstalled,
            install,
            isIOS,
            showInstructions,
            setShowInstructions
        }}>
            {children}
        </InstallContext.Provider>
    );
};

export const useInstall = () => {
    const context = useContext(InstallContext);
    if (!context) {
        throw new Error('useInstall must be used within an InstallProvider');
    }
    return context;
};
