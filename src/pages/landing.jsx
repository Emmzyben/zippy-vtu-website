import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Smartphone, Zap, Shield, BarChart3, ArrowRight, Users, TrendingUp, Clock, Download, Plane } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInstall } from '../context/InstallContext';
import zippyAppImg from '../assets/zippyapp.jpeg';


const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const navigate = useNavigate();
  const { canInstall, install, isInstalled } = useInstall();


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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrollY > 50 ? 'bg-purple-900 border-b border-white/10' : 'bg-transparent'
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
            <Link to="/login" className="hidden md:block border border-white/20 text-white px-6 py-2 rounded-full font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <Link to="/register" className="hidden md:block bg-amber-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-amber-600 transition-all">
              Get Started
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-purple-900 border-t border-white/10 p-4">
            <div className="space-y-4">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 hover:text-amber-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 hover:text-amber-400 transition-colors">Features</button>
              <button onClick={() => navigate('/contact')} className="block w-full text-left py-2 hover:text-amber-400 transition-colors">Contact</button>
              <Link to="/login" className="block w-full text-center border border-white/20 text-white px-6 py-3 rounded-full font-semibold">
                Sign In
              </Link>
              <Link to="/register" className="block w-full text-center bg-amber-500 text-white px-6 py-3 rounded-full font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
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
              <Link to="/register" className="bg-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 transition-all flex items-center justify-center group shadow-xl">
                Start Now - It's Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="flex justify-center animate-slide-up">
            <div className="relative group">
              <div className="w-72 md:w-80 h-[580px] md:h-[640px] bg-black rounded-[3rem] p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden ring-4 ring-white/10">
                <img
                  src={zippyAppImg}
                  alt="Zippy Pay App"
                  className="w-full h-full object-cover rounded-[2.2rem]"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>


      <section id="features" className="py-20 bg-black/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Everything You Need in
              <span className="bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent"> One Platform</span>
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Streamline your digital payments and flight bookings with our comprehensive suite of financial services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Plane size={40} />, title: 'Flight Booking', desc: 'Book domestic and international flights at the best rates. Enjoy a seamless travel experience with instant ticketing (Coming Soon).' },
              { icon: <Smartphone size={40} />, title: 'Airtime & Data', desc: 'Instantly top up airtime and purchase data bundles for all major networks. Fast, reliable, and always available 24/7.' },
              { icon: <Zap size={40} />, title: 'Bill Payments', desc: 'Pay electricity bills, cable TV subscriptions, and internet services with just a few taps. Never miss a payment again.' },
              { icon: <Shield size={40} />, title: 'Secure Wallet', desc: 'Fund your wallet with multiple payment options including bank transfer, card payments, and USSD. Your money and transactions are always safe.' },
              { icon: <Shield size={40} />, title: 'Bank-Level Security', desc: 'Your data and funds are protected with enterprise-grade security, encryption, and fraud prevention systems.' }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all border border-white/10 animate-slide-up"
              >
                <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-amber-400">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-purple-900 rounded-3xl p-8 md:p-12 shadow-2xl relative border border-white/10">
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-block bg-white/10 px-4 py-1 rounded-full text-sm font-semibold text-white mb-2 border border-white/10">
                  New Release
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Get the Zippy Pay
                  <span className="block text-amber-300">Web Dashboard</span>
                </h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Our native Android & iOS apps are currently pending Play Store and App Store listing. In the meantime, you can install our <span className="font-bold">Progressive Web App</span> for the same seamless experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {!isInstalled ? (
                    <button
                      onClick={install}
                      className="flex items-center justify-center gap-3 bg-white text-purple-900 px-8 py-4 rounded-full font-bold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg group"
                    >
                      <Download size={24} className="group-hover:animate-bounce" />
                      <div className="text-left">
                        <div className="text-xs font-normal opacity-70">Install Web App</div>
                        <div className="text-base leading-none">Fast & Secure</div>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold border border-white/20">
                      <Clock size={24} className="" />
                      <span className="text-lg">App Installed</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-white/60">
                  * {isInstalled ? 'Web App installed. Native mobile apps coming soon to official stores.' : 'This is a web app for native use pending our official Google Play Store listing.'}
                </p>
              </div>

              <div className="hidden md:flex justify-center items-center relative">
                <div className="relative z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-700">
                  <div className="bg-black border-8 border-gray-900 rounded-[3rem] p-1 shadow-2xl w-[280px] h-[580px] overflow-hidden">
                    <img
                      src={zippyAppImg}
                      alt="Zippy Pay Dashboard"
                      className="w-full h-full object-cover rounded-[2.2rem]"
                    />
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
      <section id="stats" className="py-20 bg-black/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Users size={40} />, number: '50K+', label: 'Happy Users' },
              { icon: <TrendingUp size={40} />, number: '99.9%', label: 'Uptime' },
              { icon: <Clock size={40} />, number: '24/7', label: 'Customer Support' }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all animate-slide-up"
              >
                <div className="text-amber-400 flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  {stat.number}
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


      {/* Floating Download Widget removed as it is now in App.jsx */}

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