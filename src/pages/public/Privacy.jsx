import React from 'react';
import { ArrowLeft, ShieldCheck, Mail, Database, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-[#e3984d] hover:text-white transition-colors text-base font-bold mb-8">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <p className="text-xs font-bold text-[#e3984d] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            Your privacy is our priority. This policy explains how we collect, use, and protect your personal and financial information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-16">
        <div className="mb-10 flex items-center justify-between border-b border-neutral-100 pb-5">
          <p className="text-base font-bold text-neutral-400">Effective Date: January 1, 2024</p>
          <p className="text-base font-bold text-neutral-400">Last Updated: January 1, 2024</p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-5 flex items-center gap-3">
              <Database className="text-[#e3984d]" size={28} /> Information We Collect
            </h2>
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <p className="text-base text-neutral-600 mb-4 font-semibold">We collect information you explicitly provide to us to process your transactions:</p>
              <ul className="space-y-3">
                {[
                  'Personal identification information (name, email, phone number)',
                  'Financial transaction history necessary for receipt generation',
                  'Application preferences and platform settings',
                  'Device information to ensure secure logins globally',
                  'Location data (only with your explicit device permission)'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-neutral-700">
                    <span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-5 flex items-center gap-3">
              <Eye className="text-[#e3984d]" size={28} /> How We Use Your Information
            </h2>
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <p className="text-base text-neutral-600 mb-4 font-semibold">We strictly use your data to maintain platform reliability:</p>
              <ul className="space-y-3">
                {[
                  'Process instant top-ups, ticket buys, and wallet settlements',
                  'Provide quick and accurate customer support',
                  'Prevent and detect fraudulent activity in real-time',
                  'Send transaction receipts and critical account notifications',
                  'Comply with Nigerian (CBN) financial and regulatory laws'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-neutral-700">
                    <span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-5 flex items-center gap-3">
              <ShieldCheck className="text-[#e3984d]" size={28} /> Information Sharing
            </h2>
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <p className="text-base text-neutral-600 mb-4 font-semibold">We do NOT sell or trade your data. We only share it when absolutely necessary:</p>
              <ul className="space-y-3">
                {[
                  'To Paystack to securely process and verify your wallet funding',
                  'To our billers and flight aggregators strictly for fulfilling your orders',
                  'To legal authorities when compelled by court order'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-neutral-700">
                    <span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-5 flex items-center gap-3">
              <Lock className="text-[#e3984d]" size={28} /> Data Security
            </h2>
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <p className="text-base text-neutral-600 mb-4 font-semibold">Security is non-negotiable for our digital infrastructure:</p>
              <ul className="space-y-3">
                {[
                  'Bcrypt encryption for passwords and session tokens',
                  '256-bit SSL encryption across all data transmissions',
                  'Strict JWT validation to prevent unauthorized session hijacking',
                  'No credit card numbers are ever stored on ZippyPay servers'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-neutral-700">
                    <span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-8 bg-white border border-neutral-100 rounded-2xl">
          <p className="text-base text-neutral-500 mb-4">Have concerns about your privacy or data?</p>
          <a href="mailto:support@zippypay.ng" className="inline-flex items-center gap-2 bg-[#e3984d] text-white px-8 py-3 rounded-full font-bold text-base hover:bg-[#c98542] transition-all shadow-lg shadow-[#e3984d]/20">
            <Mail size={18} /> Contact Privacy Team
          </a>
        </div>

      </div>
    </div>
  );
};

export default Privacy;
