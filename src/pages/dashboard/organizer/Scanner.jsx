import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, CheckCircle2, XCircle, 
  Loader2, User, History
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { organizerService } from '../../../services/organizerService';

const Scanner = () => {
  const navigate = useNavigate();
  const [lastResult, setLastResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [history, setHistory] = useState([]);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true, aspectRatio: 1.0 },
      false
    );

    const onScanSuccess = async (decodedText) => {
      if (validating) return;
      handleValidation(decodedText);
    };

    scanner.render(onScanSuccess, () => {});
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Scanner clear error:", err));
      }
    };
  }, []);

  const handleValidation = async (qrHash) => {
    setValidating(true);
    try {
      const response = await organizerService.validateTicket(qrHash);
      setLastResult({ success: response.success, message: response.message, data: response.data });
      if (response.success) {
        setHistory(prev => [{
          id: Date.now(),
          name: response.data.user_name,
          tier: response.data.ticket_name,
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 5));
      }
    } catch (error) {
      setLastResult({ success: false, message: error.message || 'Validation failed' });
    } finally {
      setValidating(false);
      setTimeout(() => setLastResult(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="p-2.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-sm tracking-[0.2em] uppercase">Gate Control</h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">Entry Point Active</p>
          </div>
          <div className="w-10 h-10 bg-amber-500 rounded-md flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Camera size={18} className="text-black" />
          </div>
        </div>

        {/* Scanner Container */}
        <div className="relative mb-8 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-2xl aspect-square">
          <div id="reader" className="w-full h-full" />

          {/* Result Overlay */}
          {lastResult && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${
              lastResult.success ? 'bg-green-700/95' : 'bg-red-700/95'
            }`}>
              {lastResult.success
                ? <CheckCircle2 size={80} className="mb-4 drop-shadow-lg" />
                : <XCircle size={80} className="mb-4 drop-shadow-lg" />
              }
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">
                {lastResult.success ? 'Access Granted' : 'Denied'}
              </h2>
              <p className="text-sm font-bold opacity-90 mb-4">{lastResult.message}</p>
              {lastResult.data && (
                <div className="bg-black/25 p-4 rounded-md w-full text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Attendee</p>
                  <p className="text-xl font-black">{lastResult.data.user_name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-2">{lastResult.data.ticket_name} Tier</p>
                </div>
              )}
            </div>
          )}

          {validating && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <Loader2 size={48} className="text-white animate-spin mb-3" />
              <p className="font-bold uppercase tracking-widest text-[10px]">Validating...</p>
            </div>
          )}
        </div>

        {/* Scan History */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-white/5">
          <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6 border-b border-white/5 pb-4">
            <History size={14} /> Recent Entries
          </h3>
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/20">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{entry.name}</p>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{entry.tier}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-600 tabular-nums">{entry.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">No entries recorded</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-[10px] font-bold text-neutral-700 uppercase tracking-widest leading-relaxed space-y-1">
          <p>Maximize screen brightness on attendee device.</p>
          <p>Hold camera 10–15cm from the QR code.</p>
        </div>
      </div>

      <style>{`
        #reader { border: none !important; }
        #reader__scan_region { background: #171717 !important; }
        #reader__dashboard_section_csr button {
          background: #404040 !important;
          color: #fff !important;
          border-radius: 6px !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          padding: 10px 20px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          border: none !important;
        }
        #reader video { border-radius: 8px !important; }
      `}</style>
    </div>
  );
};

export default Scanner;
