import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

/* Top thin hairline progress bar tracking page scroll smoothly */
export const ScrollProgressBar: React.FC<{ isWhitePage?: boolean }> = ({
  isWhitePage = false,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className={`fixed top-0 left-0 right-0 h-[2.5px] z-[60] pointer-events-none ${
        isWhitePage
          ? 'bg-gradient-to-r from-[#9c721c] via-[#d4af37] to-[#11100e]'
          : 'bg-gradient-to-r from-[#b88b3a] via-[#e5c158] to-[#f4f1ea]'
      }`}
    />
  );
};

/* Versatile Multi-Mode Scroll Reveal Animation (compositor-only transform, opacity & clipPath) */
export type ScrollRevealDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'zoom'
  | 'curtain'
  | 'tilt-rise'
  | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: ScrollRevealDirection;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const getVariants = () => {
    switch (direction) {
      case 'left':
        return {
          initial: { opacity: 0, x: -32, y: 0 },
          animate: { opacity: 1, x: 0, y: 0 },
        };
      case 'right':
        return {
          initial: { opacity: 0, x: 32, y: 0 },
          animate: { opacity: 1, x: 0, y: 0 },
        };
      case 'down':
        return {
          initial: { opacity: 0, y: -22, x: 0 },
          animate: { opacity: 1, y: 0, x: 0 },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.93, y: 12 },
          animate: { opacity: 1, scale: 1, y: 0 },
        };
      case 'curtain':
        return {
          initial: { opacity: 0, y: 20, clipPath: 'inset(0% 0% 18% 0%)' },
          animate: { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' },
        };
      case 'tilt-rise':
        return {
          initial: { opacity: 0, y: 24, rotate: -0.9, scale: 0.97 },
          animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
        };
      case 'none':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case 'up':
      default:
        return {
          initial: { opacity: 0, y: 22, x: 0 },
          animate: { opacity: 1, y: 0, x: 0 },
        };
    }
  };

  const { initial, animate } = getVariants();

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.04 }}
      transition={{
        duration: 0.32,
        delay: Math.min(delay, 0.12),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* Word-by-word masked cinematic text animation for headings & taglines */
interface AnimatedSplitTextProps {
  id?: string;
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  mode?: 'mount' | 'view';
  staggerMs?: number;
  baseDelay?: number;
}

export const AnimatedSplitText: React.FC<AnimatedSplitTextProps> = ({
  id,
  text,
  className = '',
  as = 'h1',
  mode = 'view',
  staggerMs = 45,
  baseDelay = 0,
}) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const Tag = as;

  return (
    <Tag id={id} className={className}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0"
        >
          {mode === 'mount' ? (
            <motion.span
              className="inline-block"
              initial={{ y: '108%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: 0.58,
                delay: baseDelay + (idx * staggerMs) / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ) : (
            <motion.span
              className="inline-block"
              initial={{ y: '108%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.54,
                delay: baseDelay + (idx * staggerMs) / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          )}
        </span>
      ))}
    </Tag>
  );
};

/* Bidirectional Scroll Passing-Out & Side-Out Kinetic Rail */
interface ScrollPassOutBandProps {
  topItems: string[];
  bottomItems: string[];
  isWhitePage?: boolean;
}

export const ScrollPassOutBand: React.FC<ScrollPassOutBandProps> = ({
  topItems,
  bottomItems,
  isWhitePage = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const topX = useTransform(scrollYProgress, [0, 0.5, 1], [85, 0, -110]);
  const bottomX = useTransform(scrollYProgress, [0, 0.5, 1], [-85, 0, 110]);
  const railOpacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.25, 1, 1, 0.2]);
  const railScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.96]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`overflow-hidden border-y py-6 sm:py-8 select-none ${
        isWhitePage
          ? 'border-[#e5e2da] bg-[#faf9f6] text-[#11100e]'
          : 'border-white/[0.08] bg-[#060504] text-[#f4f1ea]'
      }`}
    >
      <motion.div
        style={{ opacity: railOpacity, scale: railScale }}
        className="space-y-3 will-change-transform"
      >
        <motion.div
          style={{ x: topX }}
          className="flex items-center justify-center gap-6 sm:gap-10 whitespace-nowrap will-change-transform"
        >
          {topItems.map((item, idx) => (
            <div key={`${item}-${idx}`} className="flex items-center gap-6 sm:gap-10">
              <span
                className={`font-display text-xl sm:text-3xl font-extrabold uppercase tracking-[0.14em] ${
                  idx % 2 === 0
                    ? isWhitePage
                      ? 'text-[#11100e]'
                      : 'text-[#f4f1ea]'
                    : isWhitePage
                      ? 'text-[#9b7218]'
                      : 'text-[#e5c158]'
                }`}
              >
                {item}
              </span>
              <span className="text-xs font-mono-tech text-[#b5892a]">·</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          style={{ x: bottomX }}
          className="flex items-center justify-center gap-5 sm:gap-8 whitespace-nowrap will-change-transform"
        >
          {bottomItems.map((item, idx) => (
            <div key={`${item}-${idx}`} className="flex items-center gap-5 sm:gap-8">
              <span
                className={`font-mono-tech text-xs sm:text-sm uppercase tracking-[0.24em] ${
                  isWhitePage ? 'text-[#5b564c]' : 'text-[#a59b84]'
                }`}
              >
                {item}
              </span>
              <span className="text-xs font-mono-tech text-[#e5c158]/60">/</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

/* Subtle Vertical Scroll Depth Parallax Container */
export const ScrollParallaxFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
  offsetPx?: number;
}> = ({ children, className = '', offsetPx = 16 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offsetPx, -offsetPx]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};

/* Atmospheric Night-Sky Shooting Stars & Dust Field (auto-pauses off-screen) */
export const ShootingStarsCanvas: React.FC<{
  className?: string;
  density?: 'subtle' | 'rich';
}> = ({ className = '', density = 'subtle' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let isVisible = true;
    let width = (canvas.width = canvas.offsetWidth || 1200);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const starCount = density === 'rich' ? 42 : 24;
    const backgroundStars = Array.from({ length: starCount }, (_, i) => ({
      x: ((i * 197.3) % 100) / 100,
      y: ((i * 83.7) % 100) / 100,
      r: 0.6 + (i % 3) * 0.45,
      twinklePhase: i * 0.9,
      warm: i % 4 === 0,
    }));

    interface Meteor {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      life: number;
      maxLife: number;
      width: number;
    }

    const meteors: Meteor[] = [];
    let frameTick = 0;

    const spawnMeteor = () => {
      const startFromTop = Math.random() > 0.35;
      const startX = startFromTop ? width * (0.12 + Math.random() * 0.78) : width * (0.65 + Math.random() * 0.35);
      const startY = startFromTop ? -20 : height * (0.05 + Math.random() * 0.35);
      const speed = 10 + Math.random() * 7;
      const angle = (132 + Math.random() * 20) * (Math.PI / 180);

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 90 + Math.random() * 110,
        life: 0,
        maxLife: 48 + Math.random() * 28,
        width: 1.4 + Math.random() * 1.1,
      });
    };

    spawnMeteor();

    const syncSize = () => {
      if (!canvas) return;
      const nextW = canvas.offsetWidth || 1200;
      const nextH = canvas.offsetHeight || 600;
      if (Math.abs(nextW - width) > 4 || Math.abs(nextH - height) > 4) {
        width = canvas.width = nextW;
        height = canvas.height = nextH;
      }
    };

    const drawFrame = (advance: boolean) => {
      syncSize();
      ctx.clearRect(0, 0, width, height);

      frameTick += 1;

      // Distant subtle micro-twinkling stars
      for (const s of backgroundStars) {
        const px = s.x * width;
        const py = s.y * height;
        const pulse = advance ? 0.3 + 0.55 * (0.5 + 0.5 * Math.sin(frameTick * 0.03 + s.twinklePhase)) : 0.4;
        ctx.fillStyle = s.warm
          ? `rgba(229, 193, 88, ${(pulse * 0.65).toFixed(3)})`
          : `rgba(244, 241, 234, ${(pulse * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!advance) return;

      const maxActive = density === 'rich' ? 3 : 2;
      const spawnInterval = density === 'rich' ? 68 : 95;
      if (frameTick % spawnInterval === 0 && meteors.length < maxActive) {
        spawnMeteor();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;

        const progress = m.life / m.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);

        const normLen = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / normLen) * m.length;
        const tailY = m.y - (m.vy / normLen) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 252, 240, ${(alpha * 0.95).toFixed(3)})`);
        grad.addColorStop(0.28, `rgba(229, 193, 88, ${(alpha * 0.72).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(229, 193, 88, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Incandescent core head pinpoint + gentle halo
        ctx.fillStyle = `rgba(255, 250, 230, ${(alpha * 0.9).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width * 1.15, 0, Math.PI * 2);
        ctx.fill();

        if (m.life >= m.maxLife || m.x < -120 || m.y > height + 120) {
          meteors.splice(i, 1);
        }
      }
    };

    const tick = () => {
      if (!isVisible || document.hidden) {
        raf = 0;
        return;
      }
      drawFrame(true);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        drawFrame(false);
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

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible) startLoop();
        else stopLoop();
      },
      { rootMargin: '80px 0px' }
    );

    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    observer.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none w-full h-full block ${className}`}
    />
  );
};

/* Architectural Ambient Light Beams (GPU Transform + Opacity only) */
export const AmbientLightWash: React.FC<{ isWhitePage?: boolean }> = ({
  isWhitePage = false,
}) => {
  if (isWhitePage) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-[2]"
    >
      <div
        className="ambient-light-orb absolute -top-28 -left-24 w-[460px] h-[340px] rounded-full blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, rgba(229,193,88,0.16) 0%, rgba(184,139,58,0.05) 55%, transparent 75%)',
        }}
      />
      <div
        className="ambient-light-orb absolute top-1/3 -right-24 w-[400px] h-[300px] rounded-full blur-[120px]"
        style={{
          animationDelay: '-4.2s',
          background:
            'radial-gradient(circle, rgba(244,241,234,0.08) 0%, rgba(229,193,88,0.06) 55%, transparent 75%)',
        }}
      />
    </div>
  );
};

/* Fast compositor-only Window Changing transition + Champagne-Gold Light Flash */
export const WindowTransition: React.FC<{
  windowKey: string;
  children: React.ReactNode;
  className?: string;
}> = ({ windowKey, children, className = '' }) => {
  return (
    <motion.div
      key={windowKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
    >
      {/* Crisp champagne-gold horizontal light-beam sweep on window change */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-100%', opacity: 0.85 }}
        animate={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed top-16 left-0 right-0 h-[2px] z-[58] bg-gradient-to-r from-transparent via-[#e5c158] to-transparent"
      />
      {children}
    </motion.div>
  );
};

/* Interactive Perspective Speed Tunnel Canvas Strip (automatically pauses when off-screen) */
export const SpeedTunnelCanvas: React.FC<{
  title?: string;
  subtitle?: string;
}> = ({
  title = 'Hyper-Speed Light Tunnel',
  subtitle = 'Continuous perspective velocity & depth simulation',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let isVisible = true;
    let phase = 0;
    let boost = 1;
    let lastScrollY = window.scrollY;

    const streaks = Array.from({ length: 34 }, (_, idx) => ({
      angle: (idx / 34) * Math.PI * 2,
      z: (idx % 10) / 10,
      speed: 0.012 + (idx % 5) * 0.004,
      warm: idx % 3 === 0,
    }));

    const drawFrame = (advanceMotion: boolean) => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.52;

      if (advanceMotion) {
        boost += (1 - boost) * 0.06;
        phase += 0.018 * boost;
      }

      const bgGrad = ctx.createRadialGradient(cx, cy, 12, cx, cy, w * 0.6);
      bgGrad.addColorStop(0, '#2a2011');
      bgGrad.addColorStop(0.32, '#0f0c09');
      bgGrad.addColorStop(1, '#060504');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const numRings = 11;
      for (let i = 0; i < numRings; i++) {
        const progress = (i / numRings + phase * 0.45) % 1;
        const radius = Math.pow(progress, 2.2) * (w * 0.58);
        const alpha = Math.sin(progress * Math.PI) * 0.54;
        if (radius < 6) continue;

        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(229, 193, 88, ${alpha.toFixed(3)})`
            : `rgba(244, 241, 234, ${(alpha * 0.45).toFixed(3)})`;
        ctx.lineWidth = 0.8 + progress * 2.1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * 1.35, radius * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const s of streaks) {
        if (advanceMotion) {
          s.z += s.speed * boost;
          if (s.z > 1) s.z -= 1;
        }

        const r1 = Math.pow(s.z, 2.1) * (w * 0.62);
        const r2 = Math.pow(Math.min(1, s.z + 0.09 * boost), 2.1) * (w * 0.65);

        const x1 = cx + Math.cos(s.angle) * r1 * 1.35;
        const y1 = cy + Math.sin(s.angle) * r1 * 0.62;
        const x2 = cx + Math.cos(s.angle) * r2 * 1.35;
        const y2 = cy + Math.sin(s.angle) * r2 * 0.62;

        const alpha = Math.min(0.92, s.z * 0.95);
        ctx.strokeStyle = s.warm
          ? `rgba(229, 193, 88, ${alpha.toFixed(3)})`
          : `rgba(255, 250, 238, ${(alpha * 0.6).toFixed(3)})`;
        ctx.lineWidth = 1 + s.z * 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(229, 193, 88, 0.25)';
      ctx.lineWidth = 1.2;
      for (let lane = -2; lane <= 2; lane++) {
        ctx.beginPath();
        ctx.moveTo(cx + lane * 8, cy + 8);
        ctx.lineTo(cx + lane * 175, h);
        ctx.stroke();
      }
    };

    const tick = () => {
      if (!isVisible || document.hidden) {
        raf = 0;
        return;
      }
      drawFrame(true);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        drawFrame(false);
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

    const onScroll = () => {
      if (!isVisible) return;
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      boost = Math.min(4.0, 1 + delta * 0.04);
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

    observer.observe(container);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl overflow-hidden border border-[#e5c158]/25 bg-[#060504]"
    >
      <canvas
        ref={canvasRef}
        width={960}
        height={220}
        className="w-full h-[180px] sm:h-[220px] lg:h-[240px] block"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080706]/85 via-transparent to-[#080706]/85" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className="text-[10px] sm:text-xs font-mono-tech uppercase tracking-[0.28em] text-[#e5c158]">
          {subtitle}
        </span>
        <h3 className="font-display text-xl sm:text-3xl font-extrabold text-[#f4f1ea] mt-1">
          {title}
        </h3>
      </div>
    </div>
  );
};
