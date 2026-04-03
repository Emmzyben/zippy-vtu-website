import React from 'react';
import { ArrowLeft, Phone, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const contacts = [
    {
      icon: <Phone size={22} />,
      title: 'Phone Support',
      lines: ['+234 9056897432', '+234 8108967526'],
      sub: 'Mon–Fri: 8AM – 8PM'
    },
    {
      icon: <Mail size={22} />,
      title: 'Email Support',
      lines: ['support@zippypay.ng'],
      sub: 'We reply within 4 hours'
    },
    {
      icon: <MapPin size={22} />,
      title: 'Office Address',
      lines: ['Today FM, East-West Road,', 'Port Harcourt, Rivers State, Nigeria'],
      sub: null
    },
    {
      icon: <MessageSquare size={22} />,
      title: 'WhatsApp / Live Chat',
      lines: ['Available 24/7 via WhatsApp'],
      sub: null,
      link: { href: 'https://wa.me/2349056897432', label: 'Start Chat →' }
    },
  ];

  const hours = [
    { day: 'Monday – Friday', time: '8:00 AM – 8:00 PM' },
    { day: 'Saturday', time: '9:00 AM – 5:00 PM' },
    { day: 'Sunday', time: '2:00 PM – 6:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-neutral-900">
      {/* Top Bar */}
      <div className="bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-[#e3984d] hover:text-white transition-colors text-base font-bold mb-8">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <p className="text-xs font-bold text-[#e3984d] uppercase tracking-widest mb-3">Support</p>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-3">Contact Us</h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            Our team is available to help you with any questions, issues, or feedback you have about ZippyPay.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contacts.map((c, i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-2xl p-6 flex items-start gap-4 hover:shadow-md hover:border-[#e3984d]/20 transition-all">
              <div className="w-12 h-12 bg-[#e3984d]/10 rounded-xl flex items-center justify-center text-[#e3984d] shrink-0">
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{c.title}</p>
                {c.lines.map((line, li) => (
                  <p key={li} className="text-base font-semibold text-neutral-800">{line}</p>
                ))}
                {c.sub && <p className="text-sm text-neutral-400 mt-1">{c.sub}</p>}
                {c.link && (
                  <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="text-[#e3984d] text-base font-bold mt-1 inline-block hover:underline">
                    {c.link.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Business Hours */}
        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={20} className="text-[#e3984d]" />
            <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Business Hours</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {hours.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <span className="text-base font-semibold text-neutral-700">{h.day}</span>
                <span className="text-base font-bold text-[#e3984d]">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-5">Also Find Us On</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { label: 'WhatsApp', href: 'https://wa.me/2349056897432' },
              { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61579397044277' },
              { label: 'Instagram', href: 'https://www.instagram.com/zippy_tech_solutions/' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="border border-neutral-200 text-neutral-700 hover:border-[#e3984d] hover:text-[#e3984d] transition-all text-base font-bold px-5 py-2.5 rounded-full">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
