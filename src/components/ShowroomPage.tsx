import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Ban,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ListingStatus, ShowroomCar } from '../data/vehicles';
import type { AppPage, BagLineItem } from '../types/navigation';
import { AnimatedSplitText, ScrollPassOutBand, ScrollReveal } from './MotionEffects';

interface ShowroomPageProps {
  cars: ShowroomCar[];
  onAddCarListing: (car: ShowroomCar) => void;
  onAddToBag: (item: BagLineItem) => void;
  onNavigate: (page: AppPage) => void;
  onSelectContactTrack: (track: 'imperion' | 'clexora' | 'cinema' | 'showroom') => void;
  onNotify: (msg: string) => void;
}

const PHOTO_PRESETS = [
  {
    label: 'Porsche 911 GT3 RS Studio Plate',
    url: '/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg',
  },
  {
    label: 'McLaren 750S Liquid Titanium Plate',
    url: '/src/assets/images/mclaren_750s_coupe_1795352099173.jpg',
  },
  {
    label: 'Lamborghini Huracán Tecnica Plate',
    url: '/src/assets/images/lamborghini_huracan_stage_1795257318944.jpg',
  },
  {
    label: 'Nissan GT-R Nismo R35 Plate',
    url: '/src/assets/images/nissan_gtr_r35_nismo_1795352099257.jpg',
  },
];

const STATUS_LABELS: Record<ListingStatus, string> = {
  available: 'Available',
  upcoming: 'Upcoming',
  stock_out: 'Stock Out',
};

