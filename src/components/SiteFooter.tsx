import React from 'react';
import type { AppPage } from '../types/navigation';
import type { SiteCmsConfig } from '../types/cms';
import { DEFAULT_SITE_CMS } from '../data/defaultCms';

interface SiteFooterProps {
  onNavigate: (page: AppPage) => void;
  isWhitePage?: boolean;
  brandCms?: SiteCmsConfig['brand'];
}

function sanitizeSafeExternalUrl(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return 'https://www.youtube.com/@farhantanvirshuvo';
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigate,
  isWhitePage = false,
  brandCms = DEFAULT_SITE_CMS.brand,
}) => {
  const footerNav: { id: AppPage; label: string }[] = [
    { id: 'home', label: brandCms.navLabels.home },
    { id: 'about', label: brandCms.navLabels.about },
    { id: 'services', label: brandCms.navLabels.services },
    { id: 'showroom', label: brandCms.navLabels.showroom },
    { id: 'exclusive', label: brandCms.navLabels.exclusive },
    { id: 'garage', label: brandCms.navLabels.garage },
    { id: 'contact', label: brandCms.navLabels.contact },
  ];

  const safeYoutubeHref = sanitizeSafeExternalUrl(brandCms.youtubeUrl);

  return (
    <footer
      className={`border-t py-12 transition-colors duration-300 ${
        isWhitePage
          ? 'border-[#e5e2da] bg-[#f7f6f2] text-[#11100e]'
          : 'border-white/[0.08] bg-[#050403] text-[#f4f1ea]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-baseline gap-4">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`font-display font-extrabold text-lg tracking-[0.22em] uppercase transition-colors cursor-pointer ${
                  isWhitePage
                    ? 'text-[#11100e] hover:text-[#9b7218]'
                    : 'text-white hover:text-[#e5c158]'
                }`}
              >
                {brandCms.siteName}
              </button>
              <span
                className={`text-3xl select-none ${
                  isWhitePage ? 'signature-ink-gold' : 'signature-glow'
                }`}
              >
                {brandCms.ownerName}
              </span>
            </div>
            <p className={`text-xs mt-1 ${isWhitePage ? 'text-[#5b564c]' : 'text-[#8d96a6]'}`}>
              {brandCms.footerTagline}
            </p>
          </div>

          <nav
            aria-label="Footer Navigation"
            className={`flex flex-wrap items-center gap-4 sm:gap-5 text-xs font-medium uppercase tracking-wider ${
              isWhitePage ? 'text-[#5b564c]' : 'text-[#a3acb9]'
            }`}
          >
            {footerNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`transition-colors cursor-pointer whitespace-nowrap ${
                  isWhitePage ? 'hover:text-[#9b7218]' : 'hover:text-[#e5c158]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div
          className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isWhitePage
              ? 'border-[#e5e2da] text-[#5b564c]'
              : 'border-white/[0.06] text-[#8d96a6]'
          }`}
        >
          <p>
            © {new Date().getFullYear()} {brandCms.siteName} · {brandCms.ownerName}.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5 sm:gap-6">
            <a
              href={`mailto:${brandCms.email}`}
              className={`transition-colors ${
                isWhitePage ? 'hover:text-[#9b7218]' : 'hover:text-[#e5c158]'
              }`}
            >
              {brandCms.email}
            </a>
            <a
              href={`tel:${brandCms.phone.replace(/\s+/g, '')}`}
              className={`transition-colors ${
                isWhitePage ? 'hover:text-[#9b7218]' : 'hover:text-[#e5c158]'
              }`}
            >
              {brandCms.phone}
            </a>

            {/* Official YouTube Channel Badge & Logo at the end of the website */}
            <a
              href={safeYoutubeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
              className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap shrink-0 ${
                isWhitePage
                  ? 'border-[#dedad0] bg-white text-[#11100e] hover:border-[#FF0000]/50 hover:text-[#11100e]'
                  : 'border-white/15 bg-white/[0.04] text-[#f4f1ea] hover:border-[#e5c158]/60 hover:bg-white/[0.08]'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 28 20"
                className="w-5 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
              >
                <rect width="28" height="20" rx="5.5" fill="#FF0000" />
                <path d="M11.4 6.1L18.5 10L11.4 13.9V6.1Z" fill="#FFFFFF" />
              </svg>
              <span className="font-display text-[11px] font-bold uppercase tracking-wider">
                YouTube
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
