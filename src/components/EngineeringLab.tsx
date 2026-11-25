import React, { useEffect, useRef, useState } from 'react';
import { Wind, Gauge, Volume2, ArrowUpRight, Cpu } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  RESEARCH_DISCOVERIES,
  type AudioTrackKey,
  type ResearchDiscovery,
} from '../data/vehicles';
import { DEFAULT_SITE_CMS } from '../data/defaultCms';
import { playRealCarExhaustAudio } from '../audio/engineSynth';
import {
  AmbientLightWash,
  AnimatedSplitText,
  ScrollReveal,
  SpeedTunnelCanvas,
} from './MotionEffects';

type AeroModeId = 'low-drag' | 'track-downforce' | 'drs-open' | 'airbrake';

const AERO_MODES: Record<
  AeroModeId,
  {
    label: string;
    cd: string;
    downforce: string;
    venturiKpa: string;
    wingAngleDeg: number;
    speedKmh: number;
    summary: string;
  }
> = {
  'low-drag': {
    label: 'Low Drag',
    cd: '0.26 Cd',
    downforce: '310 kg',
    venturiKpa: '-5.2 kPa',
    wingAngleDeg: 4,
    speedKmh: 350,
    summary:
      'Minimized frontal wake and flattened rear wing pitch allow maximum straight-line velocity with clean laminar detachment.',
  },
  'track-downforce': {
    label: 'Track Downforce',
    cd: '0.34 Cd',
    downforce: '880 kg',
    venturiKpa: '-9.1 kPa',
    wingAngleDeg: 22,
    speedKmh: 280,
    summary:
      'Underbody Venturi tunnels accelerate air beneath the floor pan while dual-stage wing elements pin both axles into high-speed corners.',
  },
  'drs-open': {
    label: 'Active DRS Open',
    cd: '0.25 Cd',
    downforce: '240 kg',
    venturiKpa: '-4.8 kPa',
    wingAngleDeg: -2,
    speedKmh: 365,
    summary:
      'Hydraulic actuators stall the upper rear wing plane on straightaways, shedding parasitic drag for rapid top-end acceleration.',
  },
  airbrake: {
    label: 'Airbrake Deploy',
    cd: '0.58 Cd',
    downforce: '940 kg',
    venturiKpa: '-7.4 kPa',
    wingAngleDeg: 52,
    speedKmh: 195,
    summary:
      'Under heavy threshold braking, the rear wing pitches steeply into the airstream to stabilize rear axle weight transfer.',
  },
};

type EngineCompareId = 'v10' | 'tt-v8' | 'fp-v8' | 'hybrid-v8';

const ENGINE_SYSTEMS: Record<
  EngineCompareId,
  {
    label: string;
    config: string;
    redline: string;
    induction: string;
    character: string;
    torqueCurve: string;
    audioTrack: AudioTrackKey;
    spoolRpm: string;
    responseMs: string;
  }
> = {
  v10: {
    label: 'NA 5.2L V10',
    config: '10-Cylinder · 90° V-Angle',
    redline: '8,500 RPM',
    induction: 'Naturally Aspirated',
    character:
      'Linear atmospheric throttle precision with zero turbo lag and an unmistakable high-frequency harmonic climb to redline.',
    torqueCurve: 'M 10 115 Q 70 72 135 52 T 290 22',
    audioTrack: 'lamborghini',
    spoolRpm: 'Atmospheric',
    responseMs: '< 45 ms',
  },
  'tt-v8': {
    label: '4.4L Twin-Turbo V8',
    config: '8-Cylinder · Hot-Vee Turbos',
    redline: '7,200 RPM',
    induction: 'Twin-Scroll Turbocharged',
    character:
      'Exhaust-driven twin turbines mounted inside the cylinder valley shorten gas paths for broad mid-range executive thrust.',
    torqueCurve: 'M 10 120 Q 55 38 115 36 T 290 42',
    audioTrack: 'bmw_xm',
    spoolRpm: '165,000 RPM',
    responseMs: '~180 ms',
  },
  'fp-v8': {
    label: '4.0L Flat-Plane V8',
    config: '8-Cylinder · 180° Crankshaft',
    redline: '7,200 RPM',
    induction: 'Twin-Turbo Flat-Plane',
    character:
      'Alternating left-right bank firing pulses balance exhaust scavenging across twin ball-bearing turbochargers for razor response.',
    torqueCurve: 'M 10 118 Q 65 44 130 34 T 290 28',
    audioTrack: 'amg_s63',
    spoolRpm: '172,000 RPM',
    responseMs: '~130 ms',
  },
  'hybrid-v8': {
    label: '3.8L TT V8 + IPAS',
    config: 'Twin-Turbo V8 + Axial E-Motor',
    redline: '7,500 RPM',
    induction: 'Hybrid Assisted Boost',
    character:
      'Electric motor fills every millisecond of low-RPM turbo spool and gearshift torque drop before 2.4 bar of boost takes over.',
    torqueCurve: 'M 10 68 Q 58 28 135 24 T 290 18',
    audioTrack: 'bmw_i8',
    spoolRpm: 'Instant + 180k RPM',
    responseMs: '< 15 ms',
  },
};