const formatUsd = (amount: number) =>
  `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export const ShowroomPage: React.FC<ShowroomPageProps> = ({
  cars,
  onAddCarListing,
  onAddToBag,
  onNavigate,
  onSelectContactTrack,
  onNotify,
}) => {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ListingStatus>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'S' | '5A' | '4.5'>('all');

  const [cardImageIdx, setCardImageIdx] = useState<Record<string, number>>({});
  const [selectedCar, setSelectedCar] = useState<ShowroomCar | null>(null);
  const [modalImageIdx, setModalImageIdx] = useState(0);
  const [waitlistedIds, setWaitlistedIds] = useState<Record<string, boolean>>({});

  // Sell Your Car form state
  const [sellBrand, setSellBrand] = useState('');
  const [sellModel, setSellModel] = useState('');
  const [sellYear, setSellYear] = useState('2024');
  const [sellPrice, setSellPrice] = useState('145000');
  const [sellGrade, setSellGrade] = useState('Grade 5A · Mint');
  const [sellMileage, setSellMileage] = useState('3,200 km');
  const [sellEngine, setSellEngine] = useState('4.0L Twin-Turbo V8');
  const [sellHp, setSellHp] = useState('600 HP');
  const [sellStatus, setSellStatus] = useState<ListingStatus>('available');
  const [sellPhotoUrl, setSellPhotoUrl] = useState(PHOTO_PRESETS[0].url);
  const [sellSummary, setSellSummary] = useState('');

  useEffect(() => {
    if (!selectedCar) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCar(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCar]);

  const counts = useMemo(() => {
    return {
      all: cars.length,
      available: cars.filter((c) => c.status === 'available').length,
      upcoming: cars.filter((c) => c.status === 'upcoming').length,
      stock_out: cars.filter((c) => c.status === 'stock_out').length,
    };
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (statusFilter !== 'all' && car.status !== statusFilter) return false;
      if (gradeFilter === 'S' && !car.grade.includes('Grade S')) return false;
      if (gradeFilter === '5A' && !car.grade.includes('5A')) return false;
      if (gradeFilter === '4.5' && !car.grade.includes('4.5')) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${car.brand} ${car.model} ${car.grade} ${car.engine} ${car.exteriorColor}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cars, statusFilter, gradeFilter, searchQuery]);

  const cycleCardImage = (carId: string, total: number, delta: number) => {
    setCardImageIdx((prev) => {
      const cur = prev[carId] || 0;
      const next = (cur + delta + total) % total;
      return { ...prev, [carId]: next };
    });
  };

  const handleReserveCar = (car: ShowroomCar) => {
    onAddToBag({
      id: car.id,
      kind: 'vehicle',
      title: `${car.brand} ${car.model}`,
      subtitle: `${car.year} · ${car.grade}`,
      priceUsd: car.priceUsd,
      grade: car.grade,
      image: car.images[0],
      quantity: 1,
    });
  };

  const handleJoinWaitlist = (car: ShowroomCar) => {
    setWaitlistedIds((prev) => ({ ...prev, [car.id]: true }));
    onNotify(`Priority Waitlist reserved for ${car.brand} ${car.model}`);
  };

  const handleSubmitSellCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellBrand.trim() || !sellModel.trim()) return;

    const numericPrice = Math.max(5000, Number(sellPrice.replace(/[^0-9]/g, '')) || 120000);
    const newCar: ShowroomCar = {
      id: `sr-user-${Date.now()}`,
      brand: sellBrand.trim(),
      model: sellModel.trim(),
      year: Number(sellYear) || 2024,
      priceUsd: numericPrice,
      grade: sellGrade,
      status: sellStatus,
      listingMode: 'consignment',
      mileageKm: sellMileage.trim() || '1,500 km',
      exteriorColor: 'Client Submitted Spec',
      interiorTrim: 'Factory Leather & Carbon',
      engine: sellEngine.trim() || 'Twin-Turbo Powertrain',
      horsepower: sellHp.trim() || '580 HP',
      transmission: 'Automatic DCT',
      location: 'Seller Submission · Escrowed Consignment',
      images: [
        sellPhotoUrl,
        '/src/assets/images/imperion_atelier_showroom_1795257319293.jpg',
        '/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg',
      ],
      highlights: [
        `Submitted directly via Imperion Consignment Desk (${sellGrade})`,
        `Verified mileage readout: ${sellMileage.trim() || '1,500 km'}`,
        'Multi-point chassis & paintwork inspection ready',
      ],
      summary:
        sellSummary.trim() ||
        `${sellYear} ${sellBrand.trim()} ${sellModel.trim()} listed for direct sale / consignment in the FARHAN PALACE Showroom.`,
    };

    onAddCarListing(newCar);
    setSellBrand('');
    setSellModel('');
    setSellSummary('');
    setMode('buy');
    setStatusFilter('all');
    onNotify(`Listed ${newCar.brand} ${newCar.model} in Showroom`);
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20 bg-[#ffffff] text-[#11100e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP SHOWROOM HEADER & BUY/SELL WINDOW SWITCHER */}
        <ScrollReveal direction="left" className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#e5e2da] pb-6">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#9b7218]">
                Imperion Autos · Vehicle Vault
              </span>
              <span className="signature-ink-gold text-2xl select-none">
                Buy · Sell · Consign
              </span>
            </div>
            <AnimatedSplitText
              text="The Showroom"
              as="h1"
              mode="mount"
              className="font-display text-3xl sm:text-5xl font-extrabold text-[#11100e] tracking-tight mt-2"
            />
            <p className="text-xs sm:text-sm text-[#5b564c] mt-2 max-w-2xl leading-relaxed">
              Browse inspected supercars &amp; executive coupes with multi-angle studio galleries, auction inspection grades, and live stock tracking — or list your vehicle for consignment.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f4f2ec] p-1.5 rounded-xl border border-[#e5e2da] self-start lg:self-end shrink-0">
            <button
              type="button"
              onClick={() => setMode('buy')}
              className={`px-4 py-2.5 min-h-[40px] rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                mode === 'buy'
                  ? 'bg-[#11100e] text-white'
                  : 'text-[#5b564c] hover:text-[#11100e]'
              }`}
            >
              Buy Vehicles ({cars.length})
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
              <span>Sell Your Car</span>
            </button>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {mode === 'buy' ? (
            <motion.div
              key="showroom-buy-window"
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* SEARCH + STATUS FILTER + GRADE FILTER BAR */}
              <div className="white-panel rounded-2xl p-4 sm:p-5 space-y-4 bg-[#faf9f6]">
                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#7d7668] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search make, model, grade, engine..."
                      aria-label="Search showroom vehicles"
                      className="w-full min-h-[44px] rounded-xl bg-white border border-[#dedad0] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#11100e] placeholder:text-[#8c8577] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#5b564c] mr-1 shrink-0">
                      Grade:
                    </span>
                    {(
                      [
                        { id: 'all', label: 'All' },
                        { id: 'S', label: 'Grade S' },
                        { id: '5A', label: 'Grade 5A' },
                        { id: '4.5', label: 'Grade 4.5+' },
                      ] as const
                    ).map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGradeFilter(g.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono-tech whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                          gradeFilter === g.id
                            ? 'bg-[#11100e] text-white border-[#11100e] font-bold'
                            : 'bg-white text-[#5b564c] border-[#dedad0] hover:text-[#11100e]'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Status Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e5e2da]">
                  {(
                    [
                      { id: 'all', label: `All Inventory (${counts.all})` },
                      { id: 'available', label: `Available (${counts.available})` },
                      { id: 'upcoming', label: `Upcoming (${counts.upcoming})` },
                      { id: 'stock_out', label: `Stock Out (${counts.stock_out})` },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setStatusFilter(st.id)}
                      className={`px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                        statusFilter === st.id
                          ? 'bg-[#b5892a] text-white border-[#b5892a]'
                          : 'bg-white text-[#36332c] border-[#dedad0] hover:border-[#b5892a]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* VEHICLE GRID */}
              {filteredCars.length === 0 ? (
                <div className="white-panel rounded-3xl p-10 text-center space-y-3">
                  <p className="font-display text-xl font-bold text-[#11100e]">
                    No matching vehicles found
                  </p>
                  <p className="text-xs sm:text-sm text-[#5b564c]">
                    Clear your search filters or submit a bespoke sourcing request through our concierge desk.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setGradeFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#11100e] text-white text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car, index) => {
                    const activeImgIndex = cardImageIdx[car.id] || 0;
                    const activeImg = car.images[activeImgIndex] || car.images[0];
                    const isWaitlisted = !!waitlistedIds[car.id];
                    const cardDirs = ['curtain', 'zoom', 'tilt-rise'] as const;

                    return (
                      <ScrollReveal
                        key={car.id}
                        direction={cardDirs[index % cardDirs.length]}
                        delay={(index % 3) * 0.06}
                      >
                        <article className="white-panel rounded-3xl overflow-hidden flex flex-col justify-between h-full">
                          <div>
                            {/* Multi-Image Card Header */}
                            <div className="relative aspect-[16/10] bg-[#f1efe9] group overflow-hidden">
                              <img
                                src={activeImg}
                                alt={`${car.brand} ${car.model}`}
                                loading={index < 3 ? 'eager' : 'lazy'}
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onClick={() => {
                                  setSelectedCar(car);
                                  setModalImageIdx(activeImgIndex);
                                }}
                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer ${
                                  car.status === 'stock_out' ? 'opacity-70 grayscale-[25%]' : ''
                                }`}
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />

                              {car.images.length > 1 && (
                                <>
                                  <button
                                    type="button"
                                    aria-label="Previous car angle"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cycleCardImage(car.id, car.images.length, -1);
                                    }}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white hover:border-[#e5c158] flex items-center justify-center cursor-pointer transition-colors"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Next car angle"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cycleCardImage(car.id, car.images.length, 1);
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
                                    car.status === 'available'
                                      ? 'bg-[#e5c158] text-[#11100e] font-bold'
                                      : car.status === 'upcoming'
                                        ? 'bg-white text-[#11100e] font-bold'
                                        : 'bg-[#11100e]/85 text-white/80'
                                  }`}
                                >
                                  {STATUS_LABELS[car.status]}
                                </span>

                                <span className="text-[11px] font-mono-tech text-white bg-black/65 px-2 py-0.5 rounded">
                                  {activeImgIndex + 1}/{car.images.length} Photos
                                </span>
                              </div>
                            </div>

                            {/* Unboxed Metadata & Typography Hierarchy */}
                            <div className="p-5 sm:p-6 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech">
                                <span className="text-[#9b7218] uppercase tracking-wider font-semibold">
                                  {car.grade}
                                </span>
                                <span className="text-[#5b564c]">
                                  {car.year} · {car.mileageKm}
                                </span>
                              </div>

                              <div>
                                <div className="text-xs uppercase tracking-[0.15em] text-[#5b564c] font-semibold">
                                  {car.brand}
                                  {car.listingMode === 'consignment' ? ' · Client Consignment' : ''}
                                </div>
                                <h2 className="font-display text-xl font-extrabold text-[#11100e] mt-0.5 leading-snug">
                                  {car.model}
                                </h2>
                              </div>

                              <div className="flex items-baseline justify-between pt-2 border-t border-[#e5e2da]">
                                <span className="font-mono-tech text-xl font-bold text-[#9b7218] tabular-nums">
                                  {formatUsd(car.priceUsd)}
                                </span>
                                <span className="text-xs font-mono-tech text-[#36332c]">
                                  {car.horsepower}
                                </span>
                              </div>

                              <p className="text-xs text-[#5b564c] leading-relaxed line-clamp-2">
                                {car.summary}
                              </p>
                            </div>
                          </div>

                          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCar(car);
                                setModalImageIdx(activeImgIndex);
                              }}
                              className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#d6d1c6] bg-white hover:border-[#11100e] text-xs font-display font-bold uppercase tracking-wider text-[#11100e] transition-colors cursor-pointer"
                            >
                              Details
                            </button>

                            {car.status === 'available' && (
                              <button
                                type="button"
                                onClick={() => handleReserveCar(car)}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Acquire</span>
                              </button>
                            )}

                            {car.status === 'upcoming' && (
                              <button
                                type="button"
                                onClick={() => handleJoinWaitlist(car)}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#b5892a] bg-[#fdf8ed] hover:bg-[#11100e] text-[#8f6714] hover:text-white text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>{isWaitlisted ? 'Waitlisted' : 'Waitlist'}</span>
                              </button>
                            )}

                            {car.status === 'stock_out' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectContactTrack('showroom');
                                  onNavigate('contact');
                                }}
                                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[#d6d1c6] text-[#5b564c] hover:border-[#11100e] hover:text-[#11100e] text-xs font-display font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <span>Source Similar</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
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
            /* SELL YOUR CAR WINDOW */
            <motion.div
              key="showroom-sell-window"
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5 white-panel rounded-3xl p-6 sm:p-8 space-y-5 bg-[#faf9f6]">
                <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#9b7218]">
                  Direct Consignment Desk
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#11100e]">
                  List Your Car in Imperion Showroom
                </h2>
                <p className="text-xs sm:text-sm text-[#5b564c] leading-relaxed">
                  Submit your vehicle specifications, asking price, auction/condition grade, and availability. Submitted listings publish immediately into the live Showroom catalog during your session.
                </p>
                <ul className="space-y-2.5 pt-2 border-t border-[#e5e2da] text-xs text-[#36332c]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9b7218] shrink-0 mt-0.5" />
                    <span>Transparent Grade S / 5A / 4.5+ inspection presentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9b7218] shrink-0 mt-0.5" />
                    <span>Multi-angle studio framing with buyer escrow inquiry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#9b7218] shrink-0 mt-0.5" />
                    <span>Instant toggle between Available, Upcoming, or Stock Out</span>
                  </li>
                </ul>
              </div>

              <form
                onSubmit={handleSubmitSellCar}
                className="lg:col-span-7 white-panel rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Manufacturer / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellBrand}
                      onChange={(e) => setSellBrand(e.target.value)}
                      placeholder="e.g., Ferrari, Porsche, BMW M"
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Model &amp; Trim *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellModel}
                      onChange={(e) => setSellModel(e.target.value)}
                      placeholder="e.g., 296 GTB Assetto Fiorano"
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Model Year
                    </label>
                    <input
                      type="number"
                      min="1980"
                      max="2027"
                      value={sellYear}
                      onChange={(e) => setSellYear(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] font-mono-tech focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Asking Price (USD)
                    </label>
                    <input
                      type="text"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      placeholder="145000"
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] font-mono-tech focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Inspection Grade
                    </label>
                    <select
                      value={sellGrade}
                      onChange={(e) => setSellGrade(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    >
                      <option value="Grade S · 10/10">Grade S · 10/10</option>
                      <option value="Grade 5A · Mint">Grade 5A · Mint</option>
                      <option value="Grade 4.5A · Certified">Grade 4.5A · Certified</option>
                      <option value="Grade 4B · Clean">Grade 4B · Clean</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Mileage
                    </label>
                    <input
                      type="text"
                      value={sellMileage}
                      onChange={(e) => setSellMileage(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Engine
                    </label>
                    <input
                      type="text"
                      value={sellEngine}
                      onChange={(e) => setSellEngine(e.target.value)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Horsepower
                    </label>
                    <input
                      type="text"
                      value={sellHp}
                      onChange={(e) => setSellHp(e.target.value)}
                      placeholder="e.g., 600 HP"
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-1.5">
                      Listing Status
                    </label>
                    <select
                      value={sellStatus}
                      onChange={(e) => setSellStatus(e.target.value as ListingStatus)}
                      className="w-full min-h-[44px] rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218]"
                    >
                      <option value="available">Available</option>
                      <option value="upcoming">Upcoming Arrival</option>
                      <option value="stock_out">Stock Out</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5b564c] mb-2">
                    Select Studio Cover Plate
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setSellPhotoUrl(preset.url)}
                        className={`rounded-xl overflow-hidden border-2 aspect-[16/10] cursor-pointer transition-all ${
                          sellPhotoUrl === preset.url
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
                    Condition &amp; History Notes
                  </label>
                  <textarea
                    rows={3}
                    value={sellSummary}
                    onChange={(e) => setSellSummary(e.target.value)}
                    placeholder="Optional service history, factory options, PPF status..."
                    className="w-full rounded-xl bg-[#faf9f6] border border-[#dedad0] px-3.5 py-2.5 text-sm text-[#11100e] focus:outline-none focus:border-[#9b7218] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] py-3 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer"
                >
                  Publish Car to Showroom Inventory
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
              'Grade S Inspected',
              'Multi-Angle Vault',
              'Available · Upcoming · Stock Out',
              'Imperion Showroom',
            ]}
            bottomItems={[
              'Escrowed Consignment',
              'Verified Mileage',
              'Port Inspection Ready',
              'Farhan Palace',
            ]}
          />
        </div>
      </div>

      {/* VEHICLE DETAIL & MULTI-IMAGE GALLERY MODAL (WHITE WINDOW WITH SMOOTH ANIMATION) */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedCar(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl w-full rounded-3xl bg-white text-[#11100e] border border-[#e5e2da] overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-[#11100e]">
                <img
                  src={selectedCar.images[modalImageIdx] || selectedCar.images[0]}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" />
                <button
                  type="button"
                  aria-label="Close vehicle details"
                  onClick={() => setSelectedCar(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-black/75 border border-white/25 text-white hover:border-[#e5c158] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#e5c158]">
                      {selectedCar.brand} · {selectedCar.year} · {selectedCar.grade}
                    </span>
                    <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-0.5">
                      {selectedCar.model}
                    </h3>
                  </div>
                  <div className="font-mono-tech text-2xl sm:text-3xl font-bold text-[#e5c158] tabular-nums">
                    {formatUsd(selectedCar.priceUsd)}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {selectedCar.images.map((src, idx) => (
                    <button
                      key={src + idx}
                      type="button"
                      onClick={() => setModalImageIdx(idx)}
                      className={`w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        modalImageIdx === idx
                          ? 'border-[#9b7218]'
                          : 'border-[#e5e2da] opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${selectedCar.model} angle ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#faf9f6] border border-[#e5e2da] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono-tech uppercase tracking-wider text-[#5b564c]">
                      Availability:{' '}
                      <span className="text-[#9b7218] font-bold">
                        {STATUS_LABELS[selectedCar.status]}
                      </span>
                    </div>
                    <div className="text-xs text-[#36332c] mt-1">{selectedCar.location}</div>
                  </div>

                  <div className="shrink-0">
                    {selectedCar.status === 'available' && (
                      <button
                        type="button"
                        onClick={() => {
                          handleReserveCar(selectedCar);
                          setSelectedCar(null);
                        }}
                        className="px-5 py-3 rounded-xl bg-[#11100e] hover:bg-[#9b7218] text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Acquisition Bag</span>
                      </button>
                    )}
                    {selectedCar.status === 'upcoming' && (
                      <button
                        type="button"
                        onClick={() => handleJoinWaitlist(selectedCar)}
                        className="px-5 py-3 rounded-xl border border-[#b5892a] bg-[#fdf8ed] text-[#8f6714] hover:bg-[#11100e] hover:text-white font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>
                          {waitlistedIds[selectedCar.id]
                            ? 'Reserved on Priority Waitlist'
                            : 'Reserve Upcoming Allocation'}
                        </span>
                      </button>
                    )}
                    {selectedCar.status === 'stock_out' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCar(null);
                          onSelectContactTrack('showroom');
                          onNavigate('contact');
                        }}
                        className="px-5 py-3 rounded-xl border border-[#d6d1c6] text-[#36332c] hover:border-[#11100e] hover:text-[#11100e] font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                        <span>Stock Out · Request Similar Build</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#36332c] leading-relaxed">
                  {selectedCar.summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-[#e5e2da]">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c]">Engine</span>
                    <p className="text-sm font-semibold text-[#11100e] mt-0.5">{selectedCar.engine}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c]">Output</span>
                    <p className="text-sm font-semibold text-[#9b7218] mt-0.5">
                      {selectedCar.horsepower}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c]">
                      Transmission
                    </span>
                    <p className="text-sm font-semibold text-[#11100e] mt-0.5">
                      {selectedCar.transmission}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c]">Mileage</span>
                    <p className="text-sm font-semibold text-[#11100e] mt-0.5">{selectedCar.mileageKm}</p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c]">
                      Exterior Finish
                    </span>
                    <p className="text-sm font-semibold text-[#11100e] mt-0.5">
                      {selectedCar.exteriorColor}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#5b564c]">
                      Interior Trim
                    </span>
                    <p className="text-sm font-semibold text-[#11100e] mt-0.5">
                      {selectedCar.interiorTrim}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[#5b564c] font-semibold mb-3">
                    Inspection &amp; Factory Equipment Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedCar.highlights.map((hl) => (
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
