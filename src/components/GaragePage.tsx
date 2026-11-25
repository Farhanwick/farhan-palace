import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  ShoppingBag,
  Clock,
  Ban,
  X,
  CheckCircle2,
  Wrench,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { GarageProduct, ListingStatus } from '../data/vehicles';
import type { BagLineItem } from '../types/navigation';
import { AnimatedSplitText, ScrollPassOutBand, ScrollReveal } from './MotionEffects';

interface GaragePageProps {
  items: GarageProduct[];
  onAddGarageItem: (item: GarageProduct) => void;
  onAddToBag: (item: BagLineItem) => void;
  onNotify: (msg: string) => void;
}

const GARAGE_CATEGORIES: Array<'All' | GarageProduct['category']> = [
  'All',
  'Wheels & Brakes',
  'Aero & Carbon',
  'Exhaust & Intake',
  'Cinema & Detailing',
];

const ITEM_PHOTO_PRESETS = [
  {
    label: 'Forged Wheel & Carbon-Ceramic Rotor',
    url: '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
  },
  {
    label: 'Pre-Preg Carbon Aero & Titanium Hardware',
    url: '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg',
  },
  {
    label: 'Imperion Atelier Cinema Rig Setup',
    url: '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
  },
];

const STATUS_LABELS: Record<ListingStatus, string> = {
  available: 'Available',
  upcoming: 'Upcoming',
  stock_out: 'Stock Out',
};

