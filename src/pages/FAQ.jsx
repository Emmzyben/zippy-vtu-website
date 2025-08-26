import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

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
          a: "You can pay for electricity (PHCN/NEPA), cable TV (DSTV, GOtv, Startimes), and other utility bills. We're constantly adding new billers."
        },
        {
            q:'What crypto currencies do you support?',
            a:'We support bitcoin, ethereum, USDT and tron buying and selling'
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
       
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <Link 
            to="/"
            className="flex items-center text-amber-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Find answers to common questions about Zippy Pay services, features, and policies.
          </p>
        </div>
      </div>
      
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
          <Link 
            to="/contact"
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 inline-block"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
