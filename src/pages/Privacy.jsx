import React from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
              <Eye className="mr-3" size={24} />
              Information We Collect
            </h2>
            <div className="space-y-4 text-white/80">
              <p>We collect information you provide directly to us, such as:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Personal identification information (name, email, phone number)</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Financial information necessary for transactions</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Transaction history and preferences</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Device information and usage data</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Location data (with your permission)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Eye className="mr-3" size={24} />
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-white/80">
              <p>We use the information we collect to:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Process transactions and maintain your account</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Provide customer support and respond to inquiries</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Improve our services and develop new features</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Send important notifications about your account</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Comply with legal and regulatory requirements</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Eye className="mr-3" size={24} />
              Information Sharing
            </h2>
            <div className="text-white/80 space-y-4">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> To service providers who help us operate our platform</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> When required by law or to protect our rights</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> With your explicit consent</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400 flex items-center">
              <Eye className="mr-3" size={24} />
              Data Security
            </h2>
            <div className="text-white/80 space-y-4">
              <p>We implement appropriate security measures to protect your information:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> 256-bit SSL encryption for all data transmission</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Regular security audits and updates</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Multi-factor authentication</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Secure data centers with 24/7 monitoring</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Your Rights</h2>
            <div className="text-white/80 space-y-4">
              <p>You have the right to:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Access your personal information</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Correct inaccurate data</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Request deletion of your data</li>
                <li className="flex items-start"><span className="mr-2 mt-1 text-amber-400">✔️</span> Object to processing of your data</li>
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
};

export default Privacy;
