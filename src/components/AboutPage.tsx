import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers,
  Film,
  CarFront,
  Wrench,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { AppPage } from '../types/navigation';
import type { SiteCmsConfig } from '../types/cms';
import { DEFAULT_SITE_CMS } from '../data/defaultCms';
import {
  AnimatedSplitText,
  ScrollParallaxFrame,
  ScrollPassOutBand,
  ScrollReveal,
} from './MotionEffects';

interface AboutPageProps {
  onNavigate: (page: AppPage) => void;
  onSelectContactTrack: (track: 'imperion' | 'clexora' | 'cinema' | 'showroom') => void;
  aboutCms?: SiteCmsConfig['about'];
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onSelectContactTrack,
  aboutCms = DEFAULT_SITE_CMS.about,
}) => {
  const portraits =
    aboutCms.portraits.length > 0 ? aboutCms.portraits : DEFAULT_SITE_CMS.about.portraits;
  const pillars =
    aboutCms.clexoraPillars.length > 0
      ? aboutCms.clexoraPillars
      : DEFAULT_SITE_CMS.about.clexoraPillars;
  const milestones =
    aboutCms.milestones.length > 0 ? aboutCms.milestones : DEFAULT_SITE_CMS.about.milestones;

  const [portraitIdx, setPortraitIdx] = useState(0);
  const [activePillar, setActivePillar] = useState(pillars[0].id);
  const [activeMilestoneId, setActiveMilestoneId] = useState(milestones[0].id);

  const activePortrait = portraits[portraitIdx % portraits.length] || portraits[0];
  const activeMilestone =
    milestones.find((m) => m.id === activeMilestoneId) || milestones[0];

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#ffffff] text-[#11100e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* SECTION 01: WHO I AM */}
        <section aria-labelledby="who-i-am-heading">
          <ScrollReveal direction="left" className="mb-8 border-b border-[#e5e2da] pb-6">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
                {aboutCms.eyebrow}
              </span>
              <span className="signature-ink-gold text-2xl sm:text-3xl select-none">
                {aboutCms.signature}
              </span>
            </div>
            <AnimatedSplitText
              id="who-i-am-heading"
              text={aboutCms.heading}
              as="h1"
              mode="mount"
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#11100e] tracking-tight mt-2 text-balance"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Real Portrait Gallery Column */}
            <ScrollReveal className="lg:col-span-5 space-y-3" direction="left">
              <ScrollParallaxFrame offsetPx={10}>
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#e5e2da] bg-[#f4f2ec] shadow-lg">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activePortrait.src}
                      src={activePortrait.src}
                      alt={activePortrait.alt}
                      decoding="async"
                      fetchPriority="high"
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full object-cover object-top"
                    />
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                {/* Left/Right Angle Controls */}
                <button
                  type="button"
                  aria-label="Previous personal photo"
                  onClick={() =>
                    setPortraitIdx((p) => (p - 1 + portraits.length) % portraits.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white hover:bg-[#e5c158] hover:text-[#11100e] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next personal photo"
                  onClick={() =>
                    setPortraitIdx((p) => (p + 1) % portraits.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white hover:bg-[#e5c158] hover:text-[#11100e] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="signature-glow text-light-glint text-3xl sm:text-4xl block">
                      {aboutCms.heading}
                    </span>
                    <p className="text-[11px] font-mono-tech uppercase tracking-[0.16em] text-[#e5c158] mt-1">
                      {activePortrait.caption}
                    </p>
                  </div>
                </div>
              </ScrollParallaxFrame>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-5 gap-2">
                {portraits.map((item, idx) => (
                  <button
                    key={`${item.src}-${idx}`}
                    type="button"
                    onClick={() => setPortraitIdx(idx)}
                    aria-label={`View photo: ${item.caption}`}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === portraitIdx % portraits.length
                        ? 'border-[#b5892a] shadow-md scale-[1.03]'
                        : 'border-[#e5e2da] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Bio & Identity Column */}
            <ScrollReveal className="lg:col-span-7 flex flex-col justify-between gap-6" direction="right">
              <div className="white-panel rounded-3xl p-6 sm:p-8 space-y-4">
                <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#9b7218]">
                  {aboutCms.manifestoTag}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#11100e] leading-tight">
                  {aboutCms.manifestoHeadline}
                </h2>
                <p className="text-sm sm:text-base text-[#36332c] leading-relaxed">
                  {aboutCms.bioParagraph1}
                </p>
                <p className="text-sm text-[#5b564c] leading-relaxed">
                  {aboutCms.bioParagraph2}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl white-panel">
                  <Compass className="w-4 h-4 text-[#9b7218] mb-2" />
                  <div className="font-display text-sm font-bold text-[#11100e]">
                    Automotive Direction
                  </div>
                  <p className="text-xs text-[#5b564c] mt-1 leading-relaxed">
                    Supercar curation, acoustic studies, and 4K visual storytelling.
                  </p>
                </div>
                <div className="p-4 rounded-2xl white-panel">
                  <Briefcase className="w-4 h-4 text-[#9b7218] mb-2" />
                  <div className="font-display text-sm font-bold text-[#11100e]">
                    Clexora Execution
                  </div>
                  <p className="text-xs text-[#5b564c] mt-1 leading-relaxed">
                    Remote office operations and dedicated execution desks.
                  </p>
                </div>
                <div className="p-4 rounded-2xl white-panel">
                  <CarFront className="w-4 h-4 text-[#9b7218] mb-2" />
                  <div className="font-display text-sm font-bold text-[#11100e]">
                    Imperion Autos
                  </div>
                  <p className="text-xs text-[#5b564c] mt-1 leading-relaxed">
                    Luxury vehicle brokerage, consignment, and bespoke hardware.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Bidirectional White-Page Scroll Passing-Out Rail */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <ScrollPassOutBand
            isWhitePage
            topItems={[
              'Who I Am',
              'Imperion Autos',
              'Clexora Execution',
              'Farhan Tanvir Shuvo',
            ]}
            bottomItems={[
              'Vehicle Brokerage',
              'Remote Operations',
              '4K Visual Direction',
              'Collector Vaults',
            ]}
          />
        </div>

        {/* SECTION 02: WHAT I DO */}
        <section
          aria-labelledby="what-i-do-heading"
          className="space-y-8 pt-4"
        >
          <ScrollReveal direction="left">
            <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
              02 · What I Do
            </span>
            <h2
              id="what-i-do-heading"
              className="font-display text-3xl sm:text-4xl font-extrabold text-[#11100e] mt-1"
            >
              Active Ventures &amp; Core Disciplines
            </h2>
          </ScrollReveal>

          {/* Imperion Autos Banner using Farhan's real twin-coupe villa photograph (responsive min-height prevents mobile clipping) */}
          <ScrollReveal direction="curtain">
            <div className="rounded-3xl overflow-hidden border border-[#e5e2da] shadow-lg bg-[#11100e]">
              <div className="relative min-h-[380px] sm:min-h-[340px] lg:min-h-[400px] flex flex-col justify-end w-full">
                <img
                  src={aboutCms.bannerImage}
                  alt={aboutCms.bannerHeadline}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />
                <div className="relative z-10 p-5 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
                  <div className="max-w-2xl">
                    <span className="text-[11px] font-mono-tech uppercase tracking-[0.22em] text-[#e5c158]">
                      {aboutCms.bannerEyebrow}
                    </span>
                    <h3 className="font-display text-xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
                      {aboutCms.bannerHeadline}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#e6dfd1] mt-2 leading-relaxed">
                      {aboutCms.bannerDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onNavigate('showroom')}
                      className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#e5c158] hover:bg-white text-[#11100e] font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Visit Showroom</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('garage')}
                      className="px-4 py-2.5 min-h-[42px] rounded-xl border border-white/30 bg-black/55 backdrop-blur-md hover:border-[#e5c158] text-white hover:text-[#e5c158] font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Open Garage</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Clexora Operations Block */}
          <ScrollReveal direction="tilt-rise">
            <div className="white-panel rounded-3xl p-6 sm:p-10 bg-[#faf9f6]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
                    Clexora · Venture Architecture
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#11100e]">
                    {aboutCms.clexoraHeadline}
                  </h3>
                  <p className="text-sm text-[#5b564c] leading-relaxed">
                    {aboutCms.clexoraDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectContactTrack('clexora')}
                    className="px-5 py-2.5 min-h-[42px] rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Inquire Clexora Operations</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pillars.map((pillar, idx) => {
                    const isActive = activePillar === pillar.id;
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => setActivePillar(pillar.id)}
                        className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white border-[#b5892a] shadow-md'
                            : 'bg-white/70 border-[#e5e2da] hover:border-[#b5892a]/60'
                        }`}
                      >
                        <span className="text-xs font-mono-tech text-[#9b7218]">0{idx + 1}.</span>
                        <h4 className="font-display text-base font-bold text-[#11100e] mt-1">
                          {pillar.title}
                        </h4>
                        <p className="text-xs text-[#5b564c] mt-2 leading-relaxed">
                          {pillar.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* SECTION 03: WHAT I DID */}
        <section
          aria-labelledby="what-i-did-heading"
          className="space-y-8 border-t border-[#e5e2da] pt-16"
        >
          <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
                03 · What I Did
              </span>
              <h2
                id="what-i-did-heading"
                className="font-display text-3xl sm:text-4xl font-extrabold text-[#11100e] mt-1"
              >
                Executed Builds &amp; Creative Milestones
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5b564c] max-w-md">
              Select any milestone to review delivered scope and open its live destination window.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-3">
              {milestones.map((item, idx) => {
                const selected = item.id === activeMilestone.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMilestoneId(item.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#11100e] text-white border-[#11100e] shadow-lg'
                        : 'bg-[#faf9f6] border-[#e5e2da] text-[#11100e] hover:border-[#b5892a]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tech">
                      <span className={selected ? 'text-[#e5c158]' : 'text-[#9b7218]'}>
                        0{idx + 1} · {item.era}
                      </span>
                      <span className={selected ? 'text-white/75' : 'text-[#5b564c]'}>
                        {item.role}
                      </span>
                    </div>
                    <div className="font-display text-lg font-bold mt-1">{item.title}</div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMilestone.id}
                  initial={{ opacity: 0, y: 14, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="white-panel rounded-3xl p-6 sm:p-8 space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e2da] pb-4">
                    <div>
                      <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#9b7218]">
                        {activeMilestone.era}
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#11100e] mt-1">
                        {activeMilestone.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono-tech text-[#5b564c] border border-[#e5e2da] px-3 py-1 rounded-md">
                      {activeMilestone.role}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-[#36332c] leading-relaxed">
                    {activeMilestone.summary}
                  </p>

                  <div className="space-y-2.5">
                    <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#5b564c] block">
                      Key Outcomes Delivered
                    </span>
                    <ul className="space-y-2">
                      {activeMilestone.outcomes.map((out) => (
                        <li
                          key={out}
                          className="text-xs sm:text-sm text-[#11100e] flex items-start gap-2.5"
                        >
                          <span className="text-[#9b7218] font-mono-tech">—</span>
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate(activeMilestone.targetPage)}
                      className="px-5 py-2.5 min-h-[42px] rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>{activeMilestone.ctaLabel}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectContactTrack('imperion')}
                      className="px-5 py-2.5 min-h-[42px] rounded-xl border border-[#d6d1c6] hover:border-[#11100e] text-xs font-semibold text-[#11100e] inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Collaborate With Farhan</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Quick Layers Strip */}
        <ScrollReveal direction="zoom">
          <section className="white-panel rounded-3xl p-6 sm:p-8 bg-[#faf9f6] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Layers className="w-6 h-6 text-[#9b7218] shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#11100e]">
                  Ready to acquire a vehicle, source forged hardware, or collaborate?
                </h3>
                <p className="text-xs sm:text-sm text-[#5b564c] mt-1">
                  Navigate directly to any FARHAN PALACE destination below.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('showroom')}
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Showroom
              </button>
              <button
                type="button"
                onClick={() => onNavigate('garage')}
                className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#d6d1c6] hover:border-[#11100e] text-[#11100e] font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Garage
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#b5892a] text-[#8f6714] hover:bg-[#11100e] hover:text-white font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Contact Me
              </button>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};
