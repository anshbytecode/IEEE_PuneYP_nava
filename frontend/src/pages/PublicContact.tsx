import React, { useState } from 'react';
import { contactService } from '../services/contactService';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send } from 'lucide-react';

export const PublicContact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await contactService.submitContact(formData);
      if (res.success) {
        setSuccessMsg(res.message || 'Thank you! Your message was submitted successfully.');
        
        // Open mailto link
        const subject = encodeURIComponent(formData.subject || 'Contact Inquiry');
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
        window.location.href = `mailto:yppune@ieee.org?subject=${subject}&body=${body}`;

        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gray-50 text-gray-800 pb-20 min-h-screen">
      {/* ────────────────────────────────────────────────────────────
          1. HERO HEADER
          ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="contact-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--color-ieee-primary)" fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-dots)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ieee-light text-ieee-blue text-xs font-bold uppercase tracking-wider mb-4">
            <Mail size={12} />
            Support &amp; Inquiry
          </div>
          <h1 className="text-4xl font-bold text-ieee-dark leading-tight tracking-tight">
            Get In{' '}
            <span className="bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent">
              Touch With Us
            </span>
          </h1>
          <p className="text-gray-500 text-[15px] mt-4 max-w-2xl mx-auto leading-relaxed">
            Have questions about upcoming events, blogs, memberships, or partnerships? Send us a message below.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. TWO COLUMN LAYOUT
          ──────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Details (col-span-5) */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
                Fill out the form and our committee members will reach out to you within 2 business days.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email Inquiry</span>
                    <a href="mailto:yppune@ieee.org" className="text-gray-800 font-semibold text-[15px] hover:text-ieee-blue transition-colors">
                      yppune@ieee.org
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Affiliation Hub</span>
                    <span className="text-gray-800 font-semibold text-[15px]">IEEE Pune Section, Pune, MH, India</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Office Hours</span>
                    <span className="text-gray-800 font-semibold text-[15px]">Monday - Friday, 10:00 AM - 6:00 PM IST</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form (col-span-7) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-5"
              >
                {/* Alert Messages */}
                {successMsg && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                    {errorMsg}
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. Dr. Ramesh Kumar"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ieee-blue bg-white"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E.g. ramesh@example.com"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ieee-blue bg-white"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="E.g. Inquiring about partnership opportunities"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ieee-blue bg-white"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-semibold text-gray-700">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write details of your inquiry here..."
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ieee-blue bg-white resize-none"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-ieee-blue hover:bg-ieee-dark text-white font-bold py-3 rounded-lg text-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider"
                >
                  {loading ? (
                    <div className="spinner spinner-white"></div>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
