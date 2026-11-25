import React, { useEffect, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X, ArrowDown, ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CLICKED_GALLERY_PHOTOS, type GalleryPhotoItem } from '../data/vehicles';
import { DEFAULT_SITE_CMS } from '../data/defaultCms';
import { AnimatedSplitText, ScrollReveal, ShootingStarsCanvas } from './MotionEffects';

interface ClickedGalleryProps {
  onNotify?: (msg: string) => void;
  galleryCopy?: {
    eyebrow: string;
    signature: string;
    title: string;
    subtitle: string;
  };
  photos?: GalleryPhotoItem[];
}

export const ClickedGallery: React.FC<ClickedGalleryProps> = ({
  onNotify,
  galleryCopy = {
    eyebrow: DEFAULT_SITE_CMS.homeSections.galleryEyebrow,
    signature: DEFAULT_SITE_CMS.homeSections.gallerySignature,
    title: DEFAULT_SITE_CMS.homeSections.galleryTitle,
    subtitle: DEFAULT_SITE_CMS.homeSections.gallerySubtitle,
  },
  photos = CLICKED_GALLERY_PHOTOS,
}) => {
  const safePhotos = photos.length > 0 ? photos : CLICKED_GALLERY_PHOTOS;

  const categories = ['All', ...Array.from(new Set(safePhotos.map((p) => p.category)))];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAll, setShowAll] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});

  const filteredPhotos =
    selectedCategory === 'All'
      ? safePhotos
      : safePhotos.filter((p) => p.category === selectedCategory);

  const visiblePhotos = showAll ? filteredPhotos : filteredPhotos.slice(0, 12);
  const activeItem =
    lightboxIdx !== null && filteredPhotos[lightboxIdx] ? filteredPhotos[lightboxIdx] : null;

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((idx) => (idx === null ? null : (idx + 1) % filteredPhotos.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx((idx) =>
          idx === null ? null : (idx - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, filteredPhotos.length]);

  return (
    <section
      id="clicked-gallery"
      className="scroll-mt-20 relative overflow-hidden py-20 sm:py-28 border-t border-white/[0.08] bg-[#080706]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <ShootingStarsCanvas density="subtle" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Photography Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <ScrollReveal direction="left">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#e5c158]">
                {galleryCopy.eyebrow}
              </span>
              <span className="signature-gold-glow text-2xl sm:text-3xl select-none">
                {galleryCopy.signature}
              </span>
            </div>
            <AnimatedSplitText
              text={galleryCopy.title}
              as="h2"
              mode="view"
              className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 text-balance"
            />
            <p className="text-sm text-[#a3acb9] max-w-2xl leading-relaxed mt-3">
              {galleryCopy.subtitle}
            </p>
          </ScrollReveal>

          {/* Interactive Category Filter Tabs */}
          <ScrollReveal direction="right" className="self-start lg:self-end">
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#12100d] border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setLightboxIdx(null);
                    setShowAll(false);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#e5c158] text-[#080706]'
                      : 'text-[#a3acb9] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Quiet Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#a59b84] border-b border-white/[0.08] pb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono-tech">
            <span className="text-[#e5c158]">{filteredPhotos.length} Frames Archived</span>
            <span aria-hidden="true">·</span>
            <span>All photographs captured by {galleryCopy.signature}</span>
          </div>
          <span className="font-mono-tech text-[11px] text-[#8d96a6]">
            Select any frame for full-resolution inspection
          </span>
        </div>

        {/* Media-First Editorial Masonry / Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visiblePhotos.map((item, idx) => {
            const isHeroLead = idx === 0 && visiblePhotos.length >= 4;
            const tileDirs = ['curtain', 'zoom', 'up', 'tilt-rise'] as const;
            const imgFailed = !!failedPhotos[item.id];
            return (
              <ScrollReveal
                key={item.id}
                direction={tileDirs[idx % tileDirs.length]}
                delay={(idx % 3) * 0.04}
                className={
                  isHeroLead
                    ? 'sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto min-h-[320px] lg:min-h-[460px]'
                    : 'aspect-[4/3]'
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIdx(idx);
                    onNotify?.(`Opening frame: ${item.title}`);
                  }}
                  className="group relative w-full h-full rounded-2xl overflow-hidden bg-[#100e0c] border border-white/[0.09] hover:border-[#e5c158]/55 transition-all duration-300 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5c158]"
                >
                  {imgFailed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#14110e] text-[#a59b84]">
                      <Camera className="w-7 h-7 text-[#e5c158]/60" />
                      <span className="text-[11px] font-mono-tech uppercase tracking-wider">
                        {item.title}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedPhotos((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080706]/90 via-[#080706]/15 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono-tech text-[#e5c158]">
                        <span>{String(idx + 1).padStart(2, '0')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.category}</span>
                      </div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-white mt-0.5 truncate">
                        {item.title}
                      </h3>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/85 group-hover:bg-[#e5c158] group-hover:text-[#080706] group-hover:border-[#e5c158] flex items-center justify-center shrink-0 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Expand / Collapse All Gallery Frames */}
        {filteredPhotos.length > 12 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="px-6 py-3 min-h-[44px] rounded-xl border border-[#e5c158]/40 bg-[#12100d] hover:bg-[#e5c158] text-[#f4f1ea] hover:text-[#080706] font-display text-xs font-bold uppercase tracking-[0.16em] inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              {showAll ? (
                <>
                  <span>Show Featured 12 Frames</span>
                  <ArrowUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Load All {filteredPhotos.length} Photographs</span>
                  <ArrowDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* FULLSCREEN PHOTOGRAPHY LIGHTBOX */}
      <AnimatePresence>
        {activeItem && lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[115] bg-black/94 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxIdx(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono-tech text-[#e5c158]">
                    <span>
                      Frame {String(lightboxIdx + 1).padStart(2, '0')} /{' '}
                      {String(filteredPhotos.length).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeItem.category}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-2xl font-bold text-white mt-0.5 truncate">
                    {activeItem.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setLightboxIdx(
                        (lightboxIdx - 1 + filteredPhotos.length) % filteredPhotos.length
                      )
                    }
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#e5c158] hover:text-black text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setLightboxIdx((lightboxIdx + 1) % filteredPhotos.length)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#e5c158] hover:text-black text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Close gallery lightbox"
                    onClick={() => setLightboxIdx(null)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#e5c158] hover:text-black text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#080706]">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[75vh] object-contain mx-auto"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#b4bcc9]">
                <span>{activeItem.note}</span>
                <span className="font-signature text-2xl text-[#e5c158]">
                  {galleryCopy.signature}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
