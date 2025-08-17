import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Phone, Mail, MapPin, Clock, MessageSquare, 
  ChevronDown, ChevronUp, Shield, Lock, Eye, UserCheck,
  FileText, Scale, AlertTriangle, CheckCircle, 
  Send, User, Smartphone
} from 'lucide-react';

const AdditionalPages = () => {
  const [currentPage, setCurrentPage] = useState('contact');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  // Header Component
  const Header = ({ title, subtitle }) => (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <button 
          onClick={() => setCurrentPage('contact')}
          className="flex items-center text-amber-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Main
        </button>
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl text-white/80 max-w-3xl">{subtitle}</p>
      </div>
    </div>
  );

  // Contact Us Page
  const ContactPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
      <Header 
        title="Contact Us"
        subtitle="Get in touch with our support team. We're here to help you with any questions or issues you may have."
      />
      
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-amber-400 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500 rounded-lg p-3 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone Support</h3>
                    <p className="text-white/80">+234 800 123 4567</p>
                    <p className="text-sm text-white/60">Monday - Friday: 8AM - 8PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500 rounded-lg p-3 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Support</h3>
                    <p className="text-white/80">support@zippypay.ng</p>
                    <p className="text-sm text-white/60">Response within 4 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500 rounded-lg p-3 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Office Address</h3>
                    <p className="text-white/80">123 Victoria Island,<br />Lagos, Nigeria</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500 rounded-lg p-3 flex-shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Live Chat</h3>
                    <p className="text-white/80">Available 24/7 in the app</p>
                    <button className="text-amber-400 hover:text-white transition-colors text-sm mt-1">
                      Start Chat →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Business Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-amber-400 mb-6">Business Hours</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-amber-400">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-amber-400">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white/60">Closed</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-amber-400 mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="account">Account Issues</option>
                  <option value="transaction">Transaction Problems</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Inquiry</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all resize-none"
                  placeholder="Please describe your inquiry in detail..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center"
              >
                <Send className="mr-2" size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // FAQ Page
  const FAQPage = () => {
    const faqs = [
      {
        category: "Getting Started",
        questions: [
          {
            q: "How do I create a Zippy Pay account?",
            a: "Download the Zippy Pay app from the App Store or Google Play, then tap 'Sign Up' and follow the simple registration process. You'll need your phone number and email address to get started."
          },
          {
            q: "Is Zippy Pay free to use?",
            a: "Yes! Creating a Zippy Pay account is completely free. We only charge small, transparent fees for certain transactions, which are always displayed before you confirm any payment."
          },
          {
            q: "What documents do I need for verification?",
            a: "For basic verification, you only need your phone number. For higher transaction limits, you may need to provide a valid ID (National ID, Driver's License, or International Passport) and proof of address."
          }
        ]
      },
      {
        category: "Wallet & Payments",
        questions: [
          {
            q: "How do I add money to my wallet?",
            a: "You can fund your wallet through bank transfer, debit card, USSD codes, or at any of our partner locations. All funding methods are secure and processed instantly."
          },
          {
            q: "What are the transaction limits?",
            a: "Daily limits vary by verification level: Basic (₦50,000), Intermediate (₦200,000), and Premium (₦1,000,000). Monthly limits are 10x the daily limits."
          },
          {
            q: "How long do transactions take to process?",
            a: "Most transactions are instant! Airtime and data purchases are processed within seconds. Bill payments may take 1-10 minutes depending on the service provider."
          },
          {
            q: "Can I withdraw money from my wallet?",
            a: "Yes, you can withdraw funds to any Nigerian bank account. Withdrawals typically process within 1-2 business hours during banking hours."
          }
        ]
      },
      {
        category: "Services",
        questions: [
          {
            q: "Which networks do you support for airtime and data?",
            a: "We support all major Nigerian networks: MTN, Airtel, Glo, and 9mobile. You can purchase airtime and data bundles for any of these networks."
          },
          {
            q: "What bills can I pay through Zippy Pay?",
            a: "You can pay for electricity (PHCN/NEPA), cable TV (DSTV, GOtv, Startimes), internet services, and other utility bills. We're constantly adding new billers."
          },
          {
            q: "Do you offer refunds for failed transactions?",
            a: "Yes, failed transactions are automatically refunded to your wallet within 24 hours. If you don't receive your refund, please contact our support team."
          }
        ]
      },
      {
        category: "Security",
        questions: [
          {
            q: "How secure is my money and data?",
            a: "We use bank-level security including 256-bit SSL encryption, two-factor authentication, and fraud monitoring systems. Your funds are also insured and held in regulated financial institutions."
          },
          {
            q: "What should I do if my account is compromised?",
            a: "Immediately contact our 24/7 support team or use the 'Report Issue' feature in the app. We'll freeze your account and investigate any unauthorized activities."
          },
          {
            q: "Can I set spending limits?",
            a: "Yes, you can set daily and monthly spending limits for different transaction types in your account settings for added security."
          }
        ]
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
        <Header 
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about Zippy Pay services, features, and policies."
        />
        
        <div className="max-w-4xl mx-auto px-4 py-20">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-8">{category.category}</h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const faqId = `${categoryIndex}-${faqIndex}`;
                  return (
                    <div key={faqIndex} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === faqId ? null : faqId)}
                        className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors"
                      >
                        <h3 className="font-semibold text-lg pr-4">{faq.q}</h3>
                        {openFAQ === faqId ? 
                          <ChevronUp className="text-amber-400 flex-shrink-0" size={24} /> : 
                          <ChevronDown className="text-amber-400 flex-shrink-0" size={24} />
                        }
                      </button>
                      
                      {openFAQ === faqId && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-white/10 pt-4">
                            <p className="text-white/80 leading-relaxed">{faq.a}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="text-center mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Still have questions?</h3>
            <p className="text-white/80 mb-6">Can't find the answer you're looking for? Our support team is here to help!</p>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Privacy Policy Page
  const PrivacyPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
      <Header 
        title="Privacy Policy"
        subtitle="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
      />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 space-y-8">
          <div className="text-center mb-8">
            <p className="text-white/80">Effective Date: January 1, 2024</p>
            <p className="text-white/80">Last Updated: January 1, 2024</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Eye className="mr-3" size={24} />
              Information We Collect
            </h2>
            <div className="space-y-4 text-white/80">
              <p>We collect information you provide directly to us, such as:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Personal identification information (name, email, phone number)</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Financial information necessary for transactions</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Transaction history and preferences</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Device information and usage data</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Location data (with your permission)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <UserCheck className="mr-3" size={24} />
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-white/80">
              <p>We use the information we collect to:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Process transactions and maintain your account</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Provide customer support and respond to inquiries</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Improve our services and develop new features</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Send important notifications about your account</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Comply with legal and regulatory requirements</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Shield className="mr-3" size={24} />
              Information Sharing
            </h2>
            <div className="text-white/80 space-y-4">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> To service providers who help us operate our platform</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> When required by law or to protect our rights</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> With your explicit consent</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Lock className="mr-3" size={24} />
              Data Security
            </h2>
            <div className="text-white/80 space-y-4">
              <p>We implement appropriate security measures to protect your information:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> 256-bit SSL encryption for all data transmission</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Regular security audits and updates</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Multi-factor authentication</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Secure data centers with 24/7 monitoring</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Your Rights</h2>
            <div className="text-white/80 space-y-4">
              <p>You have the right to:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Access your personal information</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Correct inaccurate data</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Request deletion of your data</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Object to processing of your data</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Contact Information</h2>
            <div className="text-white/80">
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> privacy@zippypay.ng</p>
                <p><strong>Phone:</strong> +234 800 123 4567</p>
                <p><strong>Address:</strong> 123 Victoria Island, Lagos, Nigeria</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // Terms of Service Page
  const TermsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
      <Header 
        title="Terms of Service"
        subtitle="Please read these terms carefully before using Zippy Pay services. By using our platform, you agree to these terms."
      />
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 space-y-8">
          <div className="text-center mb-8">
            <p className="text-white/80">Effective Date: January 1, 2024</p>
            <p className="text-white/80">Last Updated: January 1, 2024</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <FileText className="mr-3" size={24} />
              Acceptance of Terms
            </h2>
            <div className="text-white/80 space-y-4">
              <p>
                By accessing or using Zippy Pay services, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using our services.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <User className="mr-3" size={24} />
              Account Registration
            </h2>
            <div className="text-white/80 space-y-4">
              <p>To use Zippy Pay services, you must:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Be at least 18 years old or have parental consent</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Provide accurate and complete information</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Maintain the security of your account credentials</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Notify us immediately of any unauthorized access</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Smartphone className="mr-3" size={24} />
              Service Usage
            </h2>
            <div className="text-white/80 space-y-4">
              <p><strong>Permitted Use:</strong></p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Personal and commercial transactions</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Airtime and data purchases</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Bill payments and money transfers</li>
              </ul>
              
              <p className="mt-6"><strong>Prohibited Activities:</strong></p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Money laundering or terrorist financing</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Fraud or unauthorized transactions</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Violating any applicable laws or regulations</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Attempting to hack or compromise our systems</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Scale className="mr-3" size={24} />
              Fees and Charges
            </h2>
            <div className="text-white/80 space-y-4">
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Transaction fees are clearly displayed before confirmation</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> Fees may vary based on transaction type and amount</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> We reserve the right to modify fees with 30 days notice</li>
                <li className="flex items-start"><CheckCircle className="mr-2 mt-1 text-amber-400" size={16} /> No hidden charges - all fees are transparent</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Liability and Disclaimers</h2>
            <div className="text-white/80 space-y-4">
              <p>
                Zippy Pay provides services "as is" without warranties. We are not liable for:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Service interruptions due to maintenance or technical issues</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Third-party service provider failures</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Losses due to user negligence or account compromise</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Indirect or consequential damages</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Account Suspension</h2>
            <div className="text-white/80 space-y-4">
              <p>We may suspend or terminate your account if you:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Violate these terms of service</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Engage in suspicious or fraudulent activities</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Fail to provide required verification documents</li>
                <li className="flex items-start"><AlertTriangle className="mr-2 mt-1 text-red-400" size={16} /> Abuse our customer support team</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Dispute Resolution</h2>
            <div className="text-white/80 space-y-4">
              <p>
                For transaction disputes, please contact our support team within 60 days of the transaction date. 
                We will investigate and resolve disputes fairly and promptly. Any unresolved disputes will be 
                subject to arbitration under Nigerian law.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Changes to Terms</h2>
            <div className="text-white/80 space-y-4">
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting to our website or app. Continued use of our services constitutes acceptance of 
                the modified terms.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Governing Law</h2>
            <div className="text-white/80 space-y-4">
              <p>
                These terms are governed by the laws of the Federal Republic of Nigeria. Any legal proceedings 
                must be brought in the courts of Lagos State, Nigeria.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Contact Information</h2>
            <div className="text-white/80">
              <p>For questions about these Terms of Service, contact us:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> legal@zippypay.ng</p>
                <p><strong>Phone:</strong> +234 800 123 4567</p>
                <p><strong>Address:</strong> 123 Victoria Island, Lagos, Nigeria</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // Page Navigation
  const PageSelector = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Zippy Pay 
            <span className="bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent"> Pages</span>
          </h1>
          <p className="text-xl text-white/80">
            Select a page to view
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { key: 'contact', title: 'Contact Us', desc: 'Get in touch with our support team', icon: <Phone size={40} /> },
            { key: 'faq', title: 'FAQs', desc: 'Find answers to common questions', icon: <MessageSquare size={40} /> },
            { key: 'privacy', title: 'Privacy Policy', desc: 'How we protect your data', icon: <Shield size={40} /> },
            { key: 'terms', title: 'Terms of Service', desc: 'Our service terms and conditions', icon: <FileText size={40} /> }
          ].map((page) => (
            <button
              key={page.key}
              onClick={() => setCurrentPage(page.key)}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border border-white/20 group"
            >
              <div className="text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                {page.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400 group-hover:text-white transition-colors">
                {page.title}
              </h3>
              <p className="text-white/80 group-hover:text-white transition-colors">
                {page.desc}
              </p>
              <div className="flex items-center mt-6 text-amber-400 group-hover:translate-x-2 transition-transform">
                <span className="mr-2">View Page</span>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Main Render
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'contact': return <ContactPage />;
      case 'faq': return <FAQPage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      default: return <PageSelector />;
    }
  };

  return (
    <div className="font-sans">
      {renderCurrentPage()}
    </div>
  );
};

export default AdditionalPages;