interface EngineeringLabProps {
  onNotify: (msg: string) => void;
  labCopy?: {
    eyebrow: string;
    signature: string;
    title: string;
    subtitle: string;
  };
  researchItems?: ResearchDiscovery[];
}

export const EngineeringLab: React.FC<EngineeringLabProps> = ({
  onNotify,
  labCopy = {
    eyebrow: DEFAULT_SITE_CMS.homeSections.labEyebrow,
    signature: DEFAULT_SITE_CMS.homeSections.labSignature,
    title: DEFAULT_SITE_CMS.homeSections.labTitle,
    subtitle: DEFAULT_SITE_CMS.homeSections.labSubtitle,
  },
  researchItems = RESEARCH_DISCOVERIES,
}) => {
  const safeResearch = researchItems.length > 0 ? researchItems : RESEARCH_DISCOVERIES;
  const [aeroMode, setAeroMode] = useState<AeroModeId>('track-downforce');
  const [engineMode, setEngineMode] = useState<EngineCompareId>('hybrid-v8');
  const [activeDiscovery, setActiveDiscovery] = useState<string>(safeResearch[0].id);
  const windCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const wingAngleRef = useRef<number>(AERO_MODES['track-downforce'].wingAngleDeg);

  const currentAero = AERO_MODES[aeroMode];
  const currentEngine = ENGINE_SYSTEMS[engineMode];

  // Enhanced Wind + Architectural Tunnel Ribs Streamline Simulation (pauses when off-screen)
  useEffect(() => {
    const canvas = windCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let isVisible = true;
    let tunnelOffset = 0;

    const particles = Array.from({ length: 42 }, (_, idx) => ({
      x: (idx / 42) * 720,
      lane: (idx % 14) / 13,
      speed: 3.1 + (idx % 5) * 0.55,
    }));

    const renderTunnel = (advanceMotion: boolean) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const speedFactor = currentAero.speedKmh / 230;
      if (advanceMotion) {
        tunnelOffset = (tunnelOffset + 4.4 * speedFactor) % 120;
        wingAngleRef.current += (currentAero.wingAngleDeg - wingAngleRef.current) * 0.12;
      } else {
        wingAngleRef.current = currentAero.wingAngleDeg;
      }
      const wingTiltRad = (wingAngleRef.current * Math.PI) / 180;

      // Moving vertical wind-tunnel structural light ribs
      for (let rx = -tunnelOffset; rx < w + 120; rx += 120) {
        const ribGrad = ctx.createLinearGradient(rx, 0, rx + 22, 0);
        ribGrad.addColorStop(0, 'rgba(229, 193, 88, 0.0)');
        ribGrad.addColorStop(0.5, 'rgba(229, 193, 88, 0.12)');
        ribGrad.addColorStop(1, 'rgba(229, 193, 88, 0.0)');
        ctx.fillStyle = ribGrad;
        ctx.fillRect(rx, 0, 22, h * 0.8);
      }

      // Subtle tunnel elevation grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
      ctx.lineWidth = 1;
      for (let y = 32; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Underbody Venturi suction pulse beneath chassis
      const suctionPulse = ctx.createRadialGradient(w * 0.5, h * 0.77, 8, w * 0.5, h * 0.77, 170);
      const suctionAlpha = currentAero.wingAngleDeg > 15 ? 0.28 : 0.12;
      suctionPulse.addColorStop(0, `rgba(229, 193, 88, ${suctionAlpha})`);
      suctionPulse.addColorStop(1, 'rgba(229, 193, 88, 0)');
      ctx.fillStyle = suctionPulse;
      ctx.fillRect(w * 0.22, h * 0.72, w * 0.56, 46);

      // Airflow streamlines curving smoothly over body & through Venturi diffuser
      for (const p of particles) {
        if (advanceMotion) {
          p.x += p.speed * speedFactor * 1.45;
          if (p.x > w + 95) p.x = -95;
        }

        const baseY = 24 + p.lane * (h - 52);
        ctx.beginPath();
        const trailLen = 84;

        for (let s = 0; s <= 10; s++) {
          const sx = p.x - s * (trailLen / 10);
          const normX = sx / w;
          let deflection = 0;

          if (normX > 0.2 && normX < 0.8) {
            const carT = (normX - 0.2) / 0.6;
            const arch = Math.sin(carT * Math.PI);
            if (p.lane < 0.76) {
              deflection = -arch * (1 - Math.abs(p.lane - 0.44)) * 54;
            } else {
              deflection = arch * 13;
            }
          }
          if (normX >= 0.75) {
            const wakeIntensity = Math.max(0.15, Math.abs(wingAngleRef.current) / 52);
            deflection += Math.sin(sx * 0.08 + p.lane * 8) * wakeIntensity * 16;
          }

          const sy = baseY + deflection;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }

        const isVenturi = p.lane >= 0.76;
        ctx.strokeStyle = isVenturi
          ? 'rgba(229, 193, 88, 0.85)'
          : 'rgba(244, 241, 234, 0.36)';
        ctx.lineWidth = isVenturi ? 2.1 : 1.3;
        ctx.stroke();
      }

      // Stylized side hypercar silhouette inside tunnel
      ctx.save();
      ctx.fillStyle = '#181410';
      ctx.strokeStyle = 'rgba(229, 193, 88, 0.62)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(w * 0.22, h * 0.76);
      ctx.lineTo(w * 0.24, h * 0.64);
      ctx.quadraticCurveTo(w * 0.35, h * 0.56, w * 0.44, h * 0.46);
      ctx.quadraticCurveTo(w * 0.56, h * 0.44, w * 0.68, h * 0.56);
      ctx.lineTo(w * 0.75, h * 0.58);
      ctx.lineTo(w * 0.76, h * 0.76);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ground asphalt speed stripes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.moveTo(w * 0.06, h * 0.8);
      ctx.lineTo(w * 0.94, h * 0.8);
      ctx.stroke();

      // Active Rear Wing Blade rotating smoothly to interpolated pitch
      ctx.translate(w * 0.74, h * 0.51);
      ctx.rotate(wingTiltRad);
      ctx.fillStyle = '#e5c158';
      ctx.fillRect(-19, -3, 38, 5);
      ctx.restore();
    };

    const tick = () => {
      if (!isVisible || document.hidden) {
        raf = 0;
        return;
      }
      renderTunnel(true);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        renderTunnel(false);
        return;
      }
      if (!raf && isVisible && !document.hidden) {
        raf = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible) startLoop();
        else stopLoop();
      },
      { rootMargin: '120px 0px' }
    );

    observer.observe(canvas);
    document.addEventListener('visibilitychange', onVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [currentAero]);

  return (
    <section
      id="engineering-lab"
      className="scroll-mt-20 relative overflow-hidden py-20 sm:py-28 border-t border-white/[0.08] bg-[#080706]"
    >
      <AmbientLightWash />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Perspective Speed Tunnel Showcase Strip */}
        <ScrollReveal direction="zoom">
          <SpeedTunnelCanvas
            title="Aerodynamic Tunnel & Dynamics"
            subtitle="Scroll-Reactive Perspective Tunnel"
          />
        </ScrollReveal>

        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <ScrollReveal direction="left">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#e5c158]">
                {labCopy.eyebrow}
              </span>
              <span className="signature-gold-glow text-2xl select-none">
                {labCopy.signature}
              </span>
            </div>
            <AnimatedSplitText
              text={labCopy.title}
              as="h2"
              mode="view"
              className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 text-balance"
            />
          </ScrollReveal>
          <ScrollReveal direction="right">
            <p className="text-sm text-[#a3acb9] max-w-md leading-relaxed">
              {labCopy.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* Module 01: Interactive Wind Tunnel Simulation */}
        <ScrollReveal direction="curtain">
          <div className="obsidian-panel rounded-3xl p-5 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono-tech uppercase tracking-[0.18em] text-[#e5c158]">
                    01. Aerodynamic Tunnel
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
                    Venturi Tunnels &amp; Active Downforce
                  </h3>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={aeroMode}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-[#a3acb9] mt-3 leading-relaxed"
                    >
                      {currentAero.summary}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Interactive Aero Mode Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(AERO_MODES) as AeroModeId[]).map((modeId) => (
                    <button
                      key={modeId}
                      type="button"
                      onClick={() => {
                        setAeroMode(modeId);
                        onNotify(`Wind Tunnel: ${AERO_MODES[modeId].label}`);
                      }}
                      className={`px-3.5 py-2.5 min-h-[42px] rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                        aeroMode === modeId
                          ? 'bg-[#e5c158] text-[#080706] border-[#e5c158]'
                          : 'bg-[#100e0c] text-[#c7cdd8] border-white/10 hover:border-[#e5c158]/40'
                      }`}
                    >
                      {AERO_MODES[modeId].label}
                    </button>
                  ))}
                </div>

                {/* Real-Time Telemetry Readout Row */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#100e0c] border border-white/[0.07]">
                    <span className="text-[10px] sm:text-[11px] text-[#8d96a6] block">Drag Coeff.</span>
                    <span className="font-mono-tech text-sm sm:text-base font-bold text-white mt-0.5 block">
                      {currentAero.cd}
                    </span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#100e0c] border border-white/[0.07]">
                    <span className="text-[10px] sm:text-[11px] text-[#8d96a6] block">Downforce</span>
                    <span className="font-mono-tech text-sm sm:text-base font-bold text-[#e5c158] mt-0.5 block">
                      {currentAero.downforce}
                    </span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#100e0c] border border-white/[0.07]">
                    <span className="text-[10px] sm:text-[11px] text-[#8d96a6] block">Venturi Drop</span>
                    <span className="font-mono-tech text-sm sm:text-base font-bold text-white mt-0.5 block">
                      {currentAero.venturiKpa}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Canvas Airflow Tunnel */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden bg-[#07090e] border border-white/10 p-3.5 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#a3acb9] pb-3 border-b border-white/[0.07]">
                    <span className="flex items-center gap-2 font-medium text-white">
                      <Wind className="w-4 h-4 text-[#e5c158]" />
                      Airflow &amp; Light-Rib Tunnel
                    </span>
                    <span className="font-mono-tech text-[#e5c158]">
                      Wing Pitch: {currentAero.wingAngleDeg}° · {currentAero.speedKmh} km/h
                    </span>
                  </div>
                  <canvas
                    ref={windCanvasRef}
                    width={720}
                    height={320}
                    className="w-full h-auto block mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Module 02: Engine & Forced Induction Comparator */}
        <ScrollReveal direction="tilt-rise" delay={0.05}>
          <div className="obsidian-panel rounded-3xl p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-[0.18em] text-[#f5d78a]">
                  02. Powertrain Architecture
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  Naturally Aspirated vs. Twin-Turbo &amp; Hybrid Boost
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 bg-[#100e0c] p-1 rounded-xl border border-white/[0.07]">
                {(Object.keys(ENGINE_SYSTEMS) as EngineCompareId[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEngineMode(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      engineMode === key
                        ? 'bg-[#e8eaef] text-[#080706]'
                        : 'text-[#a3acb9] hover:text-white'
                    }`}
                  >
                    {ENGINE_SYSTEMS[key].label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={engineMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center"
              >
                {/* Mechanical Description & Live Audio Trigger */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="text-xs font-mono-tech text-[#e5c158] uppercase tracking-wider">
                    {currentEngine.config} · {currentEngine.induction}
                  </div>
                  <p className="text-sm sm:text-base text-[#c7cdd8] leading-relaxed">
                    {currentEngine.character}
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#100e0c] border border-white/[0.07]">
                      <span className="text-[11px] text-[#8d96a6] block">Redline</span>
                      <span className="font-mono-tech text-sm font-bold text-white mt-1 block">
                        {currentEngine.redline}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#100e0c] border border-white/[0.07]">
                      <span className="text-[11px] text-[#8d96a6] block">Turbine Spool</span>
                      <span className="font-mono-tech text-sm font-bold text-[#e5c158] mt-1 block">
                        {currentEngine.spoolRpm}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#100e0c] border border-white/[0.07]">
                      <span className="text-[11px] text-[#8d96a6] block">Tip-In Latency</span>
                      <span className="font-mono-tech text-sm font-bold text-[#f5d78a] mt-1 block">
                        {currentEngine.responseMs}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playRealCarExhaustAudio(currentEngine.audioTrack, false, 0.75);
                      onNotify(`Playing ${currentEngine.label} real exhaust note`);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#e5c158] text-[#080706] hover:bg-[#f4f1ea] font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Hear Powertrain Exhaust</span>
                  </button>
                </div>

                {/* Interactive SVG Torque Delivery Curve */}
                <div className="lg:col-span-6">
                  <div className="p-5 rounded-2xl bg-[#07090e] border border-white/10">
                    <div className="flex items-center justify-between text-xs text-[#a3acb9] mb-4">
                      <span className="flex items-center gap-2 text-white font-medium">
                        <Gauge className="w-4 h-4 text-[#e5c158]" />
                        Torque &amp; Boost Delivery Curve
                      </span>
                      <span className="font-mono-tech">1,500 → {currentEngine.redline}</span>
                    </div>
                    <svg viewBox="0 0 300 140" className="w-full h-40 overflow-visible">
                      <line x1="10" y1="125" x2="290" y2="125" stroke="rgba(255,255,255,0.12)" />
                      <line x1="10" y1="15" x2="10" y2="125" stroke="rgba(255,255,255,0.12)" />
                      <path
                        d={currentEngine.torqueCurve}
                        fill="none"
                        stroke="#e5c158"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <text x="12" y="138" fill="#8d96a6" fontSize="9" fontFamily="JetBrains Mono">
                        IDLE
                      </text>
                      <text x="242" y="138" fill="#8d96a6" fontSize="9" fontFamily="JetBrains Mono">
                        REDLINE
                      </text>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Module 03: Automotive Research & Technical Discoveries */}
        <ScrollReveal direction="up" delay={0.06}>
          <div className="flex items-center gap-2.5 mb-5">
            <Cpu className="w-4 h-4 text-[#e5c158]" />
            <h3 className="font-display text-xl font-bold text-white">
              03. Automotive Engineering Discoveries
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeResearch.map((item, idx) => {
              const isSelected = activeDiscovery === item.id;
              const cardDirs = ['left', 'zoom', 'tilt-rise', 'right'] as const;
              return (
                <ScrollReveal
                  key={item.id}
                  direction={cardDirs[idx % cardDirs.length]}
                  delay={idx * 0.05}
                  className="h-full"
                >
                  <button
                    type="button"
                    onClick={() => setActiveDiscovery(item.id)}
                    className={`w-full h-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#121722] border-[#e5c158]/60'
                        : 'obsidian-panel hover:-translate-y-1'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display text-base font-bold text-white">
                          {item.topic}
                        </h4>
                        <ArrowUpRight className="w-4 h-4 text-[#e5c158] shrink-0" />
                      </div>
                      <p className="text-xs text-[#a3acb9] mt-2.5 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                        <p className="text-[11px] text-[#d4dae4] leading-relaxed">
                          <strong className="text-[#e5c158]">Mechanism:</strong> {item.mechanism}
                        </p>
                        <p className="text-[11px] text-[#8d96a6]">
                          Reference: {item.realWorldExample}
                        </p>
                      </div>
                    )}
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
