import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { ticketingService } from '../../services/ticketingService';
import { useWallet } from '../../context/WalletContext';
import NotificationModal from '../../components/NotificationModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { balance, refreshWallet } = useWallet();

    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const [modalState, setModalState] = useState({ isOpen: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await ticketingService.getEventDetails(id);
                if (response.success) {
                    setEvent(response.data.event);
                    setTicketTypes(response.data.ticket_types);
                }
            } catch (error) {
                setModalState({ isOpen: true, type: 'error', title: 'Error', message: error.message || 'Failed to load event details' });
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id]);

    const handlePurchase = async () => {
        if (!selectedTicket) return;
        if (balance < selectedTicket.price) {
            setModalState({ isOpen: true, type: 'error', title: 'Insufficient Balance', message: 'You do not have enough funds in your wallet to purchase this ticket.' });
            return;
        }
        setPurchaseLoading(true);
        try {
            const response = await ticketingService.purchaseTicket(selectedTicket.id);
            if (response.success) {
                await refreshWallet();
                setModalState({ isOpen: true, type: 'success', title: 'Ticket Secured', message: `Your entry for "${event.title}" is confirmed. View it in My Tickets.` });
            }
        } catch (error) {
            setModalState({ isOpen: true, type: 'error', title: 'Purchase Failed', message: error.message || 'An error occurred during purchase.' });
        } finally {
            setPurchaseLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Loading Event Data...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="p-6 text-center">
                <AlertCircle size={40} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wide mb-4">Event Not Found</h2>
                <button onClick={() => navigate('/app/explore-events')} className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center justify-center mx-auto gap-2 hover:text-neutral-900">
                    <ArrowLeft size={14} /> Return to Listings
                </button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Hero Banner */}
            <div className="relative h-52 md:h-72 w-full">
                <img
                    src={event.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <button
                    onClick={() => navigate('/app/explore-events')}
                    className="absolute top-4 left-4 p-2 rounded-md bg-black/40 text-white hover:bg-[#4a2474]/60 transition-all border border-white/10"
                >
                    <ArrowLeft size={18} />
                </button>
            </div>

            <div className="container mx-auto px-4 pt-6 relative z-10 pb-20">
                {/* Main Info Card */}
                <div className="bg-white rounded-lg shadow-xl border border-neutral-100 p-6 md:p-8 mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className={`px-2 py-1 border rounded text-[9px] font-black uppercase tracking-widest ${event.status === 'rescheduled' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-green-50 text-green-700 border-green-100'
                            }`}>
                            {event.status}
                        </span>
                        <span className="bg-neutral-50 text-neutral-500 border border-neutral-100 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">
                            {event.refund_deadline_hours}h Refund Window
                        </span>
                    </div>

                    <h1 className="text-xl font-bold text-neutral-900 mb-6 leading-tight uppercase tracking-tight">
                        {event.title}
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                                <Calendar size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Date & Time</p>
                                <p className="text-xs font-bold text-neutral-900">
                                    {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-[10px] text-neutral-500 font-medium">
                                    {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600 shrink-0">
                                <MapPin size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Venue</p>
                                <p className="text-xs font-bold text-neutral-900 line-clamp-1">{event.location}</p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-[#5C2D91] hover:underline"
                                >
                                    Get Directions →
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-50 pt-6">
                        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Info size={12} /> Event Description
                        </h3>
                        <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap font-medium">
                            {event.description}
                        </p>
                    </div>
                </div>

                {/* Ticket Selector */}
                <div className="bg-[#000] rounded-lg p-6 md:p-8 shadow-xl text-white mb-8">
                    <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Ticket size={14} className="text-[#e3984d]" /> Select Entry Tier
                    </h2>

                    <div className="space-y-3 mb-8">
                        {ticketTypes.map((type) => (
                            <label
                                key={type.id}
                                className={`flex items-center justify-between p-4 rounded-md border transition-all cursor-pointer select-none ${selectedTicket?.id === type.id
                                    ? 'bg-white/10 border-white/40'
                                    : type.available_quantity <= 0
                                        ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/5'
                                        : 'border-white/10 hover:bg-white/5 bg-white/5'
                                    }`}
                            >
                                <input type="radio" name="ticketType" className="hidden" onChange={() => setSelectedTicket(type)} disabled={type.available_quantity <= 0} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm uppercase tracking-tight">{type.name}</span>
                                        {selectedTicket?.id === type.id && <CheckCircle2 size={14} className="text-[#e3984d]" />}
                                    </div>
                                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">
                                        {type.available_quantity > 0 ? `${type.available_quantity} remaining` : 'Sold Out'}
                                    </p>
                                </div>
                                <div className="text-base font-black text-[#e3984d]">
                                    {formatCurrency(type.price)}
                                </div>
                            </label>
                        ))}
                    </div>

                    {/* Wallet summary */}
                    <div className="bg-white/5 rounded-md p-4 mb-8 flex items-center justify-between gap-4 border border-white/10">
                        <div>
                            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Wallet Balance</p>
                            <p className="text-base font-black text-white">{formatCurrency(balance)}</p>
                        </div>
                        {selectedTicket && (
                            <div className="text-right">
                                <p className="text-[9px] text-[#e3984d]/70 font-bold uppercase tracking-widest mb-1">Payable</p>
                                <p className="text-base font-black text-[#e3984d]">{formatCurrency(selectedTicket.price)}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handlePurchase}
                        disabled={!selectedTicket || purchaseLoading || selectedTicket?.available_quantity <= 0}
                        className={`w-full py-4 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!selectedTicket
                            ? 'bg-white/5 cursor-not-allowed text-white/30 border border-white/10'
                            : 'bg-[#e3984d] text-white hover:bg-[#e3984d]/80 shadow-lg shadow-[#e3984d]/20'
                            }`}
                    >
                        {purchaseLoading ? <LoadingSpinner size="sm" /> : <>Confirm Purchase <ArrowRight size={14} /></>}
                    </button>
                </div>
            </div>

            <NotificationModal
                isOpen={modalState.isOpen}
                onClose={() => {
                    setModalState({ ...modalState, isOpen: false });
                    if (modalState.type === 'success') navigate('/my-tickets');
                }}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
            />
        </div>
    );
};

export default EventDetails;
