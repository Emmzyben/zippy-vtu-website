import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Loader2, ArrowLeft, CheckCircle2, XCircle, RefreshCcw, Info } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { ticketingService } from '../../services/ticketingService';
import { useWallet } from '../../context/WalletContext';
import NotificationModal from '../../components/NotificationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { refreshWallet } = useWallet();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [showRefundModal, setShowRefundModal] = useState(false);

    const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    const fetchTicketDetails = async () => {
        try {
            const response = await ticketingService.getRefundStatus(id);
            if (response.success) {
                const allTickets = await ticketingService.getMyTickets();
                const fullTicket = allTickets.data.find(t => t.id === parseInt(id));
                setTicket({ ...fullTicket, ...response.data });
            }
        } catch (error) {
            console.error('Error fetching ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTicketDetails(); }, [id]);

    const handleRefund = async () => {
        if (!refundReason.trim()) return;
        setActionLoading(true);
        try {
            const response = await ticketingService.requestRefund(id, refundReason);
            setNotification({ isOpen: true, type: response.success ? 'success' : 'error', title: response.success ? 'Refund Processed' : 'Refund Failed', message: response.message });
            if (response.success) { setShowRefundModal(false); await refreshWallet(); fetchTicketDetails(); }
        } catch (error) {
            setNotification({ isOpen: true, type: 'error', title: 'Error', message: error.message });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReschedule = async (choice) => {
        setActionLoading(true);
        try {
            const response = await ticketingService.respondToReschedule(id, choice);
            setNotification({ isOpen: true, type: response.success ? 'success' : 'error', title: 'Response Recorded', message: response.message });
            if (response.success) { await refreshWallet(); fetchTicketDetails(); }
        } catch (error) {
            setNotification({ isOpen: true, type: 'error', title: 'Error', message: error.message });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Retrieving Ticket Record...</p>
            </div>
        );
    }

    if (!ticket) {
        return <div className="p-6 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Ticket record not found</div>;
    }

    const isRescheduled = ticket.event_status === 'rescheduled' && ticket.reschedule_response === 'none';
    const canRefund = ticket.status === 'paid' && ticket.refund_status === 'none';

    return (
        <div className="p-4 lg:p-10 mx-auto pb-20 transition-all">
            <button
                onClick={() => navigate('/my-tickets')}
                className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-10 hover:text-neutral-900 transition-colors"
            >
                <ArrowLeft size={14} /> Back to Vault
            </button>

            {/* Ticket Card */}
            <div className="bg-white rounded-lg shadow-lg border border-neutral-100 overflow-hidden text-center relative">
                {/* Top accent stripe */}
                <div className={`h-1 w-full ${ticket.status === 'paid' ? 'bg-[#e3984d]' : 'bg-neutral-300'}`} />

                <div className="p-6 md:p-8">

                    <h1 className="text-lg font-bold text-neutral-900 mb-1 truncate leading-tight uppercase tracking-tight">
                        {ticket.event_title}
                    </h1>
                    <p className="text-neutral-400 font-bold uppercase text-[10px] mb-8 tracking-widest">
                        {ticket.ticket_name} Entry Pass
                    </p>

                    {/* QR Code */}
                    <div className={`p-4 bg-white border border-neutral-100 rounded-md inline-block mx-auto mb-8 shadow-sm ${ticket.status !== 'paid' ? 'opacity-20 grayscale' : ''}`}>
                        <QRCodeCanvas
                            value={ticket.qr_hash}
                            size={140}
                            level="H"
                            includeMargin={false}
                            imageSettings={{ src: "/favicon.ico", x: undefined, y: undefined, height: 20, width: 20, excavate: true }}
                        />
                    </div>

                    {ticket.status !== 'paid' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12">
                            <div className="border-4 border-red-500 bg-white/95 text-red-500 px-6 py-2 rounded font-black text-3xl uppercase tracking-tighter shadow-xl">
                                {ticket.status === 'used' ? 'SCANNED' : 'VOID'}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border-t border-b border-dashed border-neutral-100 py-5 my-4">
                        <div className="text-left border-r border-neutral-100">
                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date</p>
                            <p className="font-bold text-neutral-900 text-xs">{new Date(ticket.event_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-left pl-4">
                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Time</p>
                            <p className="font-bold text-neutral-900 text-xs">{new Date(ticket.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>

                    <div className="text-left flex items-start gap-2.5 bg-neutral-50 p-3.5 rounded-md border border-neutral-100">
                        <MapPin size={14} className="text-neutral-400 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-neutral-600 line-clamp-1">{ticket.location}</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex justify-between items-center px-4 relative">
                    <div className="w-6 h-6 rounded-full bg-neutral-100 -ml-6" />
                    <div className="flex-1 border-t-2 border-dashed border-neutral-100" />
                    <div className="w-6 h-6 rounded-full bg-neutral-100 -mr-6" />
                </div>

                <div className="p-6 md:p-8 bg-neutral-50/50">
                    <div className="text-[9px] text-neutral-400 font-bold mb-0.5 uppercase tracking-widest">Holder Reference</div>
                    <div className="text-sm font-black text-neutral-900 mb-6 uppercase tracking-tight">TKT-{String(ticket.id).padStart(6, '0')}</div>

                    {ticket.status === 'paid' && (
                        <div className="space-y-3">
                            {isRescheduled && (
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-md mb-4 text-left">
                                    <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-2 uppercase tracking-wide">
                                        <RefreshCcw size={14} /> Event Updated
                                    </div>
                                    <p className="text-xs text-amber-600 mb-4 font-medium">This event has been rescheduled. Accept the new date or request a full refund.</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleReschedule('accept')} disabled={actionLoading} className="flex-1 bg-amber-500 text-white font-bold py-2.5 rounded-md text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-colors">
                                            Accept
                                        </button>
                                        <button onClick={() => handleReschedule('refund')} disabled={actionLoading} className="flex-1 bg-white border border-amber-500 text-amber-600 font-bold py-2.5 rounded-md text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-colors">
                                            Refund
                                        </button>
                                    </div>
                                </div>
                            )}

                            {canRefund && !isRescheduled && (
                                <button
                                    onClick={() => setShowRefundModal(true)}
                                    className="w-full bg-[#e3984d] py-3 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 rounded-md transition-all"
                                >
                                    Request Refund
                                </button>
                            )}
                        </div>
                    )}

                    {ticket.refund_status !== 'none' && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-left flex items-start gap-3">
                            <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Refund {ticket.refund_status}</p>
                                <p className="text-[10px] text-blue-600 mt-1">Updated: {new Date(ticket.refunded_at).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 text-center space-y-1">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Present this QR at the gate for scanning.</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Tickets are non-transferable.</p>
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70">
                    <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-sm w-full border border-neutral-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-md flex items-center justify-center border border-red-100">
                                <RefreshCcw size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Request Refund</h3>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Funds credited back to wallet</p>
                            </div>
                        </div>
                        <textarea
                            className="w-full border border-neutral-100 bg-neutral-50 rounded-md p-4 focus:outline-none focus:border-[#e3984d] focus:bg-white mb-6 font-medium text-xs transition-all"
                            rows="3"
                            placeholder="Reason for refund request..."
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setShowRefundModal(false)} className="flex-1 py-3 font-bold text-[10px] text-neutral-400 uppercase tracking-widest border border-neutral-100 rounded-md hover:bg-neutral-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleRefund}
                                disabled={actionLoading || !refundReason.trim()}
                                className="flex-[2] bg-red-600 text-white font-bold py-3 rounded-md text-[10px] uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? <LoadingSpinner size="sm" /> : 'Confirm Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification({ ...notification, isOpen: false })}
                type={notification.type}
                title={notification.title}
                message={notification.message}
            />
        </div>
    );
};

export default TicketDetails;
