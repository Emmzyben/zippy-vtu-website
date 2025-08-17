import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Smartphone, Zap, Shield, DollarSign, BarChart3, Gift, ArrowRight, Users, TrendingUp, Clock, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const referralRef = useRef(null);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    [heroRef, featuresRef, referralRef, statsRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (visibleSections.has('stats') && !hasStarted) {
        setHasStarted(true);
        const increment = target / 50;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCount(Math.floor(current));
        }, 30);
      }
    }, [visibleSections, target, hasStarted]);

    return <span>{prefix}{count}{suffix}</span>;
  };

  const FloatingElement = ({ children, delay = 0 }) => {
    return (
      <div 
        className="absolute text-4xl opacity-30 animate-bounce"
        style={{
          animationDelay: `${delay}s`,
          animationDuration: '3s'
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 100 ? 'bg-purple-900/95 backdrop-blur-lg' : 'bg-white/10 backdrop-blur-sm'
      }`}>
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent">
            Zippy Pay
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="hover:text-amber-400 transition-colors">Home</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-amber-400 transition-colors">Features</button>
            <button onClick={() => scrollToSection('referrals')} className="hover:text-amber-400 transition-colors">Referrals</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-amber-400 transition-colors">Contact</button>
          </div>

          <div className="flex items-center space-x-4">
           <button className="hidden md:block border text-white px-6 py-2 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
               <Link to="/login" >
                    Sign In
                  </Link>
            </button>
            <button className="hidden md:block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
             <Link to="/register" >
                    Get Started
                  </Link>
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-purple-900/95 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left hover:text-amber-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left hover:text-amber-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('referrals')} className="block w-full text-left hover:text-amber-400 transition-colors">Referrals</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left hover:text-amber-400 transition-colors">Contact</button>
             <button className="w-full border text-white px-6 py-3 rounded-full font-semibold">
              <Link to="/login" >
                    Sign In
                  </Link>
              </button>
              <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-full font-semibold">
                 <Link to="/register" >
                    Get Started
                  </Link>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden pt-20">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 ${visibleSections.has('home') ? 'animate-fade-in' : 'opacity-0'}`}>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Lightning Fast
              <span className="bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent block">
                Digital Payments
              </span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Top up airtime, buy data, pay bills, and manage your wallet with Nigeria's most trusted payment platform. Join thousands of satisfied users today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center group">
              
                 <Link to="/register" >
                     Start Now - It's Free
                  </Link>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/20"
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div className={`flex justify-center ${visibleSections.has('home') ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="relative">
              <div className="w-80 h-[600px] bg-gradient-to-br from-purple-800 to-purple-900 rounded-[3rem] p-6 shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-500">
                <div className="w-full h-full bg-gradient-to-br from-purple-700 to-amber-600 rounded-[2rem] p-6 flex flex-col">
                  <div className="text-center mb-8">
                    <div className="text-2xl font-bold text-white">Zippy Pay</div>
                    <div className="text-white/80 text-sm">Digital Wallet</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 text-center">
                    <div className="text-white/80 text-sm mb-2">Wallet Balance</div>
                    <div className="text-3xl font-bold text-white mb-4">₦15,750.00</div>
                    <button className="bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
                      Add Money
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Smartphone size={24} />, label: 'Airtime' },
                      { icon: <BarChart3 size={24} />, label: 'Data' },
                      { icon: <Zap size={24} />, label: 'Electricity' },
                      { icon: '📺', label: 'Cable TV' }
                    ].map((service, index) => (
                      <div key={index} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/25 transition-colors cursor-pointer">
                        <div className="text-white mb-2 flex justify-center">
                          {typeof service.icon === 'string' ? service.icon : service.icon}
                        </div>
                        <div className="text-white text-sm font-medium">{service.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <FloatingElement delay={0}>
                <div className="top-10 -left-10">💳</div>
              </FloatingElement>
              <FloatingElement delay={1}>
                <div className="top-32 -right-12">⚡</div>
              </FloatingElement>
              <FloatingElement delay={2}>
                <div className="bottom-20 -left-8">📱</div>
              </FloatingElement>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-16 ${visibleSections.has('features') ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need in 
              <span className="bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent"> One Platform</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Streamline your digital payments with our comprehensive suite of financial services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Smartphone size={40} />, title: 'Airtime & Data', desc: 'Instantly top up airtime and purchase data bundles for all major networks. Fast, reliable, and always available 24/7.' },
              { icon: <Zap size={40} />, title: 'Bill Payments', desc: 'Pay electricity bills, cable TV subscriptions, and internet services with just a few taps. Never miss a payment again.' },
              { icon: <Shield size={40} />, title: 'Secure Wallet', desc: 'Fund your wallet with multiple payment options including bank transfer, card payments, and USSD. Your money is always safe.' },
              { icon: <BarChart3 size={40} />, title: 'Transaction History', desc: 'Keep track of all your payments and transactions with detailed history and receipts. Complete transparency.' },
              { icon: <Gift size={40} />, title: 'Referral Rewards', desc: 'Earn money by inviting friends! Get rewarded for every successful referral and build your passive income.' },
              { icon: <Shield size={40} />, title: 'Bank-Level Security', desc: 'Your data and money are protected with enterprise-grade security, encryption, and fraud prevention systems.' }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border border-white/20 ${
                  visibleSections.has('features') ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section id="referrals" ref={referralRef} className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 ${
            visibleSections.has('referrals') ? 'animate-fade-in' : 'opacity-0'
          }`}>
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Earn with Every 
                <span className="bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent"> Referral</span>
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Share your unique referral code and earn rewards when friends join and make their first transaction
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
                <h3 className="text-2xl font-semibold text-amber-400 mb-6">Your Referral Code</h3>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold tracking-wider mb-6 inline-block">
                  ZIPPY2024
                </div>
                <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 border border-white/20">
                  Share Code
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-4">
                  <div className="text-5xl font-bold text-amber-400">₦500</div>
                  <p className="text-white/80">Per successful referral</p>
                </div>
                <div className="space-y-4">
                  <div className="text-5xl font-bold text-amber-400">₦200</div>
                  <p className="text-white/80">Bonus for your friend</p>
                </div>
                <div className="space-y-4">
                  <div className="text-5xl font-bold text-amber-400">∞</div>
                  <p className="text-white/80">Unlimited referrals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="py-20 bg-black/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Users size={40} />, number: 50, suffix: 'K+', label: 'Happy Users' },
              { icon: <TrendingUp size={40} />, number: 99.9, suffix: '%', label: 'Uptime' },
              { icon: <Clock size={40} />, number: 24, suffix: '/7', label: 'Customer Support' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 ${
                  visibleSections.has('stats') ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-amber-400 flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black/30 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div>
              <h4 className="text-xl font-bold text-amber-400 mb-6">Services</h4>
              <div className="space-y-3">
                {['Airtime Top-up', 'Data Bundles', 'Electricity Bills', 'Cable TV'].map(service => (
                  <button key={service} className="block text-white/80 hover:text-white transition-colors text-left">
                    {service}
                  </button>
                ))}
              </div>
            </div>
            
           
            
            <div>
              <h4 className="text-xl font-bold text-amber-400 mb-6">Company</h4>
              <div className="space-y-3">
                {['Contact Us', 'FAQs', 'Privacy Policy', 'Terms of Service'].map(item => (
                  <button key={item} className="block text-white/80 hover:text-white transition-colors text-left">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-amber-400 mb-6">Connect</h4>
              <div className="space-y-3">
                {['Twitter', 'Instagram', 'Facebook', 'WhatsApp'].map(social => (
                  <button key={social} className="block text-white/80 hover:text-white transition-colors text-left">
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/80">
              &copy; 2024 Zippy Pay. All rights reserved. Built with ❤️ in Nigeria
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Landing;