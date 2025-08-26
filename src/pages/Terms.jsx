import React from 'react';
import { ArrowLeft, FileText, User, Smartphone, Scale, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Please read these terms carefully before using Zippy Pay services. By using our platform, you agree to these terms.
          </p>
        </div>
      </div>
      
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
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Be at least 18 years old or have parental consent</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Provide accurate and complete information</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Maintain the security of your account credentials</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Notify us immediately of any unauthorized access</li>
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
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Personal and commercial transactions</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Airtime and data purchases</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Bill payments and money transfers</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Crypto buying and selling</li>
              </ul>
              
              <p className="mt-6"><strong>Prohibited Activities:</strong></p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Money laundering or terrorist financing</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Fraud or unauthorized transactions</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Violating any applicable laws or regulations</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Attempting to hack or compromise our systems</li>
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
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Transaction fees are clearly displayed before confirmation</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Fees may vary based on transaction type and amount</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> We reserve the right to modify fees with 30 days notice</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> No hidden charges - all fees are transparent</li>
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
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Service interruptions due to maintenance or technical issues</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Third-party service provider failures</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Losses due to user negligence or account compromise</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Indirect or consequential damages</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Account Suspension</h2>
            <div className="text-white/80 space-y-4">
              <p>We may suspend or terminate your account if you:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Violate these terms of service</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Engage in suspicious or fraudulent activities</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Fail to provide required verification documents</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-red-400">❌</span> Abuse our customer support team</li>
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
};

export default Terms;