export const GaragePage: React.FC<GaragePageProps> = ({
  items,
  onAddGarageItem,
  onAddToBag,
  onNotify,
}) => {
  const [mode, setMode] = useState<'shop' | 'sell'>('shop');
  const [categoryFilter, setCategoryFilter] =
    useState<'All' | GarageProduct['category']>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | ListingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<GarageProduct | null>(null);
  const [modalImgIdx, setModalImgIdx] = useState(0);
  const [preorderedIds, setPreorderedIds] = useState<Record<string, boolean>>({});

  // Sell Car Item form state
  const [sellName, setSellName] = useState('');
  const [sellBrand, setSellBrand] = useState('');
  const [sellCategory, setSellCategory] =
    useState<GarageProduct['category']>('Aero & Carbon');
  const [sellPrice, setSellPrice] = useState('1850');
  const [sellGrade, setSellGrade] = useState('Grade S · Mint OEM+');
  const [sellFitment, setSellFitment] = useState('Universal / BMW M / Porsche');
  const [sellStatus, setSellStatus] = useState<ListingStatus>('available');
  const [sellImage, setSellImage] = useState(ITEM_PHOTO_PRESETS[0].url);
  const [sellDesc, setSellDesc] = useState('');

  useEffect(() => {
    if (!selectedProduct) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProduct]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${item.name} ${item.brand} ${item.category} ${item.fitment} ${item.sku}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, categoryFilter, statusFilter, searchQuery]);

  const handleAddPartToBag = (product: GarageProduct) => {
    onAddToBag({
      id: product.id,
      kind: 'part',
      title: product.name,
      subtitle: `${product.brand} · ${product.category}`,
      priceUsd: product.priceUsd,
      grade: product.grade,
      image: product.images[0],
      quantity: 1,
    });
  };

  const handleSubmitSellItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellName.trim() || !sellBrand.trim()) return;

    const numericPrice = Math.max(50, Number(sellPrice.replace(/[^0-9]/g, '')) || 950);
    const created: GarageProduct = {
      id: `gr-user-${Date.now()}`,
      name: sellName.trim(),
      brand: sellBrand.trim(),
      category: sellCategory,
      priceUsd: numericPrice,
      grade: sellGrade,
      status: sellStatus,
      fitment: sellFitment.trim() || 'Multi-Chassis Fitment',
      sku: `USR-${String(items.length + 10).padStart(3, '0')}`,
      images: [sellImage, '/src/assets/images/garage_carbon_aero_kit_1795352099110.jpg'],
      description:
        sellDesc.trim() ||
        `Verified seller hardware listing for ${sellName.trim()} submitted directly into FARHAN PALACE Garage.`,
      specs: [
        `Fitment: ${sellFitment.trim() || 'Multi-Chassis Fitment'}`,
        `Condition Grade: ${sellGrade}`,
        'Ready for local pickup or insured courier dispatch',
      ],
    };

    onAddGarageItem(created);
    setSellName('');
    setSellBrand('');
    setSellDesc('');
    setMode('shop');
    setCategoryFilter('All');
    setStatusFilter('all');
    onNotify(`Published ${created.name} in Garage`);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#ffffff] text-[#11100e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* GARAGE HEADER & BUY / SELL WINDOW SWITCHER */}
        <ScrollReveal direction="left" className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#e5e2da] pb-6">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
                Hardware, Aero &amp; Care
              </span>
              <span className="signature-ink-gold text-2xl select-none">
                Performance Garage
              </span>
            </div>
            <AnimatedSplitText
              text="The Garage"
              as="h1"
              mode="mount"
              className="font-display text-3xl sm:text-5xl font-extrabold text-[#11100e] tracking-tight mt-2"
            />
            <p className="text-xs sm:text-sm text-[#5b564c] mt-2 max-w-2xl leading-relaxed">
              Order forged wheels, dry-carbon aero, titanium exhausts, ceramic brake kits, and cinema mounts — or list performance parts in our member exchange.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f4f2ec] p-1.5 rounded-xl border border-[#e5e2da] self-start lg:self-end shrink-0">
            <button
              type="button"
              onClick={() => setMode('shop')}
              className={`px-4 py-2.5 min-h-[40px] rounded-lg font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'shop'
                  ? 'bg-[#11100e] text-white'
                  : 'text-[#5b564c] hover:text-[#11100e]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Shop Car Items ({items.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('sell')}
              className={`px-4 py-2.5 min-h-[40px] rounded-lg font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'sell'
                  ? 'bg-[#11100e] text-white'
                  : 'text-[#5b564c] hover:text-[#11100e]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Sell Car Item</span>
            </button>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {mode === 'shop' ? (
            <motion.div
              key="garage-shop-window"
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* SEARCH + CATEGORY + STATUS FILTERS */}
              <div className="white-panel rounded-2xl p-4 sm:p-5 space-y-4 bg-[#faf9f6]">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#7d7668] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search parts, SKU, chassis fitment..."
                      aria-label="Search garage parts"
                      className="w-full min-h-[44px] rounded-xl bg-white border border-[#dedad0] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#11100e] placeholder:text-[#8c8577] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: 'all', label: 'All Status' },
                        { id: 'available', label: 'Available' },
                        { id: 'upcoming', label: 'Upcoming' },
                        { id: 'stock_out', label: 'Stock Out' },
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
                  {GARAGE_CATEGORIES.map((cat) => (
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

              {/* PRODUCTS GRID */}
              {filteredItems.length === 0 ? (
                <div className="white-panel rounded-3xl p-10 text-center space-y-3">
                  <p className="font-display text-xl font-bold text-[#11100e]">
                    No garage items match
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
                    Show All Parts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, idx) => {
                    const isPreordered = !!preorderedIds[item.id];
                    const cardDirs = ['left', 'zoom', 'right'] as const;
                    return (
                      <ScrollReveal
                        key={item.id}
                        direction={cardDirs[idx % cardDirs.length]}
                        delay={(idx % 3) * 0.06}
                      >
                        <article className="white-panel rounded-3xl overflow-hidden flex flex-col justify-between h-full">
                          <div>
                            <div
                              onClick={() => {
                                setSelectedProduct(item);
                                setModalImgIdx(0);
                              }}
                              className="relative aspect-[16/10] bg-[#f1efe9] overflow-hidden group cursor-pointer"
                            >
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                loading={idx < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                                  item.status === 'stock_out' ? 'opacity-65 grayscale-[30%]' : ''
                                }`}
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />

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
                                <span className="text-[11px] font-mono-tech text-white bg-black/65 px-2 py-0.5 rounded">
                                  {item.sku}
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
                                <h2 className="font-display text-lg font-bold text-[#11100e] mt-0.5 leading-snug">
                                  {item.name}
                                </h2>
                              </div>

                              <div className="text-xs text-[#36332c] pt-2 border-t border-[#e5e2da] flex items-baseline justify-between gap-2">
                                <span className="font-mono-tech text-xl font-bold text-[#9b7218] tabular-nums">
                                  ${item.priceUsd.toLocaleString('en-US')}
                                </span>
                                <span className="text-[11px] text-[#5b564c] truncate">
                                  {item.fitment}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProduct(item);
                                setModalImgIdx(0);
                              }}
                              className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#d6d1c6] bg-white hover:border-[#11100e] text-xs font-display font-bold uppercase tracking-wider text-[#11100e] transition-colors cursor-pointer"
                            >
                              Inspect
                            </button>

                            {item.status === 'available' && (
                              <button
                                type="button"
                                onClick={() => handleAddPartToBag(item)}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add to Bag</span>
                              </button>
                            )}

                            {item.status === 'upcoming' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPreorderedIds((p) => ({ ...p, [item.id]: true }));
                                  onNotify(`Pre-Order registered for ${item.name}`);
                                }}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#b5892a] bg-[#fdf8ed] hover:bg-[#11100e] text-[#8f6714] hover:text-white text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>{isPreordered ? 'Pre-Ordered' : 'Pre-Order'}</span>
                              </button>
                            )}

                            {item.status === 'stock_out' && (
                              <button
                                type="button"
                                disabled
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#e5e2da] bg-[#f4f2ec] text-[#8c8577] text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 cursor-not-allowed"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Sold Out</span>
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
            /* SELL CAR ITEM WINDOW */
            <motion.div
              key="garage-sell-window"
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5 white-panel rounded-3xl p-6 sm:p-8 space-y-4 bg-[#faf9f6]">
                <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#9b7218]">
                  Garage Exchange Desk
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#11100e]">
                  Sell Performance Hardware or Accessories
                </h2>
                <p className="text-xs sm:text-sm text-[#5b564c] leading-relaxed">
                  Got OEM forged wheels, carbon aero, titanium exhausts, or filming mounts? Publish directly to the FARHAN PALACE Garage marketplace.
                </p>
                <div className="pt-2 border-t border-[#e5e2da] space-y-2 text-xs text-[#36332c]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9b7218] shrink-0 mt-0.5" />
                    <span>Instant listing card with Grade &amp; Chassis Fitment tag</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9b7218] shrink-0 mt-0.5" />
                    <span>Buyers can inspect specs &amp; add straight to Acquisition Bag</span>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmitSellItem}
                className="lg:col-span-7 white-panel rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Part / Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellName}
                      onChange={(e) => setSellName(e.target.value)}
                      placeholder="e.g., forged carbon diffuser"
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Manufacturer / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellBrand}
                      onChange={(e) => setSellBrand(e.target.value)}
                      placeholder="e.g., Akrapovič, Brembo, BBS"
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
                      value={sellCategory}
                      onChange={(e) => setSellCategory(e.target.value as GarageProduct['category'])}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    >
                      <option value="Wheels & Brakes">Wheels &amp; Brakes</option>
                      <option value="Aero & Carbon">Aero &amp; Carbon</option>
                      <option value="Exhaust & Intake">Exhaust &amp; Intake</option>
                      <option value="Cinema & Detailing">Cinema &amp; Detailing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Price (USD)
                    </label>
                    <input
                      type="text"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] font-mono-tech focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Status
                    </label>
                    <select
                      value={sellStatus}
                      onChange={(e) => setSellStatus(e.target.value as ListingStatus)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    >
                      <option value="available">Available</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="stock_out">Stock Out</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Grade
                    </label>
                    <input
                      type="text"
                      value={sellGrade}
                      onChange={(e) => setSellGrade(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Compatible Chassis Fitment
                    </label>
                    <input
                      type="text"
                      value={sellFitment}
                      onChange={(e) => setSellFitment(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-2">
                    Select Item Studio Image
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {ITEM_PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setSellImage(preset.url)}
                        className={`rounded-xl overflow-hidden border-2 aspect-[16/10] cursor-pointer transition-all ${
                          sellImage === preset.url
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
                    Hardware Description
                  </label>
                  <textarea
                    rows={3}
                    value={sellDesc}
                    onChange={(e) => setSellDesc(e.target.value)}
                    placeholder="Material, usage mileage, included mounting hardware..."
                    className="w-full rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-3 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer"
                >
                  Publish Item to Garage Catalog
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bidirectional Passing-Out Scroll Divider */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 pt-6">
          <ScrollPassOutBand
            isWhitePage
            topItems={[
              'Forged Wheels',
              'Dry Carbon Aero',
              'Titanium Acoustics',
              'Imperion Garage',
            ]}
            bottomItems={[
              'OEM+ Fitment Verified',
              'Track Braking Kits',
              'Suction Cinema Rigs',
              'Member Exchange',
            ]}
          />
        </div>
      </div>

      {/* GARAGE PRODUCT INSPECT MODAL (WHITE WINDOW WITH SMOOTH ANIMATION) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl w-full rounded-3xl bg-white text-[#11100e] border border-[#e5e2da] overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-[#11100e]">
                <img
                  src={selectedProduct.images[modalImgIdx] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />
                <button
                  type="button"
                  aria-label="Close product modal"
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-black/75 border border-white/25 text-white hover:border-[#e5c158] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono-tech uppercase tracking-[0.18em] text-[#e5c158]">
                      {selectedProduct.brand} · {selectedProduct.sku} · {selectedProduct.grade}
                    </span>
                    <h3 className="font-display text-xl sm:text-3xl font-extrabold text-white mt-0.5">
                      {selectedProduct.name}
                    </h3>
                  </div>
                  <div className="font-mono-tech text-2xl font-bold text-[#e5c158] tabular-nums">
                    ${selectedProduct.priceUsd.toLocaleString('en-US')}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-5">
                {selectedProduct.images.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {selectedProduct.images.map((src, idx) => (
                      <button
                        key={src + idx}
                        type="button"
                        onClick={() => setModalImgIdx(idx)}
                        className={`w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                          modalImgIdx === idx
                            ? 'border-[#9b7218]'
                            : 'border-[#e5e2da] opacity-65 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={src}
                          alt={`${selectedProduct.name} view ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#faf9f6] border border-[#e5e2da] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono-tech text-[#5b564c]">
                      Fitment: <span className="text-[#11100e] font-semibold">{selectedProduct.fitment}</span>
                    </div>
                    <div className="text-xs font-mono-tech text-[#5b564c] mt-1">
                      Availability:{' '}
                      <span className="text-[#9b7218] font-bold">
                        {STATUS_LABELS[selectedProduct.status]}
                      </span>
                    </div>
                  </div>
                  {selectedProduct.status === 'available' ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleAddPartToBag(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  ) : selectedProduct.status === 'upcoming' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPreorderedIds((p) => ({ ...p, [selectedProduct.id]: true }));
                        onNotify(`Pre-Order confirmed for ${selectedProduct.name}`);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-[#b5892a] bg-[#fdf8ed] text-[#8f6714] hover:bg-[#11100e] hover:text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Pre-Order Incoming Batch</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono-tech uppercase text-[#7d7668]">
                      Currently Stock Out
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#36332c] leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#5b564c] font-semibold mb-2.5">
                    Technical Specifications
                  </h4>
                  <ul className="space-y-2">
                    {selectedProduct.specs.map((sp) => (
                      <li key={sp} className="text-sm text-[#36332c] flex items-start gap-2.5">
                        <span className="text-[#9b7218] font-mono-tech">—</span>
                        <span>{sp}</span>
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
