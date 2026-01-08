import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Smartphone, Zap, Shield, BarChart3, ArrowRight, Users, TrendingUp, Clock, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
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

    [heroRef, featuresRef, statsRef].forEach(ref => {
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 100 ? 'bg-purple-900/95 backdrop-blur-lg' : 'bg-white/10 backdrop-blur-sm'
        }`}>
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent">
            Zippy Pay
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="hover:text-amber-400 transition-colors">Home</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-amber-400 transition-colors">Features</button>

            <button onClick={() => navigate('/contact')} className="hover:text-amber-400 transition-colors">Contact</button>
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

              <button onClick={() => navigate('/contact')} className="block w-full text-left hover:text-amber-400 transition-colors">Contact</button>
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
              Top up airtime, buy data, pay bills, Buy crypto and manage your wallet with Nigeria's most trusted payment platform. Join thousands of satisfied users today!
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


      <section id="features" ref={featuresRef} className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-16 ${visibleSections.has('features') ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need in
              <span className="bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent"> One Platform</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Streamline your digital payments and crypto transactions with our comprehensive suite of financial services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <BarChart3 size={40} />, title: 'Crypto Buy & Sell', desc: 'Buy and sell cryptocurrencies securely. Enjoy fast transactions, competitive rates, and instant wallet funding.' },
              { icon: <Smartphone size={40} />, title: 'Airtime & Data', desc: 'Instantly top up airtime and purchase data bundles for all major networks. Fast, reliable, and always available 24/7.' },
              { icon: <Zap size={40} />, title: 'Bill Payments', desc: 'Pay electricity bills, cable TV subscriptions, and internet services with just a few taps. Never miss a payment again.' },
              { icon: <Shield size={40} />, title: 'Secure Wallet', desc: 'Fund your wallet with multiple payment options including bank transfer, card payments, and USSD. Your money and crypto are always safe.' },
              { icon: <Shield size={40} />, title: 'Bank-Level Security', desc: 'Your data, money, and crypto are protected with enterprise-grade security, encryption, and fraud prevention systems.' }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border border-white/20 ${visibleSections.has('features') ? 'animate-slide-up' : 'opacity-0'
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



      {/* Mobile App Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-800/80 to-amber-600/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative border border-white/20">
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-white mb-2 border border-white/10">
                  New Release
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Get the Zippy Pay
                  <span className="block text-amber-300">Mobile App</span>
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Download our official Android app for a seamless experience. Manage your wallet, pay bills, and trade crypto faster than ever before.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="https://expo.dev/artifacts/eas/cDSVnZkkLMMffJfnYkyH2o.apk" // Actual link
                    className="flex items-center justify-center gap-3 bg-white text-purple-900 px-8 py-4 rounded-full font-bold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg group"
                  >
                    <Download size={24} className="group-hover:animate-bounce" />
                    <div className="text-left">
                      <div className="text-xs font-normal opacity-70">Download APK</div>
                      <div className="text-base leading-none">For Android</div>
                    </div>
                  </a>
                </div>
                <p className="text-sm text-white/60">
                  * Requires Android 8.0 or higher. iOS version coming soon.
                </p>
              </div>

              <div className="hidden md:flex justify-center items-center relative">
                <div className="relative z-10 transform rotate-12 hover:rotate-6 transition-transform duration-500">
                  <div className="bg-black border-4 border-gray-800 rounded-[3rem] p-2 shadow-2xl w-[280px]">
                    <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden h-[550px] relative">
                      {/* App Screen Mockup */}
                      <div className="bg-purple-900 h-full w-full p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                          <Menu size={20} className="text-white" />
                          <div className="text-white font-bold">Zippy Pay</div>
                          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-xs text-white">ZP</div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 mb-6">
                          <div className="text-white/60 text-xs">Total Balance</div>
                          <div className="text-white text-2xl font-bold">₦24,500.00</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 p-3 rounded-xl flex flex-col items-center gap-2">
                            <Smartphone size={20} className="text-amber-400" />
                            <span className="text-white text-xs">Airtime</span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl flex flex-col items-center gap-2">
                            <BarChart3 size={20} className="text-amber-400" />
                            <span className="text-white text-xs">Data</span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl flex flex-col items-center gap-2">
                            <Zap size={20} className="text-amber-400" />
                            <span className="text-white text-xs">Electricity</span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl flex flex-col items-center gap-2">
                            <Shield size={20} className="text-amber-400" />
                            <span className="text-white text-xs">Cable</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full"></div>
              </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
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
                className={`text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 ${visibleSections.has('stats') ? 'animate-slide-up' : 'opacity-0'
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
                <Link to="/contact" className="block text-white/80 hover:text-white transition-colors text-left">
                  Contact Us
                </Link>
                <Link to="/faq" className="block text-white/80 hover:text-white transition-colors text-left">
                  FAQs
                </Link>
                <Link to="/privacy" className="block text-white/80 hover:text-white transition-colors text-left">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="block text-white/80 hover:text-white transition-colors text-left">
                  Terms of Service
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-amber-400 mb-6">Connect</h4>
              <div className="space-y-3">
                <a
                  href="https://wa.me/2349056897432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61579397044277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/zippy_tech_solutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/80">
              &copy; 2024 Zippy Pay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>


      {/* Floating Download Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://expo.dev/artifacts/eas/cDSVnZkkLMMffJfnYkyH2o.apk"
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-md">
            <Smartphone size={20} className="group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-semibold text-sm md:text-base">Get Mobile App</span>
        </a>
      </div>

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