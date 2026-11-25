import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  CarFront,
  Wrench,
  User,
  Mail,
  Briefcase,
  Gem,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import type { ShowroomCar, GarageProduct } from './data/vehicles';
import { DEFAULT_SITE_CMS } from './data/defaultCms';
import type { ExclusiveVaultItem, SiteCmsConfig } from './types/cms';
import type { AppPage, BagLineItem } from './types/navigation';
import { TopNav } from './components/TopNav';
import { HeroThreeStage } from './components/HeroThreeStage';
import { SiteFooter } from './components/SiteFooter';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  AnimatedSplitText,
  ScrollPassOutBand,
  ScrollProgressBar,
  ScrollReveal,
  ShootingStarsCanvas,
  WindowTransition,
} from './components/MotionEffects';

import { EngineeringLab } from './components/EngineeringLab';
import { ClickedGallery } from './components/ClickedGallery';
import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { ExclusivePage } from './components/ExclusivePage';
import { ShowroomPage } from './components/ShowroomPage';
import { GaragePage } from './components/GaragePage';
import { ContactPage } from './components/ContactAndFooter';
import { AcquisitionBagDrawer } from './components/AcquisitionBagDrawer';

const loadAdminPortal = () => import('./components/AdminPortal');
const AdminPortal = lazy(() =>
  loadAdminPortal().then((m) => ({ default: m.AdminPortal }))
);

type ContactTrack = 'imperion' | 'showroom' | 'clexora' | 'cinema';

const VALID_PAGES: AppPage[] = [
  'home',
  'about',
  'services',
  'showroom',
  'exclusive',
  'garage',
  'contact',
  'admin-login',
];

function resolvePageFromUrl(): AppPage {
  const hashClean = window.location.hash.replace(/^#\/?/, '').toLowerCase() as AppPage;
  if (hashClean && VALID_PAGES.includes(hashClean)) {
    return hashClean;
  }
  const pathClean = window.location.pathname
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase() as AppPage;
  if (pathClean && VALID_PAGES.includes(pathClean)) {
    return pathClean;
  }
  return 'home';
}

function mergeCmsWithDefaults(raw: Partial<SiteCmsConfig> | null | undefined): SiteCmsConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_SITE_CMS;
  return {
    brand: {
      ...DEFAULT_SITE_CMS.brand,
      ...(raw.brand || {}),
      navLabels: {
        ...DEFAULT_SITE_CMS.brand.navLabels,
        ...(raw.brand?.navLabels || {}),
      },
    },
    hero: {
      ...DEFAULT_SITE_CMS.hero,
      ...(raw.hero || {}),
      videoUrl: raw.hero?.videoUrl?.trim() || DEFAULT_SITE_CMS.hero.videoUrl,
      posterUrl: raw.hero?.posterUrl?.trim() || DEFAULT_SITE_CMS.hero.posterUrl,
    },
    homeSections: {
      ...DEFAULT_SITE_CMS.homeSections,
      ...(raw.homeSections || {}),
    },
    about: {
      ...DEFAULT_SITE_CMS.about,
      ...(raw.about || {}),
      portraits:
        Array.isArray(raw.about?.portraits) && raw.about.portraits.length > 0
          ? raw.about.portraits
          : DEFAULT_SITE_CMS.about.portraits,
      clexoraPillars:
        Array.isArray(raw.about?.clexoraPillars) && raw.about.clexoraPillars.length > 0
          ? raw.about.clexoraPillars
          : DEFAULT_SITE_CMS.about.clexoraPillars,
      milestones:
        Array.isArray(raw.about?.milestones) && raw.about.milestones.length > 0
          ? raw.about.milestones
          : DEFAULT_SITE_CMS.about.milestones,
    },
    servicesPage: {
      ...DEFAULT_SITE_CMS.servicesPage,
      ...(raw.servicesPage || {}),
      items: Array.isArray(raw.servicesPage?.items)
        ? raw.servicesPage.items
        : DEFAULT_SITE_CMS.servicesPage.items,
    },
    exclusivePage: {
      ...DEFAULT_SITE_CMS.exclusivePage,
      ...(raw.exclusivePage || {}),
      items: Array.isArray(raw.exclusivePage?.items)
        ? raw.exclusivePage.items
        : DEFAULT_SITE_CMS.exclusivePage.items,
    },
    contactPage: {
      ...DEFAULT_SITE_CMS.contactPage,
      ...(raw.contactPage || {}),
      tracks: {
        ...DEFAULT_SITE_CMS.contactPage.tracks,
        ...(raw.contactPage?.tracks || {}),
      },
    },
    curatedVehicles:
      Array.isArray(raw.curatedVehicles) && raw.curatedVehicles.length > 0
        ? raw.curatedVehicles
        : DEFAULT_SITE_CMS.curatedVehicles,
    showroomCars: Array.isArray(raw.showroomCars)
      ? raw.showroomCars
      : DEFAULT_SITE_CMS.showroomCars,
    garageItems: Array.isArray(raw.garageItems)
      ? raw.garageItems
      : DEFAULT_SITE_CMS.garageItems,
    galleryPhotos:
      Array.isArray(raw.galleryPhotos) && raw.galleryPhotos.length > 0
        ? raw.galleryPhotos
        : DEFAULT_SITE_CMS.galleryPhotos,
    researchDiscoveries:
      Array.isArray(raw.researchDiscoveries) && raw.researchDiscoveries.length > 0
        ? raw.researchDiscoveries
        : DEFAULT_SITE_CMS.researchDiscoveries,
  };
}

