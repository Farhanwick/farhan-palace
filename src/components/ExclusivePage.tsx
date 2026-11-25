import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  Clock,
  Ban,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ExclusiveVaultItem, SiteCmsConfig } from '../types/cms';
import type { AppPage, BagLineItem } from '../types/navigation';
import type { ContactTrack } from './ContactAndFooter';
import { AnimatedSplitText, ScrollReveal } from './MotionEffects';

interface ExclusivePageProps {
  cms: SiteCmsConfig['exclusivePage'];
  onAddExclusiveItem: (item: ExclusiveVaultItem) => void;
  onAddToBag: (item: BagLineItem) => void;
  onNavigate: (page: AppPage) => void;
  onSelectContactTrack: (track: ContactTrack) => void;
  onNotify: (msg: string) => void;
}

const EXCLUSIVE_CATEGORIES: Array<'All' | ExclusiveVaultItem['category']> = [
  'All',
  'Timepieces',
  'Bespoke Aero & Carbon',
  'Collector Machines',
  'Motorsport Artifacts',
];

const EXCLUSIVE_PHOTO_PRESETS = [
  {
    label: 'Imperion Atelier Vault',
    url: '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
  },
  {
    label: 'Autoclave Carbon Package',
    url: '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
  },
  {
    label: 'Motorsport Track Hardware',
    url: '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
  },
  {
    label: 'Hypercar Emerald Carbon',
    url: '/src/assets/images/mclaren_p1_stage_1795257318769.jpg',
  },
];

const STATUS_LABELS: Record<ExclusiveVaultItem['status'], string> = {
  available: 'Available',
  upcoming: 'Allocation Soon',
  stock_out: 'Reserved / Out',
};

