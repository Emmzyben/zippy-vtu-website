import React, { useState, useEffect, useRef } from "react";
import { Plane, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// These are public affiliate values — safe to hardcode for instant rendering
const TRAVELSTART_IFRAME_ID = 'travelstartIframe-98819315-95ad-4bbe-9b10-c6b5e8550a0b';
const TRAVELSTART_URL = 'https://www.travelstart.com.ng';
const TRAVELSTART_AFF_ID = '223616';

const Flights = () => {
    const navigate = useNavigate();
    const iframeRef = useRef(null);
    const [iframeHeight, setIframeHeight] = useState("100vh");
    const [iframeLoaded, setIframeLoaded] = useState(false);

    // Build Iframe URL based on snippet logic
    const buildIframeUrl = () => {
        const travelstartIframeId = TRAVELSTART_IFRAME_ID;
        const iframeUrl = TRAVELSTART_URL;
        const affId = TRAVELSTART_AFF_ID;

        const queryParams = new URLSearchParams(window.location.search);

        // Default configs
        if (!queryParams.has('show_banners')) queryParams.set('show_banners', 'false');
        if (!queryParams.has('log')) queryParams.set('log', 'false');
        if (!queryParams.has('affId') && !queryParams.has('affid') && !queryParams.has('aff_id')) {
            queryParams.set('affId', affId);
        }
        if (!queryParams.has('language')) queryParams.set('language', '');
        if (!queryParams.has('affCampaign')) queryParams.set('affCampaign', '');
        if (!queryParams.has('utm_source')) queryParams.set('utm_source', 'affiliate');
        if (!queryParams.has('utm_medium')) queryParams.set('utm_medium', affId);
        if (!queryParams.has('isiframe')) queryParams.set('isiframe', 'true');
        if (!queryParams.has('landing_page')) queryParams.set('landing_page', 'false');

        // Currency preference
        queryParams.set('currency', 'NGN');

        if (!queryParams.has('iframeVersion')) queryParams.set('iframeVersion', '11');
        if (!queryParams.has('host')) queryParams.set('host', window.location.href.split('?')[0]);

        return `${iframeUrl}/?search=false&${queryParams.toString()}`;
    };

    useEffect(() => {
        const handleMessage = (e) => {
            // Safely parse postMessage payload
            if (!e.data || !Array.isArray(e.data)) return;
            const eventName = e.data[0];
            const data = e.data[1];

            // Travelstart iframe sends resize events
            if (eventName === 'setHeight') {
                setIframeHeight(`${data}px`);
            }
        };

        window.addEventListener('message', handleMessage, false);
        return () => window.removeEventListener('message', handleMessage, false);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 relative pb-20">
            {/* Native App Header Wrapper */}
            <div className="bg-white border-b border-neutral-100 p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-50 rounded-md transition-colors">
                        <ArrowLeft size={20} className="text-neutral-600" />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                            <Plane size={16} className="text-[#e3984d]" />
                            Flight Booking
                        </h1>
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Powered by Travelstart</p>
                    </div>
                </div>
            </div>

            {/* Travelstart Affiliate Iframe Container */}
            <div className="w-full relative bg-[#fafafa]" style={{ minHeight: 'calc(100vh - 70px)' }}>
                {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 z-10">
                        <Loader2 size={40} className="text-[#e3984d] animate-spin mb-4" />
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-4">Connecting to Booking Engine...</p>
                        <p className="text-[9px] text-neutral-400 font-medium tracking-wide mt-2">Loading live flight data</p>
                    </div>
                )}

                <iframe
                    id={TRAVELSTART_IFRAME_ID}
                    ref={iframeRef}
                    src={buildIframeUrl()}
                    frameBorder="0"
                    scrolling="auto"
                    onLoad={() => setIframeLoaded(true)}
                    style={{
                        margin: 0,
                        padding: 0,
                        border: 0,
                        width: '100%',
                        height: iframeHeight,
                        minHeight: '100vh',
                        backgroundColor: '#fafafa'
                    }}
                    title="Travelstart Flight Booking"
                />
            </div>
        </div>
    );
};

export default Flights;
