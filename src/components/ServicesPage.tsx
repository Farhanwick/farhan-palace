import React, { useMemo, useState } from 'react';
import {
  Film,
  Briefcase,
  CarFront,
  Gem,
  Wrench,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import type { SiteCmsConfig, ServiceOffering } from '../types/cms';
import type { AppPage } from '../types/navigation';
import type { ContactTrack } from './ContactAndFooter';
import { AnimatedSplitText, ScrollReveal } from './MotionEffects';

interface ServicesPageProps {
  cms: SiteCmsConfig['servicesPage'];
  onNavigate: (page: AppPage) => void;
  onSelectContactTrack: (track: ContactTrack) => void;
}

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Visual Production': Film,
  'Operations & Execution': Briefcase,
  'Automotive Brokerage': CarFront,
  'Private Collector Trading': Gem,
  'Performance Hardware': Wrench,
};

const TRACK_FOR_SERVICE: Record<string, ContactTrack> = {
  'Visual Production': 'cinema',
  'Operations & Execution': 'clexora',
  'Automotive Brokerage': 'showroom',
  'Private Collector Trading': 'imperion',
  'Performance Hardware': 'showroom',
};

const TARGET_FOR_SERVICE: Record<string, AppPage> = {
  'Visual Production': 'home',
  'Operations & Execution': 'about',
  'Automotive Brokerage': 'showroom',
  'Private Collector Trading': 'exclusive',
  'Performance Hardware': 'garage',
};

export const ServicesPage: React.FC<ServicesPageProps> = ({
  cms,
  onNavigate,
  onSelectContactTrack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(cms.items.map((item) => item.category)));
    return ['All', ...unique];
  }, [cms.items]);

  const visibleServices = useMemo(() => {
    if (selectedCategory === 'All') return cms.items;
    return cms.items.filter((item) => item.category === selectedCategory);
  }, [cms.items, selectedCategory]);

  const handleInquireService = (svc: ServiceOffering) => {
    const track = TRACK_FOR_SERVICE[svc.category] || 'imperion';
    onSelectContactTrack(track);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#ffffff] text-[#11100e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <ScrollReveal direction="left" className="border-b border-[#e5e2da] pb-6 space-y-4">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
                {cms.eyebrow}
              </span>
              <span className="signature-ink-gold text-2xl sm:text-3xl select-none">
                {cms.signature}
              </span>
            </div>
            <AnimatedSplitText
              text={cms.title}
              as="h1"
              mode="mount"
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#11100e] tracking-tight mt-2 text-balance"
            />
            <p className="text-xs sm:text-sm text-[#5b564c] mt-2.5 max-w-2xl leading-relaxed">
              {cms.subtitle}
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#11100e] text-white border-[#11100e]'
                    : 'bg-[#faf9f6] text-[#36332c] border-[#e5e2da] hover:border-[#b5892a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Payment Terms Notice Panel */}
        <ScrollReveal direction="curtain">
          <div className="rounded-3xl border border-[#b5892a]/35 bg-[#fdfaf3] p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="w-10 h-10 rounded-xl bg-[#11100e] text-[#e5c158] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono-tech uppercase tracking-[0.2em] text-[#9b7218] block">
                  Settlement &amp; Billing Policy
                </span>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#11100e] mt-0.5">
                  {cms.paymentNoticeTitle}
                </h2>
                <p className="text-xs sm:text-sm text-[#5b564c] mt-1.5 leading-relaxed">
                  {cms.paymentNoticeBody}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('exclusive')}
              className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-center"
            >
              <span>Explore Exclusive Panel</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleServices.map((svc, idx) => {
            const Icon = SERVICE_ICONS[svc.category] || Gem;
            const targetDest = TARGET_FOR_SERVICE[svc.category] || 'contact';

            return (
              <ScrollReveal
                key={svc.id}
                direction={idx % 2 === 0 ? 'left' : 'right'}
                delay={(idx % 2) * 0.06}
              >
                <article className="white-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-xs font-mono-tech">
                        <span className="text-[#9b7218] font-bold">{svc.indexLabel}</span>
                        <span aria-hidden="true" className="text-[#c5bfb1]">·</span>
                        <span className="text-[#5b564c] uppercase tracking-wider">
                          {svc.ventureTag}
                        </span>
                      </div>
                      <Icon className="w-5 h-5 text-[#9b7218] shrink-0" />
                    </div>

                    <div>
                      <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#5b564c]">
                        {svc.category}
                      </span>
                      <h2 className="font-display text-2xl sm:text-2xl font-extrabold text-[#11100e] mt-1 leading-snug">
                        {svc.title}
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4a453c] leading-relaxed">
                      {svc.summary}
                    </p>

                    <div className="pt-3 border-t border-[#e5e2da] space-y-2">
                      <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#5b564c] block">
                        Included Deliverables
                      </span>
                      <ul className="space-y-2">
                        {svc.deliverables.map((del) => (
                          <li
                            key={del}
                            className="text-xs sm:text-sm text-[#2c2924] flex items-start gap-2.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#9b7218] shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e5e2da] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech">
                      <span className="text-[#9b7218] font-semibold">{svc.rateLabel}</span>
                      <span className="text-[#5b564c] inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#9b7218]" />
                        {svc.turnaround}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleInquireService(svc)}
                        className="flex-1 min-h-[42px] px-4 py-2.5 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Request Service Brief</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(targetDest)}
                        className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#d6d1c6] hover:border-[#11100e] text-xs font-display font-bold uppercase tracking-wider text-[#11100e] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Open Destination
                      </button>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};
