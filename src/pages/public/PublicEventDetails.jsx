import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Loader2, ArrowLeft, Info, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ticketingService } from '../../services/ticketingService';
import { useAuth } from '../../context/AuthContext';

const PublicEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await ticketingService.getEventDetails(id);
                if (response.success) {
                    setEvent(response.data.event);
                    setTicketTypes(response.data.ticket_types);
                }
            } catch (error) {
                console.error('Error loading event:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id]);

    const handleBookNow = () => {
        if (isAuthenticated) {
            navigate(`/app/events/${id}`);
        } else {
            navigate(`/login?redirect=/app/events/${id}`);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
                <Loader2 className="w-10 h-10 text-[#622186] animate-spin mb-4" />
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Retrieving Event Matrix...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 text-center">
                <div className="max-w-md space-y-6">
                    <h2 className="text-4xl font-black text-neutral-900 uppercase italic">Experience <span className="text-neutral-300">Expired</span></h2>
                    <p className="text-neutral-500 font-medium italic">This event either never existed or has been removed from the live feed.</p>
                    <Link to="/events" className="inline-flex items-center gap-2 bg-[#e3984d] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#c98542] transition-all">
                        <ArrowLeft size={16} /> Return to Feed
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Immersive Header */}
            <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
                <img
                    src={event.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover grayscale-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/40" />
                
                {/* Overlays */}
                <div className="absolute top-8 left-8">
                   <Link to="/events" className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-all border border-white/20 block">
                      <ArrowLeft size={20} />
                   </Link>
                </div>

                <div className="absolute bottom-12 left-0 right-0">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="bg-[#e3984d] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-[#e3984d]/30">
                                {event.status}
                            </span>
                            <span className="bg-white/90 backdrop-blur-sm text-neutral-900 border border-neutral-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                                {event.refund_deadline_hours}h Refund Window
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-neutral-900 leading-[0.9] tracking-tighter uppercase italic">
                           {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16 grid lg:grid-cols-3 gap-16">
                {/* Content Left */}
                <div className="lg:col-span-2 space-y-16">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-[#e3984d] uppercase tracking-[0.2em]">Timeline</p>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 border border-neutral-100 shadow-sm">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-neutral-900 italic uppercase leading-none mb-1">
                                        {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                                        {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-[#e3984d] uppercase tracking-[0.2em]">Coordinates</p>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 border border-neutral-100 shadow-sm">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-neutral-900 italic uppercase leading-none mb-1 line-clamp-1">
                                        {event.location}
                                    </p>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-[10px] font-black text-[#622186] uppercase tracking-widest border-b-2 border-[#622186]/10 hover:border-[#622186] transition-all"
                                    >
                                        Open in Satellite →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-[10px] font-bold text-[#e3984d] uppercase tracking-[0.2em]">The Narrative</p>
                        <div className="bg-neutral-50 rounded-[2rem] p-10 border border-neutral-100">
                           <p className="text-lg text-neutral-600 leading-relaxed font-semibold italic whitespace-pre-wrap">
                              {event.description}
                           </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pb-12">
                       <div className="border border-neutral-100 p-8 rounded-3xl space-y-4">
                          <ShieldCheck size={32} className="text-[#e3984d]" />
                          <h4 className="text-lg font-black uppercase text-neutral-900 tracking-tight">Verified Organizer</h4>
                          <p className="text-xs text-neutral-500 font-medium italic">Every event on ZippyPay is vetted for authenticity and security. Your experience is our priority.</p>
                       </div>
                       <div className="border border-neutral-100 p-8 rounded-3xl space-y-4">
                          <Zap size={32} className="text-[#e3984d]" />
                          <h4 className="text-lg font-black uppercase text-neutral-900 tracking-tight">Instant Payouts</h4>
                          <p className="text-xs text-neutral-500 font-medium italic">Organizers receive funds instantly, ensuring every event has the resource it needs to succeed.</p>
                       </div>
                    </div>
                </div>

                {/* Sticky Sidebar Right */}
                <div className="lg:relative">
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div className="bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl text-white space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e3984d]/10 rounded-full blur-3xl" />
                            
                            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Entry Tiers</h2>
                                <Ticket size={18} className="text-[#e3984d]" />
                            </div>

                            <div className="space-y-4">
                                {ticketTypes.map((type) => (
                                    <div key={type.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black uppercase tracking-tight italic">{type.name}</p>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                                                {type.available_quantity > 0 ? `${type.available_quantity} slots available` : 'Depleted'}
                                            </p>
                                        </div>
                                        <p className="text-lg font-black text-[#e3984d] italic">{formatCurrency(type.price)}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleBookNow}
                                className="w-full bg-[#e3984d] text-white py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#c98542] transition-all shadow-xl shadow-[#e3984d]/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Secure My Access <ArrowRight size={18} />
                            </button>
                            
                            <p className="text-center text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                                Secure Digital Checkout powered by ZippyPay
                            </p>
                        </div>
                        
                        <div className="bg-[#622186]/5 border border-[#622186]/10 rounded-[2rem] p-8 space-y-4">
                           <h4 className="text-[10px] font-black text-[#622186] uppercase tracking-[0.2em]">Attention</h4>
                           <p className="text-xs text-neutral-500 font-semibold italic leading-relaxed">
                              You must have a ZippyPay account to purchase tickets. If you don't have one, you'll be prompted to create one in 60 seconds.
                           </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicEventDetails;
