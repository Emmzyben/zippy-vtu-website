import React, { useState, useEffect } from 'react';
import {
  Calendar, Ticket, User, Zap, Shield, ArrowRight,
  MapPin, Clock, CheckCircle2, Star, Users, Briefcase
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketingService } from '../../services/ticketingService';
import LoadingSpinner from '../../components/LoadingSpinner';

const EventsInfo = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await ticketingService.getEvents();
        if (response.success) {
          // Sort by date and take first 3 for upcoming
          const sorted = (response.data || [])
            .filter(e => new Date(e.event_date) > new Date())
            .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
            .slice(0, 3);
          setEvents(sorted);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const features = [
    {
      icon: <Ticket className="text-[#e3984d]" size={24} />,
      title: 'Digital Ticketing',
      desc: 'No more physical papers. Get unique QR-encrypted tickets directly in your ZippyPay wallet instantly after purchase.'
    },
    {
      icon: <Zap className="text-[#e3984d]" size={24} />,
      title: 'Instant Transfers',
      desc: 'Funding your wallet via Paystack ensures checkouts are faster than any traditional payment method.'
    },
    {
      icon: <Shield className="text-[#e3984d]" size={24} />,
      title: 'Secure Validation',
      desc: 'Our proprietary gate-scanning technology ensures every ticket is authentic, preventing fraud and duplicates.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
            alt="Concert Crowd"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[#e3984d] hover:text-white transition-colors mb-8 font-bold text-sm">
            <ArrowRight className="rotate-180" size={16} /> Back to Home
          </Link>
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tighter uppercase">
              <span className="text-[#622186]">Sell Out</span> Your<br />
              <span className="text-[#e3984d]">Next Event</span>
            </h1>
            <p className="text-xl text-white/60 mb-10 leading-relaxed font-medium">
              Join thousands of organizers across Nigeria. Launch your event, sell digital tickets instantly, and get paid with zero settlement delays.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-[#e3984d] text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#c98542] transition-all shadow-xl shadow-[#e3984d]/20">
                Start Selling Tickets
              </Link>
              <button onClick={() => document.getElementById('upcoming-events').scrollIntoView({ behavior: 'smooth' })} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                View Live Events
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Upcoming Events Section */}
      <section id="upcoming-events" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#e3984d] uppercase tracking-[0.3em]">Live Feed</p>
              <h2 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tighter uppercase italic">Upcoming <span className="text-neutral-300">Moments</span></h2>
            </div>
            <Link to="/register" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-[#e3984d] transition-colors">
              Sign in to see all <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100">
              <Zap className="text-neutral-200 animate-pulse mb-4" size={40} />
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Scanning blockchain for events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group block bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:border-[#e3984d]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#e3984d]/10"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={event.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-neutral-900 uppercase tracking-widest">
                      {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <h3 className="text-2xl font-black text-neutral-900 leading-tight uppercase group-hover:text-[#e3984d] transition-colors line-clamp-2 italic">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-neutral-400 text-[10px] font-bold uppercase tracking-widest border-t border-neutral-50 pt-6">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#e3984d]" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Clock size={14} className="text-[#e3984d]" />
                        <span>{new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
              <Calendar className="mx-auto text-neutral-200 mb-6" size={60} strokeWidth={1} />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">No Public Events Scheduled</h3>
              <p className="text-neutral-500 text-sm italic font-medium">Be the first to host an experience when the next slot opens.</p>
            </div>
          )}
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-neutral-900 py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="font-black text-2xl mb-4">
                <span className="text-[#e3984d]">Zippy</span><span className="text-white">Pay</span>
              </div>
              <p className="text-white/40 text-base leading-relaxed">Nigeria's all-in-one platform for payments, event tickets, and flight bookings.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#e3984d] uppercase tracking-widest mb-5">Services</h4>
              <div className="space-y-3">
                {['Airtime Top-up', 'Data Bundles', 'Electricity Bills', 'Cable TV', 'Event Tickets', 'Flight Booking'].map(s => (
                  <p key={s} className="text-white/40 hover:text-white/60 transition-colors text-base cursor-pointer">{s}</p>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#e3984d] uppercase tracking-widest mb-5">Company</h4>
              <div className="space-y-3">
                <Link to="/contact" className="block text-white/40 hover:text-white/60 transition-colors text-base">Contact Us</Link>
                <Link to="/faq" className="block text-white/40 hover:text-white/60 transition-colors text-base">FAQs</Link>
                <Link to="/privacy" className="block text-white/40 hover:text-white/60 transition-colors text-base">Privacy Policy</Link>
                <Link to="/terms" className="block text-white/40 hover:text-white/60 transition-colors text-base">Terms of Service</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#e3984d] uppercase tracking-widest mb-5">Connect</h4>
              <div className="space-y-3">
                <a href="https://wa.me/2349056897432" target="_blank" rel="noopener noreferrer" className="block text-white/40 hover:text-white/60 transition-colors text-base">WhatsApp</a>
                <a href="https://www.facebook.com/profile.php?id=61579397044277" target="_blank" rel="noopener noreferrer" className="block text-white/40 hover:text-white/60 transition-colors text-base">Facebook</a>
                <a href="https://www.instagram.com/zippy_tech_solutions/" target="_blank" rel="noopener noreferrer" className="block text-white/40 hover:text-white/60 transition-colors text-base">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-base">© {new Date().getFullYear()} ZippyPay. All rights reserved.</p>
            <p className="text-white/15 text-sm">Powered by Travelstart · Secured by Paystack</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventsInfo;
