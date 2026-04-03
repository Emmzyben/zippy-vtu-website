import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        { q: 'How do I create a ZippyPay account?', a: 'Visit zippypay.ng and click "Get Started". You\'ll need a valid email address and phone number. After registration, verify your email to activate your account.' },
        { q: 'Is ZippyPay free to use?', a: 'Yes! Creating a ZippyPay account is completely free. We only charge small, transparent fees for certain transactions, which are always displayed before you confirm any payment.' },
        { q: 'What documents do I need for verification?', a: 'For basic access, only your email and phone are required. Future higher-limit tiers may require a valid government ID (National ID, Driver\'s License, or International Passport).' }
      ]
    },
    {
      category: 'Wallet & Payments',
      questions: [
        { q: 'How do I fund my wallet?', a: 'You can fund your wallet securely via debit card or bank transfer using our Paystack integration. Funds reflect instantly once payment is confirmed.' },
        { q: 'How long do transactions take?', a: 'Most transactions are instant! Airtime and data purchases are processed within seconds. Bill payments may take 1–10 minutes depending on the service provider.' },
        { q: 'Do you offer refunds for failed transactions?', a: 'Yes. Failed transactions are automatically reversed back to your wallet within 24 hours. If there\'s a delay, contact our support team immediately.' }
      ]
    },
    {
      category: 'Services',
      questions: [
        { q: 'Which networks are supported for airtime and data?', a: 'We support all major Nigerian networks: MTN, Airtel, Glo, and 9mobile. You can purchase airtime and data bundles for any of these networks.' },
        { q: 'What bills can I pay through ZippyPay?', a: 'You can pay electricity (PHCN/EKEDC), cable TV (DStv, GOtv, Startimes), and internet subscriptions. We\'re constantly adding new billers.' },
        { q: 'How does event ticketing work?', a: 'Browse events in the Events section, select your ticket tier, and pay directly from your wallet. You\'ll receive a secure QR code ticket immediately, which you present at the event gate.' },
        { q: 'How does flight booking work?', a: 'Our flight booking is powered by Travelstart. Navigate to the Flights section, search for your route, select your preferred flight, and complete booking through the integrated engine.' }
      ]
    },
    {
      category: 'Organizers',
      questions: [
        { q: 'How do I become an event organizer?', a: 'After creating a ZippyPay account, navigate to the Organizer section and complete the enrollment form. Once approved, you can create and publish events immediately.' },
        { q: 'How do organizer payouts work?', a: 'Ticket sale revenue is credited to your Organizer wallet balance (minus platform fees). Settlement is processed periodically and credited to your primary ZippyPay wallet.' },
        { q: 'What happens if I need to cancel or reschedule an event?', a: 'Organizers can cancel or reschedule events from the Organizer Dashboard. Cancellations trigger automatic full refunds to all ticket buyers. Reschedules notify all ticket holders with options to accept or request a refund.' }
      ]
    },
    {
      category: 'Security',
      questions: [
        { q: 'How secure is my money and data?', a: 'We use JWT-secured sessions, bcrypt password hashing, and SSL encryption on all data in transit. Payments are processed exclusively through Paystack, a CBN-licensed payment processor.' },
        { q: 'What should I do if my account is compromised?', a: 'Immediately contact our 24/7 support via WhatsApp or email. We will freeze your account and investigate any unauthorized activities right away.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-200 text-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-[#e3984d] hover:text-white transition-colors text-base font-bold mb-8">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <p className="text-xs font-bold text-[#e3984d] uppercase tracking-widest mb-3">Help Centre</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3">Frequently Asked Questions</h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            Find answers to the most common questions about ZippyPay services, features, and policies.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-16">
        {faqs.map((section, si) => (
          <div key={si} className="mb-12">
            <h2 className="text-xs font-bold text-[#e3984d] uppercase tracking-widest mb-5">{section.category}</h2>
            <div className="space-y-3">
              {section.questions.map((faq, fi) => {
                const id = `${si}-${fi}`;
                const isOpen = openFAQ === id;
                return (
                  <div key={fi} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? 'border-[#e3984d]/30' : 'border-neutral-100'}`}>
                    <button
                      onClick={() => setOpenFAQ(isOpen ? null : id)}
                      className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-neutral-50 transition-colors"
                    >
                      <span className="font-bold text-base text-neutral-900 pr-4">{faq.q}</span>
                      {isOpen
                        ? <ChevronUp className="text-[#e3984d] shrink-0" size={20} />
                        : <ChevronDown className="text-neutral-400 shrink-0" size={20} />
                      }
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-neutral-50 pt-4">
                          <p className="text-base text-neutral-500 leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-10 text-center mt-4">
          <h3 className="text-2xl font-black text-neutral-900 mb-3">Still have questions?</h3>
          <p className="text-base text-neutral-500 mb-6">Our support team is ready to help you with anything not covered here.</p>
          <Link to="/contact" className="bg-[#e3984d] text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-[#c98542] transition-all inline-block shadow-lg shadow-[#e3984d]/20">
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
