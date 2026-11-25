import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUpRight,
  X,
  CarFront,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { VEHICLES, type VehicleSpec } from '../data/vehicles';
import { DEFAULT_SITE_CMS } from '../data/defaultCms';
import type { SiteCmsConfig } from '../types/cms';
import type { AppPage } from '../types/navigation';
import {
  AmbientLightWash,
  AnimatedSplitText,
  ScrollParallaxFrame,
  ScrollReveal,
} from './MotionEffects';

interface HeroThreeStageProps {
  onNotify: (msg: string) => void;
  onNavigate: (page: AppPage) => void;
  heroCms?: SiteCmsConfig['hero'];
  vehicles?: VehicleSpec[];
}

export const HeroThreeStage: React.FC<HeroThreeStageProps> = ({
  onNotify,
  onNavigate,
  heroCms = DEFAULT_SITE_CMS.hero,
  vehicles = VEHICLES,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resolvedVideoUrl = heroCms.videoUrl?.trim() || DEFAULT_SITE_CMS.hero.videoUrl;
  const resolvedPosterUrl = heroCms.posterUrl?.trim() || DEFAULT_SITE_CMS.hero.posterUrl;
  const safeVehicles = vehicles.length > 0 ? vehicles : VEHICLES;

  const [activeIndex, setActiveIndex] = useState(0);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [modalImgIdx, setModalImgIdx] = useState(0);
  const [failedImgs, setFailedImgs] = useState<Record<string, boolean>>({});
  const [videoPlaying, setVideoPlaying] = useState(false);

  const activeCar: VehicleSpec = safeVehicles[activeIndex % safeVehicles.length] || safeVehicles[0];
  const [displayHp, setDisplayHp] = useState(activeCar.horsepower);
  const [displayTorque, setDisplayTorque] = useState(activeCar.torque);
  const telemetryRef = useRef({ hp: activeCar.horsepower, torque: activeCar.torque });

  // Callback ref guarantees HTML muted/playsinline/autoplay attributes are present immediately
  const attachHeroVideo = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node) return;
    node.defaultMuted = true;
    node.muted = true;
    node.volume = 0;
    node.loop = true;
    node.playsInline = true;
    node.autoplay = true;
    node.controls = false;
    node.setAttribute('muted', '');
    node.setAttribute('playsinline', '');
    node.setAttribute('webkit-playsinline', '');
    node.setAttribute('autoplay', '');
    node.setAttribute('loop', '');
  }, []);

  // Resilient continuous silent autoplay & watchdog loop for background hero video
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    setVideoPlaying(false);
    let disposed = false;
    let heroInView = true;

    const forceMutedProps = () => {
      vid.defaultMuted = true;
      vid.muted = true;
      vid.volume = 0;
      vid.loop = true;
      vid.playsInline = true;
      vid.autoplay = true;
      vid.controls = false;
      vid.setAttribute('muted', '');
      vid.setAttribute('playsinline', '');
      vid.setAttribute('webkit-playsinline', '');
      vid.setAttribute('autoplay', '');
      vid.setAttribute('loop', '');
    };

    forceMutedProps();

    const shouldBePlaying = () => {
      if (disposed || document.hidden) return false;
      const offscreenThreshold = Math.max(window.innerHeight * 1.15, 880);
      return heroInView || window.scrollY < offscreenThreshold;
    };

    if (!vid.paused && vid.readyState >= 2 && vid.currentTime > 0) {
      setVideoPlaying(true);
    }

    const attemptPlay = () => {
      if (!shouldBePlaying()) return;
      forceMutedProps();
      if (vid.paused || (vid.readyState >= 2 && vid.currentTime === 0)) {
        const promise = vid.play();
        if (promise && typeof promise.then === 'function') {
          promise
            .then(() => {
              if (!disposed && !vid.paused) {
                setVideoPlaying(true);
              }
            })
            .catch(() => {});
        }
      }
    };

    const onPlaying = () => {
      setVideoPlaying(true);
    };

    const onTimeUpdate = () => {
      if (vid.currentTime > 0.04 && !vid.paused) {
        setVideoPlaying(true);
      }
    };

    const onPause = () => {
      // Auto-recover immediately if paused unexpectedly while still visible
      if (shouldBePlaying()) {
        window.setTimeout(attemptPlay, 60);
      }
    };

    const onEnded = () => {
      vid.currentTime = 0;
      attemptPlay();
    };

    const onMediaError = () => {
      if (!shouldBePlaying()) return;
      window.setTimeout(() => {
        if (disposed) return;
        vid.load();
        attemptPlay();
      }, 300);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (!vid.paused) vid.pause();
      } else {
        attemptPlay();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        heroInView = entry.isIntersecting;
        if (heroInView) {
          attemptPlay();
        } else if (!vid.paused && window.scrollY > Math.max(window.innerHeight * 1.15, 880)) {
          vid.pause();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(vid);
    vid.addEventListener('loadedmetadata', attemptPlay);
    vid.addEventListener('loadeddata', attemptPlay);
    vid.addEventListener('canplay', attemptPlay);
    vid.addEventListener('canplaythrough', attemptPlay);
    vid.addEventListener('waiting', attemptPlay);
    vid.addEventListener('stalled', attemptPlay);
    vid.addEventListener('suspend', attemptPlay);
    vid.addEventListener('pause', onPause);
    vid.addEventListener('playing', onPlaying);
    vid.addEventListener('timeupdate', onTimeUpdate);
    vid.addEventListener('ended', onEnded);
    vid.addEventListener('error', onMediaError);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointerdown', attemptPlay, { passive: true });
    window.addEventListener('touchstart', attemptPlay, { passive: true });
    window.addEventListener('scroll', attemptPlay, { passive: true });

    // Kick off immediately; reload once if media element sits idle on mount
    if (vid.readyState === 0 && vid.networkState !== 2) {
      vid.load();
    }
    attemptPlay();

    // Watchdog interval recovers from slow proxy buffering or iframe autoplay deferral
    const watchdogId = window.setInterval(() => {
      if (!shouldBePlaying()) return;
      if (vid.error) {
        vid.load();
        attemptPlay();
        return;
      }
      if (vid.paused || (vid.readyState >= 2 && vid.currentTime === 0)) {
        attemptPlay();
      } else if (!vid.paused && vid.currentTime > 0.1) {
        setVideoPlaying(true);
      }
    }, 450);

    return () => {
      disposed = true;
      window.clearInterval(watchdogId);
      observer.disconnect();
      vid.removeEventListener('loadedmetadata', attemptPlay);
      vid.removeEventListener('loadeddata', attemptPlay);
      vid.removeEventListener('canplay', attemptPlay);
      vid.removeEventListener('canplaythrough', attemptPlay);
      vid.removeEventListener('waiting', attemptPlay);
      vid.removeEventListener('stalled', attemptPlay);
      vid.removeEventListener('suspend', attemptPlay);
      vid.removeEventListener('pause', onPause);
      vid.removeEventListener('playing', onPlaying);
      vid.removeEventListener('timeupdate', onTimeUpdate);
      vid.removeEventListener('ended', onEnded);
      vid.removeEventListener('error', onMediaError);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointerdown', attemptPlay);
      window.removeEventListener('touchstart', attemptPlay);
      window.removeEventListener('scroll', attemptPlay);
    };
  }, [resolvedVideoUrl]);

  // Preload adjacent curated vehicle images cleanly after selection
  useEffect(() => {
    const nextIdx = (activeIndex + 1) % safeVehicles.length;
    const prevIdx = (activeIndex - 1 + safeVehicles.length) % safeVehicles.length;
    [safeVehicles[nextIdx]?.studioImage, safeVehicles[prevIdx]?.studioImage]
      .filter(Boolean)
      .forEach((src) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
      });
  }, [activeIndex, safeVehicles]);

  // Smooth count-up telemetry numbers when changing curated vehicle
  useEffect(() => {
    const startHp = telemetryRef.current.hp;
    const endHp = activeCar.horsepower;
    const startTq = telemetryRef.current.torque;
    const endTq = activeCar.torque;
    const animMs = 380;
    const startTime = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / animMs);
      const ease = 1 - Math.pow(1 - t, 3);
      const nextHp = Math.round(startHp + (endHp - startHp) * ease);
      const nextTq = Math.round(startTq + (endTq - startTq) * ease);
      telemetryRef.current = { hp: nextHp, torque: nextTq };
      setDisplayHp(nextHp);
      setDisplayTorque(nextTq);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [activeCar.id, activeCar.horsepower, activeCar.torque]);

  const switchToCar = useCallback(
    (nextIdx: number) => {
      const normalized = (nextIdx + safeVehicles.length) % safeVehicles.length;
      setActiveIndex(normalized);
      setModalImgIdx(0);
      const car = safeVehicles[normalized];
      onNotify(`${car.manufacturer} ${car.model}`);
    },
    [onNotify, safeVehicles]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        switchToCar(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        switchToCar(activeIndex - 1);
      } else if (e.key === 'Escape') {
        setDossierOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, switchToCar]);

  return (
    <section id="hero-stage" className="relative bg-[#080706]">
      {/* FULL-BLEED RESPONSIVE SILENT AUTO-LOOPING HERO VIDEO UNDER BLURRY TRANSPARENT NAV */}
      <div className="relative w-full h-[76vh] sm:h-[85vh] lg:h-[92vh] min-h-[540px] max-h-[960px] bg-[#080706] overflow-hidden border-b border-[#e5c158]/20">
        {/* Instant-paint poster underneath; smoothly clears once video frames advance */}
        <img
          src={resolvedPosterUrl}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className={`pointer-events-none absolute inset-0 z-[0] w-full h-full object-cover object-center transition-opacity duration-300 ${
            videoPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />

        <video
          key={resolvedVideoUrl}
          ref={attachHeroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="pointer-events-none relative z-[1] w-full h-full object-cover object-center select-none"
        >
          <source src={resolvedVideoUrl} type="video/mp4" />
        </video>

        {/* Edge-only Obsidian Scrims + Volumetric Ambient Light */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 sm:h-52 bg-gradient-to-b from-[#080706]/82 via-[#080706]/28 to-transparent z-[8]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-48 bg-gradient-to-t from-[#080706]/92 via-[#080706]/42 to-transparent z-[8]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-3/4 sm:w-1/2 bg-gradient-to-r from-[#080706]/68 via-[#080706]/22 to-transparent z-[8]" />
        <AmbientLightWash />

        {/* Non-overlapping Vertical Flex Overlay for Responsive Viewports */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between pt-20 sm:pt-28 pb-6 sm:pb-10 px-4 sm:px-10 max-w-7xl mx-auto">
          {/* Top-Left Animated Editorial Brand & Signature */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
            >
              <span className="text-[11px] sm:text-xs font-mono-tech uppercase tracking-[0.22em] text-[#e5c158]">
                {heroCms.eyebrow}
              </span>
              <span className="signature-gold-glow text-2xl sm:text-3xl select-none text-light-glint">
                {heroCms.signature}
              </span>
            </motion.div>

            <AnimatedSplitText
              text={heroCms.headline}
              as="h1"
              mode="mount"
              staggerMs={55}
              baseDelay={0.08}
              className="font-display font-extrabold tracking-tight text-[#f4f1ea] mt-2 leading-[0.98] text-balance text-[clamp(2rem,4.6vw,4.35rem)]"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-sm text-[#ddd4c1] mt-3 max-w-md leading-relaxed"
            >
              {heroCms.subtitle}
            </motion.p>
          </div>

          {/* Bottom Editorial Actions */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div className="hidden md:block">
              <div className="text-[11px] font-mono-tech uppercase tracking-[0.22em] text-[#e5c158]">
                {heroCms.ventureBadge}
              </div>
              <p className="text-xs text-[#c2b8a3] mt-1">{heroCms.ventureSubline}</p>
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-2.5 sm:gap-3 ml-auto">
              <a
                href="#curated-garage"
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#100e0c]/90 backdrop-blur-md border border-[#e5c158]/35 hover:border-[#e5c158] text-xs font-display font-bold uppercase tracking-wider text-[#f4f1ea] hover:text-[#e5c158] inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
              >
                <span>{heroCms.primaryCtaLabel}</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#e5c158]" />
              </a>
              <button
                type="button"
                onClick={() => onNavigate('showroom')}
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-[#e5c158] hover:bg-[#f4f1ea] text-[#080706] text-xs font-display font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{heroCms.secondaryCtaLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CURATED REAL VEHICLE SHOWCASE & HOVERABLE TELEMETRY */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 space-y-8">
        <div
          id="curated-garage"
          className="scroll-mt-20 flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-white/[0.08] pb-5"
        >
          <ScrollReveal direction="left">
            <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#e5c158]">
              Curated Collection · {activeCar.indexLabel} / {String(safeVehicles.length).padStart(2, '0')}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#f4f1ea] mt-1">
              {activeCar.manufacturer} {activeCar.model}
            </h2>
          </ScrollReveal>

          {/* Horizontal scrollable touch-friendly selector on mobile/tablet */}
          <ScrollReveal
            direction="right"
            className="flex items-center gap-1 bg-[#12100d] p-1 rounded-xl border border-white/[0.07] max-w-full overflow-x-auto"
          >
            <button
              type="button"
              aria-label="Previous vehicle"
              onClick={() => switchToCar(activeIndex - 1)}
              className="p-2 min-w-[36px] min-h-[36px] rounded-lg text-[#a59b84] hover:text-white transition-colors shrink-0 cursor-pointer flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {safeVehicles.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => switchToCar(idx)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  idx === activeIndex % safeVehicles.length
                    ? 'bg-[#e5c158] text-[#080706]'
                    : 'text-[#a59b84] hover:text-white'
                }`}
              >
                {v.shortLabel}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next vehicle"
              onClick={() => switchToCar(activeIndex + 1)}
              className="p-2 min-w-[36px] min-h-[36px] rounded-lg text-[#a59b84] hover:text-white transition-colors shrink-0 cursor-pointer flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </ScrollReveal>
        </div>

        {/* Window-Changed Animated Vehicle Showcase Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCar.id}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <ScrollParallaxFrame offsetPx={10} className="h-full">
                <button
                  type="button"
                  onClick={() => {
                    setModalImgIdx(0);
                    setDossierOpen(true);
                  }}
                  className="w-full h-full group relative aspect-[16/10] lg:aspect-auto min-h-[260px] sm:min-h-[340px] rounded-2xl overflow-hidden obsidian-panel p-0 text-left cursor-pointer block"
                >
                  {failedImgs[activeCar.studioImage] ? (
                    <div className="w-full h-full bg-gradient-to-br from-[#181410] to-[#0a0806] flex flex-col items-center justify-center p-6 text-center gap-2">
                      <CarFront className="w-8 h-8 text-[#e5c158]" />
                      <span className="font-display text-sm font-bold text-white">
                        {activeCar.manufacturer} {activeCar.model}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={activeCar.studioImage}
                      alt={`${activeCar.manufacturer} ${activeCar.model} studio photograph`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImgs((prev) => ({ ...prev, [activeCar.studioImage]: true }))
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/25 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] font-mono-tech uppercase tracking-[0.18em] text-[#e5c158] block">
                        {activeCar.year}
                      </span>
                      <div className="font-display text-base sm:text-lg font-bold text-white mt-0.5 truncate">
                        {activeCar.trimTag}
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-[#080706]/90 border border-[#e5c158]/35 text-[11px] font-display font-bold uppercase tracking-wider text-[#e5c158] flex items-center gap-1 shrink-0 group-hover:bg-[#e5c158] group-hover:text-[#080706] transition-colors">
                      <span>Specs</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              </ScrollParallaxFrame>
            </motion.div>

            <div className="lg:col-span-7 flex flex-col justify-between gap-5">
              {/* Smooth Hoverable Chassis Overview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="group p-5 sm:p-6 rounded-2xl obsidian-panel transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#e5c158]">
                      Chassis Dossier
                    </span>
                    <span className="text-xs font-mono-tech text-[#a59b84] group-hover:text-[#e5c158] transition-colors">
                      {activeCar.drivetrain}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg font-display font-bold text-[#f4f1ea] mt-2 leading-snug group-hover:text-[#fff6e0] transition-colors">
                    {activeCar.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#a59b84] mt-2.5 leading-relaxed group-hover:text-[#d4cbb8] transition-colors">
                    {activeCar.description}
                  </p>
                </div>
              </motion.div>

              {/* 6-Card Hoverable Vehicle Telemetry Strip with staggered rise */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Powertrain', value: activeCar.engine, sub: activeCar.displacement },
                  {
                    label: 'Peak Output',
                    value: `${displayHp} HP`,
                    sub: activeCar.horsepowerNote,
                    highlight: true,
                  },
                  {
                    label: 'Peak Torque',
                    value: `${displayTorque} Nm`,
                    sub: activeCar.torqueUnit,
                  },
                  { label: '0–100 km/h', value: activeCar.zeroToHundred, sub: activeCar.drivetrain },
                  { label: 'Top Velocity', value: activeCar.topSpeed, sub: activeCar.transmission },
                  {
                    label: 'Aerodynamics',
                    value: activeCar.downforceNote,
                    sub: activeCar.fuelType,
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.36,
                      delay: idx * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setModalImgIdx(0);
                        setDossierOpen(true);
                      }}
                      className="w-full h-full group text-left p-3.5 sm:p-4 rounded-2xl obsidian-panel hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c158]"
                    >
                      <span className="text-[10px] uppercase tracking-[0.16em] text-[#a59b84] group-hover:text-[#e5c158] transition-colors block">
                        {stat.label}
                      </span>
                      <span
                        className={`font-display text-sm sm:text-base font-bold mt-1 block transition-colors tabular-nums ${
                          stat.highlight
                            ? 'text-[#e5c158]'
                            : 'text-[#f4f1ea] group-hover:text-[#fff6e0]'
                        }`}
                      >
                        {stat.value}
                      </span>
                      <span className="text-[11px] text-[#a59b84] mt-0.5 block truncate group-hover:text-[#d4cbb8] transition-colors">
                        {stat.sub}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* VEHICLE DOSSIER MODAL WITH ANIMATED WINDOW OPENING */}
      <AnimatePresence>
        {dossierOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={() => setDossierOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl w-full rounded-3xl bg-[#100e0c] border border-[#e5c158]/25 overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-[#080706]">
                <img
                  src={activeCar.galleryImages[modalImgIdx] || activeCar.studioImage}
                  alt={`${activeCar.manufacturer} ${activeCar.model}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100e0c] via-transparent to-black/45" />
                <button
                  type="button"
                  aria-label="Close vehicle dossier"
                  onClick={() => setDossierOpen(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-[#080706]/85 border border-white/20 text-white hover:border-[#e5c158] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6">
                  <div className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#e5c158]">
                    {activeCar.manufacturer} · {activeCar.year}
                  </div>
                  <h3 className="font-display text-xl sm:text-4xl font-extrabold text-white mt-1">
                    {activeCar.model}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {activeCar.galleryImages.map((imgSrc, i) => (
                    <button
                      key={imgSrc + i}
                      type="button"
                      onClick={() => setModalImgIdx(i)}
                      className={`w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        modalImgIdx === i
                          ? 'border-[#e5c158]'
                          : 'border-white/10 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${activeCar.model} view ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <p className="text-sm sm:text-base text-[#d4cbb8] leading-relaxed">
                  {activeCar.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-white/10">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#a59b84]">Engine</span>
                    <p className="text-sm font-semibold text-white mt-0.5">{activeCar.engine}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#a59b84]">Power</span>
                    <p className="text-sm font-semibold text-[#e5c158] mt-0.5">
                      {activeCar.horsepower} HP
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#a59b84]">0–100 km/h</span>
                    <p className="text-sm font-semibold text-white mt-0.5">{activeCar.zeroToHundred}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#a59b84]">Top Speed</span>
                    <p className="text-sm font-semibold text-white mt-0.5">{activeCar.topSpeed}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#a59b84] font-semibold mb-3">
                    Key Engineering Highlights
                  </h4>
                  <ul className="space-y-2">
                    {activeCar.specialFeatures.map((feat) => (
                      <li key={feat} className="text-sm text-[#e2dbcc] flex items-start gap-2.5">
                        <span className="text-[#e5c158] font-mono-tech">—</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDossierOpen(false);
                      onNavigate('showroom');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#e5c158] hover:bg-[#f4f1ea] text-[#080706] font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Browse Showroom Inventory</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
