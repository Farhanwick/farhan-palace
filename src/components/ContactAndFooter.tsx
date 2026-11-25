import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { AppPage } from '../types/navigation';
import type { SiteCmsConfig } from '../types/cms';
import { DEFAULT_SITE_CMS } from '../data/defaultCms';
import { AnimatedSplitText, ScrollReveal } from './MotionEffects';

export type ContactTrack = 'imperion' | 'showroom' | 'clexora' | 'cinema';

interface ContactPageProps {
  selectedTrack: ContactTrack;
  onChangeTrack: (track: ContactTrack) => void;
  onNavigate: (page: AppPage) => void;
  onNotify: (msg: string) => void;
  contactCms?: SiteCmsConfig['contactPage'];
  brandCms?: SiteCmsConfig['brand'];
}

export const ContactPage: React.FC<ContactPageProps> = ({
  selectedTrack,
  onChangeTrack,
  onNavigate,
  onNotify,
  contactCms = DEFAULT_SITE_CMS.contactPage,
  brandCms = DEFAULT_SITE_CMS.brand,
}) => {
  const trackLabels = contactCms.tracks;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const handleCopy = (value: string, field: 'email' | 'phone') => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedField(field);
    onNotify(`Copied ${field}: ${value}`);
    window.setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    onNotify('Inquiry prepared for Farhan Tanvir Shuvo');
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#ffffff] text-[#11100e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <ScrollReveal direction="left" className="border-b border-[#e5e2da] pb-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
              {contactCms.eyebrow}
            </span>
            <span className="signature-ink-gold text-2xl sm:text-3xl select-none">
              {brandCms.ownerName}
            </span>
          </div>
          <AnimatedSplitText
            text={contactCms.title}
            as="h1"
            mode="mount"
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#11100e] tracking-tight mt-2"
          />
          <p className="text-xs sm:text-sm text-[#5b564c] mt-2.5 max-w-2xl leading-relaxed">
            {contactCms.subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Contact Channels */}
          <ScrollReveal className="lg:col-span-5 space-y-4" direction="left">
            {/* Official Email */}
            <div className="p-5 rounded-2xl white-panel space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <Mail className="w-5 h-5 text-[#9b7218] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c] block">
                      Official Email
                    </span>
                    <a
                      href={`mailto:${brandCms.email}`}
                      className="text-sm sm:text-base font-semibold text-[#11100e] hover:text-[#9b7218] transition-colors break-all"
                    >
                      {brandCms.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Copy email address"
                  onClick={() => handleCopy(brandCms.email, 'email')}
                  className="p-2 rounded-lg border border-[#dedad0] hover:border-[#11100e] text-[#5b564c] hover:text-[#11100e] transition-colors shrink-0 cursor-pointer"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-4 h-4 text-[#9b7218]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Direct Phone / WhatsApp */}
            <div className="p-5 rounded-2xl white-panel space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <Phone className="w-5 h-5 text-[#9b7218] shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c] block">
                      Direct Line &amp; WhatsApp
                    </span>
                    <a
                      href={`tel:${brandCms.phone.replace(/\s+/g, '')}`}
                      className="text-sm sm:text-base font-semibold text-[#11100e] hover:text-[#9b7218] transition-colors font-mono-tech"
                    >
                      {brandCms.phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Copy phone number"
                  onClick={() => handleCopy(brandCms.phone, 'phone')}
                  className="p-2 rounded-lg border border-[#dedad0] hover:border-[#11100e] text-[#5b564c] hover:text-[#11100e] transition-colors shrink-0 cursor-pointer"
                >
                  {copiedField === 'phone' ? (
                    <Check className="w-4 h-4 text-[#9b7218]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Base & Operations */}
            <div className="p-5 rounded-2xl white-panel flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-[#9b7218] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#5b564c] block">
                  Base &amp; Remote Operations
                </span>
                <span className="text-sm sm:text-base font-semibold text-[#11100e] block mt-0.5">
                  {contactCms.baseHeadline}
                </span>
                <p className="text-xs text-[#5b564c] mt-1 leading-relaxed">
                  {contactCms.baseDescription}
                </p>
              </div>
            </div>

            {/* Quick Links to Other Pages */}
            <div className="p-5 rounded-2xl white-panel bg-[#faf9f6] space-y-3">
              <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#9b7218] block">
                Explore Before Reaching Out
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="px-3.5 py-2 rounded-xl border border-[#dedad0] bg-white hover:border-[#11100e] text-xs font-semibold text-[#11100e] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Services</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('exclusive')}
                  className="px-3.5 py-2 rounded-xl border border-[#dedad0] bg-white hover:border-[#11100e] text-xs font-semibold text-[#11100e] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Exclusive Vault</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('showroom')}
                  className="px-3.5 py-2 rounded-xl border border-[#dedad0] bg-white hover:border-[#11100e] text-xs font-semibold text-[#11100e] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Showroom</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('garage')}
                  className="px-3.5 py-2 rounded-xl border border-[#dedad0] bg-white hover:border-[#11100e] text-xs font-semibold text-[#11100e] inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Garage</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive Concierge Form with Animated Window Switch */}
          <ScrollReveal className="lg:col-span-7" direction="right">
            <div className="white-panel rounded-3xl p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="submitted-brief-window"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="py-10 text-center space-y-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#9b7218] mx-auto" />
                    <h2 className="font-display text-2xl font-bold text-[#11100e]">
                      Brief Ready for {trackLabels[selectedTrack]}
                    </h2>
                    <p className="text-sm text-[#5b564c] max-w-md mx-auto">
                      Thank you, {name}. Open your mail app with your pre-filled brief below or start another inquiry.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <a
                        href={`mailto:${brandCms.email}?subject=${encodeURIComponent(
                          `[${brandCms.siteName} · ${trackLabels[selectedTrack]}] Inquiry from ${name}`
                        )}&body=${encodeURIComponent(
                          `From: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\n${message}`
                        )}`}
                        className="px-5 py-3 rounded-xl bg-[#11100e] text-white hover:bg-[#9b7218] font-display text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Send via Email App
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setName('');
                          setEmail('');
                          setPhone('');
                          setMessage('');
                        }}
                        className="px-5 py-3 rounded-xl border border-[#dedad0] text-xs font-semibold text-[#11100e] hover:border-[#11100e] cursor-pointer"
                      >
                        New Inquiry
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="concierge-form-window"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#5b564c] block mb-2.5">
                        Select Inquiry Desk
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(['imperion', 'showroom', 'clexora', 'cinema'] as ContactTrack[]).map(
                          (track) => (
                            <button
                              key={track}
                              type="button"
                              onClick={() => onChangeTrack(track)}
                              className={`p-3 min-h-[42px] rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                                selectedTrack === track
                                  ? 'bg-[#11100e] border-[#11100e] text-white'
                                  : 'bg-[#faf9f6] border-[#dedad0] text-[#36332c] hover:border-[#9b7218]'
                              }`}
                            >
                              {trackLabels[track]}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-2"
                        >
                          Your Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-4 py-2.5 text-sm text-[#11100e] placeholder:text-[#8c8577] focus:outline-none focus:border-[#9b7218]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-4 py-2.5 text-sm text-[#11100e] placeholder:text-[#8c8577] focus:outline-none focus:border-[#9b7218]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-2"
                      >
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 ..."
                        className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-4 py-2.5 text-sm text-[#11100e] placeholder:text-[#8c8577] focus:outline-none focus:border-[#9b7218]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-brief"
                        className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-2"
                      >
                        Project, Vehicle or Venture Brief *
                      </label>
                      <textarea
                        id="contact-brief"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share vehicle sourcing goals, consignment details, Clexora ops scope, or cinema project timeline..."
                        className="w-full rounded-xl bg-[#faf9f6] border border-[#dedad0] px-4 py-3 text-sm text-[#11100e] placeholder:text-[#8c8577] focus:outline-none focus:border-[#9b7218] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full min-h-[46px] py-3.5 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit to Farhan Tanvir Shuvo</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

