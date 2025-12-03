import React, { useState } from 'react';
import {
  ArrowLeft, Phone, Mail, MapPin, Clock, MessageSquare, Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
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
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-3xl">
            Get in touch with our support team. We're here to help you with any questions or issues you may have.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-1 gap-12">
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
                    <p className="text-white/80">+234 9056897432</p>
                    <p className="text-white/80">+234 8108967526</p>
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
                    <p className="text-white/80">Today Fm, east-west road,<br />Port harcourt, Rivers State, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500 rounded-lg p-3 flex-shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Live Chat</h3>
                    <p className="text-white/80">Available 24/7 in the app</p>
                    <a
                      href="https://wa.me/2349056897432"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-white transition-colors text-sm mt-1"
                    >
                      Start Chat →
                    </a>

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
                  <span className="text-amber-400">2:00 PM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Contact;
