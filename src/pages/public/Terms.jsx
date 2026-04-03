import React from 'react';
import { ArrowLeft, FileText, User, Smartphone, Scale, ShieldAlert, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-[#e3984d] hover:text-white transition-colors text-base font-bold mb-8">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <p className="text-xs font-bold text-[#e3984d] uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3">Terms of Service</h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            Please read these terms carefully before using ZippyPay services. By using our platform, you agree to comply with all terms outlined below.
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
              <FileText className="text-[#e3984d]" size={28} /> Acceptance of Terms
            </h2>
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <p className="text-base text-neutral-600 leading-relaxed font-medium">
                By accessing or using ZippyPay services (including Airtime, Data, Bills, Event Ticketing, and Flight Booking), you agree to be bound by these Terms of Service and all applicable laws and regulations in Nigeria. If you do not agree with any of these terms, you are prohibited from using our services.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-5 flex items-center gap-3">
              <User className="text-[#e3984d]" size={28} /> Account Registration
            </h2>
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <p className="text-base text-neutral-600 mb-4 font-semibold">To use ZippyPay services, you must:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> Be at least 18 years old or have parental consent</li>
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> Provide accurate, real, and complete information</li>
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> Maintain the strict confidentiality of your account credentials</li>
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> Notify us immediately of any unauthorized account access</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-5 flex items-center gap-3">
              <Smartphone className="text-[#e3984d]" size={28} /> Service Usage & Conduct
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <p className="text-base text-neutral-900 mb-4 font-black uppercase tracking-tight">Permitted Use</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-base text-neutral-600"><span className="text-green-500 shrink-0 mt-0.5">✔️</span> Personal and commercial transactions</li>
                  <li className="flex items-start gap-3 text-base text-neutral-600"><span className="text-green-500 shrink-0 mt-0.5">✔️</span> Airtime and data purchases</li>
                  <li className="flex items-start gap-3 text-base text-neutral-600"><span className="text-green-500 shrink-0 mt-0.5">✔️</span> Bill payments and wallet transfers</li>
                  <li className="flex items-start gap-3 text-base text-neutral-600"><span className="text-green-500 shrink-0 mt-0.5">✔️</span> Event ticketing & flight booking</li>
                  <li className="flex items-start gap-3 text-base text-neutral-600"><span className="text-green-500 shrink-0 mt-0.5">✔️</span> Hosting events as a registered Organizer</li>
                </ul>
              </div>
              <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                <p className="text-base text-red-900 mb-4 font-black uppercase tracking-tight flex items-center gap-2"><AlertTriangle size={18} /> Prohibited Activities</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-base text-red-800/80"><span className="text-red-500 shrink-0 mt-0.5">❌</span> Money laundering or terrorist financing</li>
                  <li className="flex items-start gap-3 text-base text-red-800/80"><span className="text-red-500 shrink-0 mt-0.5">❌</span> Fraudulent transactions (stolen cards)</li>
                  <li className="flex items-start gap-3 text-base text-red-800/80"><span className="text-red-500 shrink-0 mt-0.5">❌</span> Selling fake or strictly restricted event tickets</li>
                  <li className="flex items-start gap-3 text-base text-red-800/80"><span className="text-red-500 shrink-0 mt-0.5">❌</span> Attempting to hack or exploit our systems</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-black text-neutral-900 mb-5 flex items-center gap-3">
              <Scale className="text-[#e3984d]" size={28} /> Fees and Charges
            </h2>
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> Transaction fees are clearly displayed before confirmation</li>
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> Fees vary based on transaction type (e.g., Paystack funding fees, Organizer settlement fees)</li>
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> We reserve the right to modify fees with 30 days notice</li>
                <li className="flex items-start gap-3 text-base text-neutral-700"><span className="text-[#e3984d] shrink-0 mt-0.5">✔️</span> No hidden charges — all fees are transparently itemized</li>
              </ul>
            </div>
          </section>

          {/* Grid for Final Clauses */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="border border-neutral-100 rounded-2xl p-6">
              <h3 className="text-lg font-black text-neutral-900 mb-3 flex items-center gap-2"><ShieldAlert size={20} className="text-neutral-400" /> Disclaimers</h3>
              <p className="text-base text-neutral-500 leading-relaxed mb-3">ZippyPay provides services "as is." We are not liable for:</p>
              <ul className="space-y-2 text-base text-neutral-600">
                <li className="flex gap-2"><XCircle size={16} className="text-neutral-300 shrink-0 mt-0.5" /> Maintenance interruptions</li>
                <li className="flex gap-2"><XCircle size={16} className="text-neutral-300 shrink-0 mt-0.5" /> 3rd-party provider downtime (e.g. PHCN)</li>
                <li className="flex gap-2"><XCircle size={16} className="text-neutral-300 shrink-0 mt-0.5" /> Compromises due to weak user passwords</li>
              </ul>
            </div>

            <div className="border border-neutral-100 rounded-2xl p-6">
              <h3 className="text-lg font-black text-neutral-900 mb-3 flex items-center gap-2"><User size={20} className="text-neutral-400" /> Account Suspension</h3>
              <p className="text-base text-neutral-500 leading-relaxed mb-3">We suspend or terminate accounts instantly if you:</p>
              <ul className="space-y-2 text-base text-neutral-600">
                <li className="flex gap-2"><XCircle size={16} className="text-neutral-300 shrink-0 mt-0.5" /> Violate these terms directly</li>
                <li className="flex gap-2"><XCircle size={16} className="text-neutral-300 shrink-0 mt-0.5" /> Execute suspicious large volume funding</li>
                <li className="flex gap-2"><XCircle size={16} className="text-neutral-300 shrink-0 mt-0.5" /> Abuse or harass our support staff</li>
              </ul>
            </div>
          </div>

          <div className="border border-neutral-100 rounded-2xl p-6 bg-neutral-50">
            <h3 className="text-lg font-black text-neutral-900 mb-3">Governing Law & Disputes</h3>
            <p className="text-base text-neutral-600 leading-relaxed">
              For transaction disputes, please contact our support team within 60 days of the transaction date. We will investigate and resolve disputes fairly and promptly. These terms are governed by the laws of the Federal Republic of Nigeria. Any unresolved legal proceedings must be brought in the courts of Rivers State, Nigeria.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Terms;
