import React, { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppPage } from '../types/navigation';
import type { NavLabelsConfig } from '../types/cms';
import { DEFAULT_SITE_CMS } from '../data/defaultCms';

interface TopNavProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onPrefetchPage?: (page: AppPage) => void;
  bagCount: number;
  onOpenBag: () => void;
  siteName?: string;
  navLabels?: NavLabelsConfig;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentPage,
  onNavigate,
  onPrefetchPage,
  bagCount,
  onOpenBag,
  siteName = DEFAULT_SITE_CMS.brand.siteName,
  navLabels = DEFAULT_SITE_CMS.brand.navLabels,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppPage; label: string }[] = [
    { id: 'home', label: navLabels.home },
    { id: 'about', label: navLabels.about },
    { id: 'services', label: navLabels.services },
    { id: 'showroom', label: navLabels.showroom },
    { id: 'exclusive', label: navLabels.exclusive },
    { id: 'garage', label: navLabels.garage },
    { id: 'contact', label: navLabels.contact },
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (page: AppPage) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const isWhitePage = currentPage !== 'home' && currentPage !== 'admin-login';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${
        isWhitePage
          ? 'bg-[#0c0b09]/72 border-b border-black/15 shadow-lg shadow-black/5'
          : 'bg-[#080706]/52 border-b border-white/[0.12]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="font-display font-extrabold text-[13px] sm:text-base lg:text-lg tracking-[0.14em] sm:tracking-[0.2em] uppercase text-white hover:text-[#e5c158] transition-colors whitespace-nowrap min-w-0 truncate cursor-pointer text-left py-2"
        >
          {siteName}
        </button>

        {/* Zone 2: Single-Line Navigation Links (Desktop >= 1024px) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-[11px] xl:text-xs font-medium tracking-[0.12em] xl:tracking-[0.14em] uppercase"
        >
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => onPrefetchPage?.(item.id)}
                onFocus={() => onPrefetchPage?.(item.id)}
                className={`relative whitespace-nowrap shrink-0 py-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[#e5c158] ${
                  active
                    ? 'text-[#e5c158] font-semibold'
                    : 'text-[#e6dfd0]/90 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#e5c158]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Bag Action + Responsive Menu Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBag();
            }}
            className="px-2.5 sm:px-4 py-2 min-h-[40px] rounded-lg bg-[#f4f1ea]/95 text-[#080706] hover:bg-[#e5c158] font-display text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.12em] inline-flex items-center gap-1.5 sm:gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Bag</span>
            <span className="font-mono-tech tabular-nums">({bagCount})</span>
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-white/25 bg-black/45 backdrop-blur-md text-[#f4f1ea] hover:border-[#e5c158] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Blurry Glass Mobile & Tablet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-y-auto max-h-[calc(100dvh-4rem)] border-t border-white/[0.12] bg-[#0c0a08]/92 backdrop-blur-2xl px-4 py-4 space-y-1.5 shadow-2xl"
          >
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-left text-xs font-display font-bold uppercase tracking-[0.16em] flex items-center justify-between transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#e5c158] text-[#080706]'
                      : 'text-[#e5dec9] hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="font-mono-tech text-[10px]">ACTIVE</span>}
                </button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