export const ExclusivePage: React.FC<ExclusivePageProps> = ({
  cms,
  onAddExclusiveItem,
  onAddToBag,
  onNavigate,
  onSelectContactTrack,
  onNotify,
}) => {
  const [mode, setMode] = useState<'vault' | 'submit'>('vault');
  const [categoryFilter, setCategoryFilter] =
    useState<'All' | ExclusiveVaultItem['category']>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | ExclusiveVaultItem['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cardImgIdx, setCardImgIdx] = useState<Record<string, number>>({});
  const [selectedItem, setSelectedItem] = useState<ExclusiveVaultItem | null>(null);
  const [modalImgIdx, setModalImgIdx] = useState(0);
  const [waitlisted, setWaitlisted] = useState<Record<string, boolean>>({});

  // Submit Exclusive Item Form
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newEdition, setNewEdition] = useState('Edition 1 of 10');
  const [newCategory, setNewCategory] =
    useState<ExclusiveVaultItem['category']>('Timepieces');
  const [newPrice, setNewPrice] = useState('28500');
  const [newGrade, setNewGrade] = useState('Grade S · Collector Sealed');
  const [newProvenance, setNewProvenance] = useState('Serialized Vault Certificate');
  const [newStatus, setNewStatus] = useState<ExclusiveVaultItem['status']>('available');
  const [newPhoto, setNewPhoto] = useState(EXCLUSIVE_PHOTO_PRESETS[0].url);
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    if (!selectedItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedItem]);

  const filteredItems = useMemo(() => {
    return cms.items.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${item.title} ${item.brand} ${item.editionTag} ${item.provenance}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cms.items, categoryFilter, statusFilter, searchQuery]);

  const cycleCardImage = (id: string, len: number, delta: number) => {
    setCardImgIdx((prev) => {
      const cur = prev[id] || 0;
      return { ...prev, [id]: (cur + delta + len) % len };
    });
  };

  const handleReserveExclusive = (item: ExclusiveVaultItem) => {
    onAddToBag({
      id: item.id,
      kind: 'exclusive',
      title: item.title,
      subtitle: `${item.brand} · ${item.editionTag}`,
      priceUsd: item.priceUsd,
      grade: item.grade,
      image: item.images[0],
      quantity: 1,
    });
  };

  const handleSubmitExclusive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBrand.trim()) return;

    const numericPrice = Math.max(500, Number(newPrice.replace(/[^0-9]/g, '')) || 15000);
    const created: ExclusiveVaultItem = {
      id: `exc-user-${Date.now()}`,
      title: newTitle.trim(),
      brand: newBrand.trim(),
      editionTag: newEdition.trim() || 'Private Collector Edition',
      category: newCategory,
      priceUsd: numericPrice,
      allocationLabel: newStatus === 'available' ? '1 Piece Available' : 'By Private Allocation',
      status: newStatus,
      grade: newGrade,
      provenance: newProvenance.trim() || 'Verified Private Consignment',
      paymentNote: 'Payment terms finalized directly upon reservation confirmation',
      images: [newPhoto, EXCLUSIVE_PHOTO_PRESETS[1].url],
      description:
        newDesc.trim() ||
        `Exclusive collector offering submitted to FARHAN PALACE Private Vault.`,
      highlights: [
        `Grade Verified: ${newGrade}`,
        `Provenance: ${newProvenance.trim() || 'Authenticated Private Vault'}`,
        'White-glove insured dispatch upon settlement agreement',
      ],
    };

    onAddExclusiveItem(created);
    setNewTitle('');
    setNewBrand('');
    setNewDesc('');
    setMode('vault');
    setCategoryFilter('All');
    setStatusFilter('all');
    onNotify(`Added to Exclusive Panel: ${created.title}`);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#ffffff] text-[#11100e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <ScrollReveal direction="left" className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#e5e2da] pb-6">
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
              className="font-display text-3xl sm:text-5xl font-extrabold text-[#11100e] tracking-tight mt-2"
            />
            <p className="text-xs sm:text-sm text-[#5b564c] mt-2 max-w-2xl leading-relaxed">
              {cms.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f4f2ec] p-1.5 rounded-xl border border-[#e5e2da] self-start lg:self-end shrink-0">
            <button
              type="button"
              onClick={() => setMode('vault')}
              className={`px-4 py-2.5 min-h-[40px] rounded-lg font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'vault'
                  ? 'bg-[#11100e] text-white'
                  : 'text-[#5b564c] hover:text-[#11100e]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Exclusive Vault ({cms.items.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('submit')}
              className={`px-4 py-2.5 min-h-[40px] rounded-lg font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'submit'
                  ? 'bg-[#11100e] text-white'
                  : 'text-[#5b564c] hover:text-[#11100e]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Exclusive Item</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Deferred Payment Terms Notice Strip */}
        <ScrollReveal direction="curtain">
          <div className="rounded-2xl border border-[#b5892a]/40 bg-[#fdfaf3] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#9b7218] shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs sm:text-sm text-[#36332c] leading-relaxed">
                {cms.paymentBanner}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="text-xs font-display font-bold uppercase tracking-wider text-[#9b7218] hover:text-[#11100e] inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View All Services</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {mode === 'vault' ? (
            <motion.div
              key="exclusive-vault-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Search & Filters */}
              <div className="white-panel rounded-2xl p-4 sm:p-5 space-y-4 bg-[#faf9f6]">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#7d7668] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search edition, timepiece, carbon kit, provenance..."
                      aria-label="Search exclusive vault items"
                      className="w-full min-h-[44px] rounded-xl bg-white border border-[#dedad0] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#11100e] placeholder:text-[#8c8577] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: 'all', label: 'All Status' },
                        { id: 'available', label: 'Available' },
                        { id: 'upcoming', label: 'Allocation Soon' },
                        { id: 'stock_out', label: 'Reserved / Out' },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStatusFilter(st.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer border transition-colors ${
                          statusFilter === st.id
                            ? 'bg-[#11100e] text-white border-[#11100e]'
                            : 'bg-white text-[#5b564c] border-[#dedad0] hover:text-[#11100e]'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#e5e2da]">
                  {EXCLUSIVE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                        categoryFilter === cat
                          ? 'bg-[#b5892a] text-white border-[#b5892a]'
                          : 'bg-white text-[#36332c] border-[#dedad0] hover:border-[#b5892a]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exclusive Grid */}
              {filteredItems.length === 0 ? (
                <div className="white-panel rounded-3xl p-10 text-center space-y-3">
                  <p className="font-display text-xl font-bold text-[#11100e]">
                    No matching exclusive pieces found
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('All');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#11100e] text-white text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reset Vault Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item, idx) => {
                    const imgIdx = cardImgIdx[item.id] || 0;
                    const activeImg = item.images[imgIdx] || item.images[0];
                    const isWaitlisted = !!waitlisted[item.id];
                    const cardDirs = ['zoom', 'curtain', 'tilt-rise'] as const;

                    return (
                      <ScrollReveal
                        key={item.id}
                        direction={cardDirs[idx % cardDirs.length]}
                        delay={(idx % 3) * 0.05}
                      >
                        <article className="white-panel rounded-3xl overflow-hidden flex flex-col justify-between h-full">
                          <div>
                            <div className="relative aspect-[16/10] bg-[#11100e] group overflow-hidden">
                              <img
                                src={activeImg}
                                alt={item.title}
                                loading={idx < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setModalImgIdx(imgIdx);
                                }}
                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer ${
                                  item.status === 'stock_out' ? 'opacity-70 grayscale-[25%]' : ''
                                }`}
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                              {item.images.length > 1 && (
                                <>
                                  <button
                                    type="button"
                                    aria-label="Previous exclusive photo"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cycleCardImage(item.id, item.images.length, -1);
                                    }}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white hover:border-[#e5c158] flex items-center justify-center cursor-pointer transition-colors"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Next exclusive photo"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cycleCardImage(item.id, item.images.length, 1);
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white hover:border-[#e5c158] flex items-center justify-center cursor-pointer transition-colors"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                                <span
                                  className={`text-[11px] font-mono-tech uppercase tracking-wider px-2.5 py-1 rounded ${
                                    item.status === 'available'
                                      ? 'bg-[#e5c158] text-[#11100e] font-bold'
                                      : item.status === 'upcoming'
                                        ? 'bg-white text-[#11100e] font-bold'
                                        : 'bg-[#11100e]/85 text-white/80'
                                  }`}
                                >
                                  {STATUS_LABELS[item.status]}
                                </span>
                                <span className="text-[11px] font-mono-tech text-[#e5c158] bg-black/70 px-2 py-0.5 rounded truncate max-w-[160px]">
                                  {item.editionTag}
                                </span>
                              </div>
                            </div>

                            <div className="p-5 sm:p-6 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech">
                                <span className="text-[#9b7218] font-semibold">{item.grade}</span>
                                <span className="text-[#5b564c]">{item.category}</span>
                              </div>

                              <div>
                                <div className="text-xs uppercase tracking-[0.14em] text-[#5b564c] font-semibold">
                                  {item.brand}
                                </div>
                                <h2 className="font-display text-lg font-extrabold text-[#11100e] mt-0.5 leading-snug">
                                  {item.title}
                                </h2>
                              </div>

                              <div className="flex items-baseline justify-between pt-2 border-t border-[#e5e2da] gap-2">
                                <span className="font-mono-tech text-xl font-bold text-[#9b7218] tabular-nums">
                                  ${item.priceUsd.toLocaleString('en-US')}
                                </span>
                                <span className="text-[11px] font-mono-tech text-[#36332c] truncate">
                                  {item.allocationLabel}
                                </span>
                              </div>

                              <p className="text-xs text-[#5b564c] leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedItem(item);
                                setModalImgIdx(imgIdx);
                              }}
                              className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#d6d1c6] bg-white hover:border-[#11100e] text-xs font-display font-bold uppercase tracking-wider text-[#11100e] transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>

                            {item.status === 'available' && (
                              <button
                                type="button"
                                onClick={() => handleReserveExclusive(item)}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Reserve</span>
                              </button>
                            )}

                            {item.status === 'upcoming' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setWaitlisted((p) => ({ ...p, [item.id]: true }));
                                  onNotify(`Allocation hold registered for ${item.title}`);
                                }}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#b5892a] bg-[#fdf8ed] hover:bg-[#11100e] text-[#8f6714] hover:text-white text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>{isWaitlisted ? 'Hold Active' : 'Request Slot'}</span>
                              </button>
                            )}

                            {item.status === 'stock_out' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectContactTrack('imperion');
                                  onNavigate('contact');
                                }}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#d6d1c6] text-[#5b564c] hover:border-[#11100e] hover:text-[#11100e] text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Source Next</span>
                              </button>
                            )}
                          </div>
                        </article>
                      </ScrollReveal>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="exclusive-submit-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5 white-panel rounded-3xl p-6 sm:p-8 space-y-4 bg-[#faf9f6]">
                <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#9b7218]">
                  Exclusive Consignment
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#11100e]">
                  Submit a Collector Piece to Exclusive Vault
                </h2>
                <p className="text-xs sm:text-sm text-[#5b564c] leading-relaxed">
                  Offer serialized timepieces, bespoke factory aero packages, numbered memorabilia, or one-off vehicles directly to private collectors. Payment terms are configured directly upon buyer match.
                </p>
              </div>

              <form
                onSubmit={handleSubmitExclusive}
                className="lg:col-span-7 white-panel rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Item / Edition Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Carbon Tourbillon Chrono"
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      House / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="e.g., Porsche Design, RM, MSO"
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value as ExclusiveVaultItem['category'])
                      }
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    >
                      <option value="Timepieces">Timepieces</option>
                      <option value="Bespoke Aero & Carbon">Bespoke Aero &amp; Carbon</option>
                      <option value="Collector Machines">Collector Machines</option>
                      <option value="Motorsport Artifacts">Motorsport Artifacts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Valuation (USD)
                    </label>
                    <input
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] font-mono-tech focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Vault Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as ExclusiveVaultItem['status'])
                      }
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    >
                      <option value="available">Available</option>
                      <option value="upcoming">Allocation Soon</option>
                      <option value="stock_out">Reserved / Out</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Edition Numbering
                    </label>
                    <input
                      type="text"
                      value={newEdition}
                      onChange={(e) => setNewEdition(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Grade
                    </label>
                    <input
                      type="text"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Provenance
                    </label>
                    <input
                      type="text"
                      value={newProvenance}
                      onChange={(e) => setNewProvenance(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-2">
                    Select Studio Reference Plate
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {EXCLUSIVE_PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setNewPhoto(preset.url)}
                        className={`rounded-xl overflow-hidden border-2 aspect-[16/10] cursor-pointer ${
                          newPhoto === preset.url
                            ? 'border-[#b5892a]'
                            : 'border-[#e5e2da] opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                    Collector Notes &amp; History
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Box/papers, serialization, collector condition notes..."
                    className="w-full rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-3 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer"
                >
                  Publish to Exclusive Panel
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Exclusive Item Inspect Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl w-full rounded-3xl bg-white text-[#11100e] border border-[#e5e2da] overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-[#11100e]">
                <img
                  src={selectedItem.images[modalImgIdx] || selectedItem.images[0]}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />
                <button
                  type="button"
                  aria-label="Close exclusive item modal"
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-black/75 border border-white/25 text-white hover:border-[#e5c158] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono-tech uppercase tracking-[0.18em] text-[#e5c158]">
                      {selectedItem.brand} · {selectedItem.editionTag}
                    </span>
                    <h3 className="font-display text-xl sm:text-3xl font-extrabold text-white mt-0.5">
                      {selectedItem.title}
                    </h3>
                  </div>
                  <div className="font-mono-tech text-2xl font-bold text-[#e5c158] tabular-nums">
                    ${selectedItem.priceUsd.toLocaleString('en-US')}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-5">
                {selectedItem.images.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {selectedItem.images.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => setModalImgIdx(i)}
                        className={`w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                          modalImgIdx === i
                            ? 'border-[#9b7218]'
                            : 'border-[#e5e2da] opacity-65 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={src}
                          alt={`${selectedItem.title} view ${i + 1}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#fdfaf3] border border-[#b5892a]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono-tech text-[#5b564c]">
                      Provenance: <strong className="text-[#11100e]">{selectedItem.provenance}</strong>
                    </div>
                    <div className="text-xs text-[#9b7218] font-medium">
                      {selectedItem.paymentNote}
                    </div>
                  </div>
                  {selectedItem.status === 'available' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleReserveExclusive(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors shrink-0"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Reserve in Bag</span>
                    </button>
                  )}
                </div>

                <p className="text-sm text-[#36332c] leading-relaxed">
                  {selectedItem.description}
                </p>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#5b564c] font-semibold mb-2.5">
                    Collector Provenance &amp; Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedItem.highlights.map((hl) => (
                      <li key={hl} className="text-sm text-[#36332c] flex items-start gap-2.5">
                        <span className="text-[#9b7218] font-mono-tech">—</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