function prefetchPageChunk(page: AppPage): void {
  if (page === 'admin-login') {
    void loadAdminPortal();
  }
}

function PageWindowSkeleton({ isWhitePage }: { isWhitePage: boolean }) {
  return (
    <div
      className={`pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 ${
        isWhitePage ? 'text-[#11100e]' : 'text-[#f4f1ea]'
      }`}
    >
      <div
        className={`h-8 w-44 rounded-lg animate-pulse ${
          isWhitePage ? 'bg-[#edeae2]' : 'bg-white/10'
        }`}
      />
      <div
        className={`h-12 w-72 sm:w-96 rounded-xl animate-pulse ${
          isWhitePage ? 'bg-[#edeae2]' : 'bg-white/10'
        }`}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-64 rounded-3xl animate-pulse ${
              isWhitePage ? 'bg-[#f4f2ec]' : 'bg-white/[0.06]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => resolvePageFromUrl());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [cmsConfig, setCmsConfig] = useState<SiteCmsConfig>(DEFAULT_SITE_CMS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Admin auth held strictly in React state memory
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const [bagItems, setBagItems] = useState<BagLineItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<ContactTrack>('imperion');

  const isWhitePage = currentPage !== 'home' && currentPage !== 'admin-login';

  const handleNotify = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleNavigate = useCallback((page: AppPage) => {
    prefetchPageChunk(page);
    setCurrentPage(page);
    const nextPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // Load saved CMS configuration from Express server on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/cms')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { siteContent?: Partial<SiteCmsConfig> | null } | null) => {
        if (!cancelled && data?.siteContent) {
          setCmsConfig(mergeCmsWithDefaults(data.siteContent));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onUrlChange = () => {
      setCurrentPage(resolvePageFromUrl());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onUrlChange);
    window.addEventListener('hashchange', onUrlChange);
    return () => {
      window.removeEventListener('popstate', onUrlChange);
      window.removeEventListener('hashchange', onUrlChange);
    };
  }, []);

  const handleChangeCms = useCallback((next: SiteCmsConfig) => {
    setCmsConfig(next);
    setHasUnsavedChanges(true);
  }, []);

  const handleSaveCmsToServer = useCallback(
    async (next: SiteCmsConfig): Promise<boolean> => {
      if (!adminToken) {
        handleNotify('Sign in to save changes');
        return false;
      }
      try {
        const res = await fetch('/api/cms', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ siteContent: next }),
        });
        const data = (await res.json()) as { error?: string; siteContent?: Partial<SiteCmsConfig> };
        if (!res.ok) {
          if (res.status === 401) {
            setAdminToken(null);
            setAdminEmail(null);
          }
          handleNotify(data.error || 'Failed to save changes');
          return false;
        }
        if (data.siteContent) {
          setCmsConfig(mergeCmsWithDefaults(data.siteContent));
        }
        setHasUnsavedChanges(false);
        handleNotify('All website updates saved to server');
        return true;
      } catch {
        handleNotify('Network error saving CMS updates');
        return false;
      }
    },
    [adminToken, handleNotify]
  );

  const handleResetCmsOnServer = useCallback(async (): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch('/api/cms/reset', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!res.ok) {
        handleNotify('Failed to reset website defaults');
        return false;
      }
      setCmsConfig(DEFAULT_SITE_CMS);
      setHasUnsavedChanges(false);
      handleNotify('Website content restored to defaults');
      return true;
    } catch {
      handleNotify('Network error resetting defaults');
      return false;
    }
  }, [adminToken, handleNotify]);

  const handleAddToBag = useCallback(
    (incoming: BagLineItem) => {
      setBagItems((prev) => {
        const existing = prev.find((i) => i.id === incoming.id);
        if (existing) {
          if (incoming.kind === 'vehicle' || incoming.kind === 'exclusive') {
            return prev;
          }
          return prev.map((i) =>
            i.id === incoming.id ? { ...i, quantity: i.quantity + incoming.quantity } : i
          );
        }
        return [incoming, ...prev];
      });
      setBagOpen(true);
      handleNotify(`Added to Bag: ${incoming.title}`);
    },
    [handleNotify]
  );

  const handleUpdateQty = useCallback((id: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveBagItem = useCallback((id: string) => {
    setBagItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearBag = useCallback(() => {
    setBagItems([]);
  }, []);

  const handleSelectContactTrack = useCallback(
    (track: ContactTrack) => {
      setSelectedTrack(track);
      handleNavigate('contact');
    },
    [handleNavigate]
  );

  const bagCount = bagItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${
          isWhitePage ? 'bg-[#ffffff] text-[#11100e]' : 'bg-[#080706] text-[#f4f1ea]'
        }`}
      >
        <ScrollProgressBar isWhitePage={isWhitePage} />

        <TopNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onPrefetchPage={prefetchPageChunk}
          bagCount={bagCount}
          onOpenBag={() => setBagOpen(true)}
          siteName={cmsConfig.brand.siteName}
          navLabels={cmsConfig.brand.navLabels}
        />

        <main className="flex-1">
          <ErrorBoundary
            isWhitePage={isWhitePage}
            onResetToHome={() => handleNavigate('home')}
          >
            <AnimatePresence initial={false}>
              {currentPage === 'home' && (
                <WindowTransition windowKey="home">
                  <HeroThreeStage
                    onNotify={handleNotify}
                    onNavigate={handleNavigate}
                    heroCms={cmsConfig.hero}
                    vehicles={cmsConfig.curatedVehicles}
                  />

                  {/* RESPONSIVE QUICK PAGE PORTALS STRIP */}
                  <section
                    aria-label="Explore Destinations"
                    className="relative overflow-hidden border-t border-white/[0.08] bg-[#0a0907] py-14 sm:py-18"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-45">
                      <ShootingStarsCanvas density="rich" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
                        <ScrollReveal direction="left">
                          <span className="text-xs font-mono-tech uppercase tracking-[0.22em] text-[#e5c158]">
                            {cmsConfig.homeSections.destinationsEyebrow}
                          </span>
                          <AnimatedSplitText
                            text={cmsConfig.homeSections.destinationsTitle}
                            as="h2"
                            mode="view"
                            className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-1 text-balance"
                          />
                        </ScrollReveal>
                        <ScrollReveal direction="right">
                          <p className="text-xs sm:text-sm text-[#a59b84] max-w-md leading-relaxed">
                            {cmsConfig.homeSections.destinationsSubtitle}
                          </p>
                        </ScrollReveal>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            page: 'about' as AppPage,
                            icon: User,
                            dir: 'left' as const,
                            tag: '01 · Founder Profile',
                            title: cmsConfig.brand.navLabels.about,
                            desc: 'Who I am, what I lead with Imperion Autos & Clexora, and delivered builds.',
                          },
                          {
                            page: 'services' as AppPage,
                            icon: Briefcase,
                            dir: 'zoom' as const,
                            tag: `02 · ${cmsConfig.servicesPage.items.length} Services`,
                            title: cmsConfig.brand.navLabels.services,
                            desc: '4K cinematography, Clexora remote office execution, car trading & rare sourcing.',
                          },
                          {
                            page: 'showroom' as AppPage,
                            icon: CarFront,
                            dir: 'right' as const,
                            tag: `03 · ${cmsConfig.showroomCars.length} Vehicles`,
                            title: cmsConfig.brand.navLabels.showroom,
                            desc: 'Buy or consign graded supercars across Available, Upcoming & Stock Out fleets.',
                          },
                          {
                            page: 'exclusive' as AppPage,
                            icon: Gem,
                            dir: 'curtain' as const,
                            tag: `04 · ${cmsConfig.exclusivePage.items.length} Vault Pieces`,
                            title: cmsConfig.brand.navLabels.exclusive,
                            desc: 'Numbered collector timepieces, Weissach aero kits & limited build allocations.',
                          },
                          {
                            page: 'garage' as AppPage,
                            icon: Wrench,
                            dir: 'tilt-rise' as const,
                            tag: `05 · ${cmsConfig.garageItems.length} Hardware Items`,
                            title: cmsConfig.brand.navLabels.garage,
                            desc: 'Forged magnesium wheels, dry-carbon aero, titanium exhausts & cinema rigs.',
                          },
                          {
                            page: 'contact' as AppPage,
                            icon: Mail,
                            dir: 'up' as const,
                            tag: '06 · Executive Desk',
                            title: cmsConfig.brand.navLabels.contact,
                            desc: 'Direct phone, official email & structured briefs for immediate coordination.',
                          },
                        ].map((dest, idx) => {
                          const Icon = dest.icon;
                          return (
                            <ScrollReveal
                              key={dest.page}
                              direction={dest.dir}
                              delay={idx * 0.03}
                            >
                              <button
                                type="button"
                                onClick={() => handleNavigate(dest.page)}
                                onMouseEnter={() => prefetchPageChunk(dest.page)}
                                className="group text-left w-full h-full p-5 sm:p-6 rounded-2xl obsidian-panel hover:-translate-y-1 flex flex-col justify-between gap-4 cursor-pointer"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-mono-tech uppercase tracking-wider text-[#e5c158]">
                                      {dest.tag}
                                    </span>
                                    <Icon className="w-4 h-4 text-[#a59b84] group-hover:text-[#e5c158] transition-colors shrink-0" />
                                  </div>
                                  <h3 className="font-display text-xl font-extrabold text-white group-hover:text-[#e5c158] transition-colors">
                                    {dest.title}
                                  </h3>
                                  <p className="text-xs text-[#a59b84] leading-relaxed">
                                    {dest.desc}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-white group-hover:text-[#e5c158]">
                                  <span>Open Window</span>
                                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                              </button>
                            </ScrollReveal>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  {/* Bidirectional Side-Out / Passing-Out Scroll Animation Strip */}
                  <ScrollPassOutBand
                    topItems={[
                      'Imperion Autos',
                      'Clexora Execution',
                      '4K Cinematography',
                      'Exclusive Vault',
                      'Farhan Palace',
                    ]}
                    bottomItems={[
                      'Grade S Inspection',
                      'Dry Carbon Aero',
                      'Titanium Acoustics',
                      'Worldwide Sourcing',
                      'Dhaka Atelier',
                    ]}
                  />

                  <EngineeringLab
                    onNotify={handleNotify}
                    labCopy={{
                      eyebrow: cmsConfig.homeSections.labEyebrow,
                      signature: cmsConfig.homeSections.labSignature,
                      title: cmsConfig.homeSections.labTitle,
                      subtitle: cmsConfig.homeSections.labSubtitle,
                    }}
                    researchItems={cmsConfig.researchDiscoveries}
                  />
                  <ScrollPassOutBand
                    topItems={[
                      'Clicked by Farhan Tanvir Shuvo',
                      'GR Supra A90',
                      'Bagged Civic X',
                      'Mercedes-Benz E-Class',
                      'Lens Archive',
                    ]}
                    bottomItems={[
                      'Sunset Paddock Studies',
                      'Raw Telephoto Frames',
                      'Dhaka Automotive Culture',
                      'Unfiltered Stills',
                    ]}
                  />
                  <ClickedGallery
                    onNotify={handleNotify}
                    galleryCopy={{
                      eyebrow: cmsConfig.homeSections.galleryEyebrow,
                      signature: cmsConfig.homeSections.gallerySignature,
                      title: cmsConfig.homeSections.galleryTitle,
                      subtitle: cmsConfig.homeSections.gallerySubtitle,
                    }}
                    photos={cmsConfig.galleryPhotos}
                  />
                </WindowTransition>
              )}

              {currentPage === 'about' && (
                <WindowTransition windowKey="about">
                  <AboutPage
                    aboutCms={cmsConfig.about}
                    onNavigate={handleNavigate}
                    onSelectContactTrack={handleSelectContactTrack}
                  />
                </WindowTransition>
              )}

              {currentPage === 'services' && (
                <WindowTransition windowKey="services">
                  <ServicesPage
                    cms={cmsConfig.servicesPage}
                    onNavigate={handleNavigate}
                    onSelectContactTrack={handleSelectContactTrack}
                  />
                </WindowTransition>
              )}

              {currentPage === 'exclusive' && (
                <WindowTransition windowKey="exclusive">
                  <ExclusivePage
                    cms={cmsConfig.exclusivePage}
                    onAddExclusiveItem={(newItem: ExclusiveVaultItem) =>
                      handleChangeCms({
                        ...cmsConfig,
                        exclusivePage: {
                          ...cmsConfig.exclusivePage,
                          items: [newItem, ...cmsConfig.exclusivePage.items],
                        },
                      })
                    }
                    onAddToBag={handleAddToBag}
                    onNavigate={handleNavigate}
                    onSelectContactTrack={handleSelectContactTrack}
                    onNotify={handleNotify}
                  />
                </WindowTransition>
              )}

              {currentPage === 'showroom' && (
                <WindowTransition windowKey="showroom">
                  <ShowroomPage
                    cars={cmsConfig.showroomCars}
                    onAddCarListing={(newCar: ShowroomCar) =>
                      handleChangeCms({
                        ...cmsConfig,
                        showroomCars: [newCar, ...cmsConfig.showroomCars],
                      })
                    }
                    onAddToBag={handleAddToBag}
                    onNavigate={handleNavigate}
                    onSelectContactTrack={handleSelectContactTrack}
                    onNotify={handleNotify}
                  />
                </WindowTransition>
              )}

              {currentPage === 'garage' && (
                <WindowTransition windowKey="garage">
                  <GaragePage
                    items={cmsConfig.garageItems}
                    onAddGarageItem={(newItem: GarageProduct) =>
                      handleChangeCms({
                        ...cmsConfig,
                        garageItems: [newItem, ...cmsConfig.garageItems],
                      })
                    }
                    onAddToBag={handleAddToBag}
                    onNotify={handleNotify}
                  />
                </WindowTransition>
              )}

              {currentPage === 'contact' && (
                <WindowTransition windowKey="contact">
                  <ContactPage
                    selectedTrack={selectedTrack}
                    onChangeTrack={setSelectedTrack}
                    onNavigate={handleNavigate}
                    onNotify={handleNotify}
                    contactCms={cmsConfig.contactPage}
                    brandCms={cmsConfig.brand}
                  />
                </WindowTransition>
              )}

              {currentPage === 'admin-login' && (
                <WindowTransition windowKey="admin-login">
                  <Suspense fallback={<PageWindowSkeleton isWhitePage={false} />}>
                    <AdminPortal
                      cms={cmsConfig}
                      hasUnsavedChanges={hasUnsavedChanges}
                      onChangeCms={handleChangeCms}
                      onSaveCmsToServer={handleSaveCmsToServer}
                      onResetCmsOnServer={handleResetCmsOnServer}
                      adminToken={adminToken}
                      adminEmail={adminEmail}
                      onAuthSuccess={(token, email) => {
                        setAdminToken(token);
                        setAdminEmail(email);
                      }}
                      onLogout={() => {
                        setAdminToken(null);
                        setAdminEmail(null);
                        handleNotify('Signed out of Admin Studio');
                      }}
                      onNavigate={handleNavigate}
                      onNotify={handleNotify}
                    />
                  </Suspense>
                </WindowTransition>
              )}
            </AnimatePresence>
          </ErrorBoundary>
        </main>

        <SiteFooter
          onNavigate={handleNavigate}
          isWhitePage={isWhitePage}
          brandCms={cmsConfig.brand}
        />

        {bagOpen && (
          <AcquisitionBagDrawer
            open={bagOpen}
            isWhitePage={isWhitePage}
            items={bagItems}
            onClose={() => setBagOpen(false)}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveBagItem}
            onClearBag={handleClearBag}
            onNotify={handleNotify}
            paymentTermsNotice={cmsConfig.brand.paymentTermsNotice}
          />
        )}

        {/* Quick Floating Glass Return Pill When Authenticated & Previewing Live Site */}
        {adminToken && currentPage !== 'admin-login' && (
          <button
            type="button"
            onClick={() => handleNavigate('admin-login')}
            className="fixed bottom-5 left-5 z-[125] px-4 py-2.5 rounded-xl bg-[#0e0c0a]/85 backdrop-blur-xl border border-[#e5c158]/45 text-[#e5c158] hover:bg-[#e5c158] hover:text-[#080706] font-display text-xs font-bold uppercase tracking-wider shadow-2xl inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Admin Studio</span>
          </button>
        )}

        {/* Non-intrusive bottom-right status toast */}
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-[130] px-4 py-2.5 rounded-xl border text-xs font-medium shadow-2xl transition-all duration-300 pointer-events-none ${
            isWhitePage
              ? 'bg-[#11100e] border-[#b5892a] text-white'
              : 'bg-[#12100d] border-[#e5c158]/40 text-white'
          } ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {toastMsg}
        </div>
      </div>
    </MotionConfig>
  );
}
