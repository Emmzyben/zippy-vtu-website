import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Smartphone, Zap, Shield, ArrowRight, Users, TrendingUp,
  Clock, Download, Plane, Ticket, Calendar, CheckCircle2, Wallet,
  ShieldCheck, Activity, User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInstall } from '../../context/InstallContext';
import zippyAppImg from '../../assets/zippyapp.jpeg';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const navigate = useNavigate();
  const { install, isInstalled } = useInstall();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setVisibleSections(prev => new Set([...prev, entry.target.id]));
        });
      },
      { threshold: 0.1 }
    );
    [featuresRef, statsRef].forEach(ref => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: <Ticket size={28} />,
      title: 'Host Events & Sell Tickets',
      desc: 'Organizers: Launch events in minutes and get paid instantly. Attendees: Discover and book premium local events securely.',
      badge: 'Bestseller',
      image: '/features/ticket.jpg'
    },
    {
      icon: <Plane size={28} />,
      title: 'Flight Booking',
      desc: 'Book domestic and international flights through our platform. Compare prices and fly smarter.',
      badge: 'Live Now',
      image: '/features/flight.png'
    },
    {
      icon: <Smartphone size={28} />,
      title: 'Airtime & Data',
      desc: 'Top up airtime and buy data bundles for all major networks instantly. Fast, available 24/7, zero downtime.',
      badge: null,
      image: '/features/airtime-data.png'
    },
    {
      icon: <Zap size={28} />,
      title: 'Bill Payments',
      desc: 'Pay electricity (PHCN/EKEDC), cable TV (DStv, GOtv, Startimes), and internet subscriptions seamlessly.',
      badge: null,
      image: '/features/bills.png'
    },
    {
      icon: <Wallet size={28} />,
      title: 'Smart Wallet',
      desc: 'Fund your wallet via Paystack and pay for any service instantly. Full transaction history, real-time balance.',
      badge: null,
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop'
    },
    {
      icon: <Shield size={28} />,
      title: 'Bank-Level Security',
      desc: 'JWT-secured sessions, encrypted data, and fraud-prevention measures protect every transaction.',
      badge: null,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 overflow-x-hidden">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm' : 'bg-transparent'}`}>
        <nav className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight">
            <img src="/bg.png" alt="" className="w-50 h-15" />
          </div>

          <div className="hidden md:flex items-center space-x-8 text-base font-semibold">
            <button onClick={() => scrollToSection('features')} className="text-neutral-600 hover:text-[#e3984d] transition-colors">Features</button>
            <button onClick={() => navigate('/events')} className="text-neutral-600 hover:text-[#e3984d] transition-colors">Events</button>
            <button onClick={() => navigate('/contact')} className="text-neutral-600 hover:text-[#e3984d] transition-colors">Contact</button>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:block text-base text-neutral-700 border border-neutral-200 px-5 py-2 rounded-full font-semibold hover:bg-neutral-50 transition-all">
              Sign In
            </Link>
            <Link to="/register" className="hidden md:block bg-[#e3984d] text-white text-base px-5 py-2 rounded-full font-bold hover:bg-[#c98542] transition-all shadow-md shadow-[#e3984d]/25">
              Get Started
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-neutral-900 p-2" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-100 p-5 space-y-4 shadow-lg">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-neutral-700 hover:text-[#e3984d] text-base font-semibold">Features</button>
            <button onClick={() => navigate('/events')} className="block w-full text-left py-2 text-neutral-700 hover:text-[#e3984d] text-base font-semibold">Events</button>
            <button onClick={() => navigate('/contact')} className="block w-full text-left py-2 text-neutral-700 hover:text-[#e3984d] text-base font-semibold">Contact</button>
            <Link to="/login" className="block w-full text-center border border-neutral-200 text-neutral-800 px-6 py-3 rounded-full font-semibold text-base">Sign In</Link>
            <Link to="/register" className="block w-full text-center bg-[#e3984d] text-white px-6 py-3 rounded-full font-bold text-base">Get Started Free</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-32 pb-20">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#e3984d15_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#e3984d08_0%,_transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-8">


            <h1 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight text-neutral-900">
              Nigeria's Ultimate
              <span className="block text-[#e3984d]">Event Ticketing</span>
              <span className="block text-[#622186]">& Payment Platform</span>
            </h1>

            <p className="text-xl text-neutral-500 leading-relaxed max-w-lg">
              The premier platform for organizers to sell tickets and manage events seamlessly. Plus, pay bills, buy data, and book flights—all from a single secure wallet.
            </p>

            <div className="flex flex-wrap gap-2">
              {['Host Events', 'Sell Tickets Fast', 'Airtime & Data', 'Flight Booking', 'Smart Wallet'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-sm font-bold text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1.5">
                  <CheckCircle2 size={13} className="text-[#e3984d]" /> {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/register"
                className="bg-[#e3984d] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#c98542] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#e3984d]/25"
              >
                Start For Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="bg-neutral-50 text-neutral-700 px-8 py-4 rounded-full font-semibold text-base hover:bg-neutral-100 transition-all border border-neutral-200"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* App Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="w-64 md:w-72 h-[540px] md:h-[580px] bg-neutral-900 rounded-[3rem] p-2.5 shadow-2xl shadow-neutral-200 transform rotate-3 group-hover:rotate-0 transition-transform duration-700 overflow-hidden ring-1 ring-neutral-200">
                <img src={zippyAppImg} alt="Zippy Pay App" className="w-full h-full object-cover rounded-[2.4rem]" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#e3984d]/15 blur-3xl rounded-full" />
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-neutral-100 blur-3xl rounded-full" />
              {/* Floating badges */}
              <div className="absolute top-8 -left-8 bg-white border border-neutral-100 rounded-2xl px-4 py-3 shadow-lg shadow-neutral-200">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Events Near You</p>
                <p className="text-sm font-black text-neutral-900">12 Live Now 🎟️</p>
              </div>
              <div className="absolute bottom-16 -right-8 bg-white border border-neutral-100 rounded-2xl px-4 py-3 shadow-lg shadow-neutral-200">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Wallet Balance</p>
                <p className="text-sm font-black text-[#e3984d]">₦ 42,500.00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-[#e3984d] uppercase tracking-widest mb-4">Everything You Need</p>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-5">
              One App.
              <span className="text-[#e3984d]"> Endless </span><span className="text-[#a855f7]">Possibilities.</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              From topping up airtime to booking a flight or attending a live event - ZippyPay handles it all in one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl border border-white/10 hover:border-[#e3984d]/40 hover:shadow-lg hover:shadow-[#e3984d]/10 transition-all group relative overflow-hidden backdrop-blur-sm"
              >
                <div className="h-48 mx-4 mt-4 overflow-hidden rounded-xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 bg-[#e3984d]/10 rounded-xl flex items-center justify-center text-[#e3984d]">
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <span className="bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black mb-3 text-white">{feature.title}</h3>
                  <p className="text-neutral-400 text-base leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flight Booking Section */}
      <section id="flights" className="py-24 bg-white border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="order-2 lg:order-1 relative group">
              <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden ring-1 ring-neutral-200 shadow-2xl relative">
                <img src="/features/flight.png" alt="Flight Booking" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
                    <Plane size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="order-1 lg:order-2 space-y-8">

              <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-neutral-900">
                Ready For <span className="text-[#e3984d]">Take Off</span>?
              </h2>
              <p className="text-xl text-neutral-500 leading-relaxed">
                ZippyPay makes global travel accessible right from your smart wallet. Compare prices across top airlines, book domestic and international flights in minutes, and receive your e-tickets instantly.
              </p>
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                {[
                  'Real-Time Flight Availability & Pricing',
                  'Secure Booking',
                  'Fast Checkout',
                  'Digital Flight Itinerary Delivery'
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#e3984d]/10 text-[#e3984d] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-neutral-700 font-semibold">{perk}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-[#e3984d] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#4a1966] transition-all shadow-xl shadow-[#622186]/20 group mt-4">
                Explore Destinations <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Organizer Program Section - Compact Full-Width */}
      <section id="organizer" className="py-20 relative overflow-hidden bg-neutral-900 border-y border-neutral-800">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
            alt="Crowd Background"
            className="w-full h-full object-cover opacity-10 grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="space-y-4 mb-16 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#e3984d]/10 border border-[#e3984d]/20 rounded-full px-4 py-1.5 text-[#e3984d] text-xs font-bold uppercase tracking-widest mx-auto">
              <Calendar size={12} /> Become an Organizer
            </div>
            <h2 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight text-white uppercase">
              Host Events. <span className="text-[#e3984d]">Get Paid Instantly.</span>
            </h2>
            <p className="text-white/60 leading-relaxed text-base max-w-2xl mx-auto">
              Create your events, set custom ticket tiers and pricing, and start selling instantly. Your audience simply logs into the app, finds your event, and purchases a ticket. They receive a unique QR code which you can validate effortlessly using our built-in scanner at the gate.
            </p>
          </div>

          {/* Organizer Steps Diagram - Compact */}
          <div className="mb-24">
            <h3 className="text-white/40 font-bold text-xs uppercase tracking-[0.3em] mb-10 flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-white/10" /> How it Works <span className="w-8 h-px bg-white/10" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-[52px] left-0 right-0 h-px bg-white/5 z-0" />

              {[
                { title: 'Register', desc: 'Securely verify your identity in minutes.', icon: <User size={20} /> },
                { title: 'Create', desc: 'Setup pricing and event logistics.', icon: <Calendar size={20} /> },
                { title: 'Sell Tickets', desc: 'Begin selling tickets once event goes live.', icon: <Zap size={20} /> },
                { title: 'Validate', desc: 'Scan guests securely at the gate.', icon: <Shield size={20} /> }
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center group">
                  <div className="w-20 h-20 bg-neutral-800 border-2 border-neutral-700 rounded-full flex items-center justify-center text-[#e3984d] shadow-xl mb-4 group-hover:bg-[#e3984d] group-hover:text-white transition-all duration-300">
                    <div className="absolute -top-1 -right-1 bg-[#e3984d] text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] border-2 border-neutral-900 group-hover:bg-white group-hover:text-[#e3984d]">
                      {idx + 1}
                    </div>
                    {step.icon}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2 tracking-tight">{step.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed max-w-[140px] mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start text-left bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            <div className="space-y-10">
              <h3 className="text-white text-2xl font-black leading-tight">
                Powerful <span className="text-[#e3984d]">Organizer Tools</span>
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Instant Liquidity', desc: 'Revenue hits your ZippyPay purse instantly after each sale.', icon: <Wallet size={20} className="text-[#e3984d]" /> },
                  { title: 'Entry Management', desc: 'Proprietary gate-scanning tech to prevent fraud.', icon: <ShieldCheck size={20} className="text-[#e3984d]" /> },
                  { title: 'Sales Analytics', desc: 'Track sales metrics in real-time on your dashboard.', icon: <Activity size={20} className="text-[#e3984d]" /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-base leading-none">{item.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center gap-3 bg-[#e3984d] text-white px-8 py-4 rounded-full font-black text-base hover:bg-[#c98542] transition-all shadow-xl shadow-[#e3984d]/30 active:scale-95 group">
                GET STARTED NOW
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Organizer FAQ Accordion - Compact */}
            <div className="space-y-4 w-full">
              <h3 className="text-white text-xl font-black mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#e3984d] rounded-full" /> Quick Answers
              </h3>
              {[
                { q: "How do I list my event?", a: "Register/Login, click 'Create Event', and fill in your details instantly." },
                { q: "When do I receive funds?", a: "Funds are credited to your wallet immediately after each ticket sale." },
                { q: "What are the fees?", a: "Low-percentage commission on paid tickets. Free tickets are zero cost." },
                { q: "How do I scan tickets?", a: "Use the built-in 'Gate Scanner' on the ZippyPay app to check guests in." }
              ].map((faq, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <h4 className="text-white font-bold text-base flex items-center gap-3">
                    <span className="text-[#e3984d]">Q.</span> {faq.q}
                  </h4>
                  <p className="text-white/40 text-sm leading-relaxed mt-2 pl-7 border-l border-white/5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Install / PWA CTA */}
      <section className="py-24 bg-[#e3984d] relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
            alt="PWA Experience"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-[#e3984d]/60" />
        </div>
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-4">Progressive Web App</p>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
            ZippyPay in Your Pocket. Always.
          </h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Install our PWA for a full native app experience — directly from your browser. Native app store releases coming soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isInstalled ? (
              <button
                onClick={install}
                className="flex items-center justify-center gap-3 bg-white text-[#e3984d] px-8 py-4 rounded-full font-bold hover:bg-neutral-50 transition-all shadow-lg group"
              >
                <Download size={20} className="group-hover:animate-bounce" />
                Install Web App — It's Free
              </button>
            ) : (
              <div className="flex items-center justify-center gap-3 bg-white/20 text-white px-8 py-4 rounded-full font-bold border border-white/30 text-base">
                <CheckCircle2 size={24} /> App Already Installed
              </div>
            )}
            <Link to="/register" className="flex items-center justify-center gap-2 bg-white/15 text-white px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all text-base">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
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

export default Landing;