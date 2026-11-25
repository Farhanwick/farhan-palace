import React, { useEffect, useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Save,
  RotateCcw,
  LogOut,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Film,
  User,
  Briefcase,
  Gem,
  CarFront,
  Wrench,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  AboutMilestone,
  ClexoraPillar,
  ExclusiveVaultItem,
  PortraitItem,
  ServiceOffering,
  SiteCmsConfig,
} from '../types/cms';
import type {
  GalleryPhotoItem,
  GarageProduct,
  ListingStatus,
  ResearchDiscovery,
  ShowroomCar,
  VehicleSpec,
} from '../data/vehicles';
import type { AppPage } from '../types/navigation';

interface AdminPortalProps {
  cms: SiteCmsConfig;
  hasUnsavedChanges: boolean;
  onChangeCms: (next: SiteCmsConfig) => void;
  onSaveCmsToServer: (next: SiteCmsConfig) => Promise<boolean>;
  onResetCmsOnServer: () => Promise<boolean>;
  adminToken: string | null;
  adminEmail: string | null;
  onAuthSuccess: (token: string, email: string) => void;
  onLogout: () => void;
  onNavigate: (page: AppPage) => void;
  onNotify: (msg: string) => void;
}

type AdminTab =
  | 'global'
  | 'home'
  | 'about'
  | 'services'
  | 'exclusive'
  | 'showroom'
  | 'garage'
  | 'contact_security';

type AuthMode = 'loading' | 'claim' | 'login' | 'forgot';

const TABS: {
  id: AdminTab;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'global', label: 'Brand & Nav', sub: 'Identity, Contact & Menu', icon: Globe },
  { id: 'home', label: 'Home & Motion', sub: 'Hero, Curated, Lab, Gallery', icon: Film },
  { id: 'about', label: 'Who I Am', sub: 'Bio, Photos, Ventures', icon: User },
  { id: 'services', label: 'Services', sub: 'Offerings & Payment Policy', icon: Briefcase },
  { id: 'exclusive', label: 'Exclusive Vault', sub: 'Collector Allocations', icon: Gem },
  { id: 'showroom', label: 'Showroom Cars', sub: 'Buy / Sell Inventory', icon: CarFront },
  { id: 'garage', label: 'Garage Parts', sub: 'Hardware & Fitment', icon: Wrench },
  { id: 'contact_security', label: 'Contact & PIN', sub: 'Inquiry Desk & Security', icon: Mail },
];

const GLASS_INPUT =
  'w-full min-h-[42px] rounded-xl bg-black/45 border border-white/15 px-3.5 py-2 text-sm text-[#f4f1ea] placeholder:text-[#7c7465] focus:outline-none focus:border-[#e5c158] transition-colors';
const GLASS_TEXTAREA =
  'w-full rounded-xl bg-black/45 border border-white/15 px-3.5 py-2.5 text-sm text-[#f4f1ea] placeholder:text-[#7c7465] focus:outline-none focus:border-[#e5c158] transition-colors resize-y';
const GLASS_LABEL = 'block text-[11px] font-mono-tech uppercase tracking-[0.14em] text-[#b9af9a] mb-1.5';
const GLASS_CARD =
  'rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/12 p-5 sm:p-6 space-y-4';

function splitLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  cms,
  hasUnsavedChanges,
  onChangeCms,
  onSaveCmsToServer,
  onResetCmsOnServer,
  adminToken,
  adminEmail,
  onAuthSuccess,
  onLogout,
  onNavigate,
  onNotify,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('loading');
  const [usingEnvSecret, setUsingEnvSecret] = useState(false);
  const [emailInput, setEmailInput] = useState('farhanislam0909@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Dashboard UI state
  const [activeTab, setActiveTab] = useState<AdminTab>('global');
  const [saving, setSaving] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Inline security password change state inside dashboard
  const [secEmail, setSecEmail] = useState(adminEmail || 'farhanislam0909@gmail.com');
  const [secPin, setSecPin] = useState('');
  const [secNewPwd, setSecNewPwd] = useState('');
  const [secMsg, setSecMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [secLoading, setSecLoading] = useState(false);

  useEffect(() => {
    if (adminEmail) setSecEmail(adminEmail);
  }, [adminEmail]);

  useEffect(() => {
    if (adminToken) return;
    let cancelled = false;
    setAuthMode('loading');
    fetch('/api/admin/status')
      .then((res) => res.json())
      .then((data: { initialized?: boolean; usingEnvSecret?: boolean; emailHint?: string }) => {
        if (cancelled) return;
        if (data.emailHint) setEmailInput(data.emailHint);
        setUsingEnvSecret(Boolean(data.usingEnvSecret));
        setAuthMode(data.initialized ? 'login' : 'claim');
      })
      .catch(() => {
        if (!cancelled) {
          setAuthMode('login');
          setAuthError('Unable to reach authentication server.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [adminToken]);

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (passwordInput !== confirmPasswordInput) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
          pin: pinInput.trim(),
        }),
      });
      const data = (await res.json()) as { token?: string; email?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Failed to initialize admin credentials.');
        return;
      }
      setPasswordInput('');
      setConfirmPasswordInput('');
      setPinInput('');
      onAuthSuccess(data.token, data.email || emailInput.trim());
      onNotify('Admin credentials initialized & signed in');
    } catch {
      setAuthError('Network error while claiming admin access.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });
      const data = (await res.json()) as { token?: string; email?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Invalid email or password.');
        return;
      }
      setPasswordInput('');
      onAuthSuccess(data.token, data.email || emailInput.trim());
      onNotify('Unlocked Farhan Palace Studio');
    } catch {
      setAuthError('Network error while signing in.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPinReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          pin: pinInput.trim(),
          newPassword: passwordInput,
        }),
      });
      const data = (await res.json()) as {
        token?: string;
        email?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Email or Recovery PIN verification failed.');
        return;
      }
      setPasswordInput('');
      setPinInput('');
      onAuthSuccess(data.token, data.email || emailInput.trim());
      onNotify(data.message || 'Password updated & signed in');
    } catch {
      setAuthError('Network error during PIN password recovery.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDashboardSave = async () => {
    setSaving(true);
    await onSaveCmsToServer(cms);
    setSaving(false);
  };

  const handleDashboardReset = async () => {
    setResetLoading(true);
    const ok = await onResetCmsOnServer();
    setResetLoading(false);
    if (ok) {
      setConfirmResetOpen(false);
    }
  };

  const handleAuthenticatedPwdUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg(null);
    setSecLoading(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: secEmail.trim(),
          pin: secPin.trim(),
          newPassword: secNewPwd,
        }),
      });
      const data = (await res.json()) as { token?: string; email?: string; error?: string };
      if (!res.ok || !data.token) {
        setSecMsg({ type: 'err', text: data.error || 'PIN verification failed.' });
        return;
      }
      setSecPin('');
      setSecNewPwd('');
      onAuthSuccess(data.token, data.email || secEmail.trim());
      setSecMsg({ type: 'ok', text: 'Admin password updated securely on server.' });
      onNotify('Admin password updated');
    } catch {
      setSecMsg({ type: 'err', text: 'Unable to update password right now.' });
    } finally {
      setSecLoading(false);
    }
  };

  // -------------------------
  // UNAUTHENTICATED GLASS LOGIN PORTAL
  // -------------------------
  if (!adminToken) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] pt-24 pb-20 px-4 flex items-center justify-center bg-[#080706] text-[#f4f1ea] overflow-hidden">
        {/* Ambient Gold/Obsidian Architectural Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[680px] h-[380px] rounded-full bg-[#e5c158]/14 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-1/4 w-[420px] h-[300px] rounded-full bg-[#b88b3a]/10 blur-[110px]"
        />

        <motion.div
          key={authMode}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-[#110f0c]/75 backdrop-blur-2xl backdrop-saturate-150 border border-[#e5c158]/30 shadow-[0_28px_80px_rgba(0,0,0,0.75)] p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <span className="text-[11px] font-mono-tech uppercase tracking-[0.22em] text-[#e5c158] block">
                Farhan Palace · CMS Vault
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {authMode === 'claim'
                  ? 'Initialize Admin'
                  : authMode === 'forgot'
                    ? 'PIN Recovery'
                    : 'Admin Portal'}
              </h1>
              <p className="text-xs text-[#a59b84] mt-1">
                {authMode === 'claim'
                  ? 'Set your private password and recovery PIN to unlock full-site control.'
                  : authMode === 'forgot'
                    ? 'Enter your registered email and numeric recovery PIN to set a new password.'
                    : 'Sign in to edit every page, vehicle, service, exclusive piece, and media URL live.'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#e5c158]/15 border border-[#e5c158]/35 text-[#e5c158] flex items-center justify-center shrink-0">
              {authMode === 'forgot' ? <KeyRound className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
          </div>

          {authError && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/35 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-200 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="rounded-xl border border-[#e5c158]/40 bg-[#e5c158]/10 px-3.5 py-2.5 text-xs text-[#f4e5b5] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#e5c158] shrink-0 mt-0.5" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {authMode === 'loading' && (
            <div className="py-12 flex flex-col items-center gap-3 text-xs font-mono-tech text-[#a59b84]">
              <Loader2 className="w-6 h-6 text-[#e5c158] animate-spin" />
              <span>Verifying Admin Vault Status...</span>
            </div>
          )}

          {authMode === 'claim' && (
            <form onSubmit={handleBootstrap} className="space-y-4">
              <div>
                <label htmlFor="claim-email" className={GLASS_LABEL}>
                  Admin Email
                </label>
                <input
                  id="claim-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className={GLASS_INPUT}
                />
              </div>

              <div>
                <label htmlFor="claim-pwd" className={GLASS_LABEL}>
                  Set Admin Password
                </label>
                <div className="relative">
                  <input
                    id="claim-pwd"
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className={`${GLASS_INPUT} pr-10`}
                  />
                  <button
                    type="button"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a59b84] hover:text-white cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="claim-confirm" className={GLASS_LABEL}>
                  Confirm Password
                </label>
                <input
                  id="claim-confirm"
                  type={showPwd ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter password"
                  className={GLASS_INPUT}
                />
              </div>

              <div>
                <label htmlFor="claim-pin" className={GLASS_LABEL}>
                  Set Numeric Recovery PIN (4–10 digits)
                </label>
                <input
                  id="claim-pin"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4,10}"
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="6-digit recovery PIN"
                  className={`${GLASS_INPUT} font-mono-tech`}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full min-h-[46px] rounded-xl bg-[#e5c158] hover:bg-[#f4f1ea] text-[#080706] font-display text-xs font-extrabold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>Initialize &amp; Open Admin Studio</span>
              </button>
            </form>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className={GLASS_LABEL}>
                  Admin Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className={GLASS_INPUT}
                />
              </div>

              <div>
                <label htmlFor="login-pwd" className={GLASS_LABEL}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-pwd"
                    type={showPwd ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    className={`${GLASS_INPUT} pr-10`}
                  />
                  <button
                    type="button"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a59b84] hover:text-white cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setPasswordInput('');
                    setAuthMode('forgot');
                  }}
                  className="text-[#e5c158] hover:underline cursor-pointer font-medium"
                >
                  Forgot Password? Reset via PIN
                </button>
                {usingEnvSecret && (
                  <span className="font-mono-tech text-[10px] text-[#8d96a6]">ENV GUARDED</span>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full min-h-[46px] rounded-xl bg-[#e5c158] hover:bg-[#f4f1ea] text-[#080706] font-display text-xs font-extrabold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Sign In to Admin Panel</span>
              </button>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPinReset} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className={GLASS_LABEL}>
                  Registered Admin Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className={GLASS_INPUT}
                />
              </div>

              <div>
                <label htmlFor="forgot-pin" className={GLASS_LABEL}>
                  Recovery PIN
                </label>
                <input
                  id="forgot-pin"
                  type="password"
                  inputMode="numeric"
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter your recovery PIN"
                  className={`${GLASS_INPUT} font-mono-tech`}
                />
              </div>

              <div>
                <label htmlFor="forgot-new-pwd" className={GLASS_LABEL}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="forgot-new-pwd"
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter new password"
                    className={`${GLASS_INPUT} pr-10`}
                  />
                  <button
                    type="button"
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a59b84] hover:text-white cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full min-h-[46px] rounded-xl bg-[#e5c158] hover:bg-[#f4f1ea] text-[#080706] font-display text-xs font-extrabold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>Verify PIN &amp; Reset Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  setAuthMode('login');
                }}
                className="w-full py-2 text-xs text-[#a59b84] hover:text-white cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#7d7668]">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#e5c158] transition-colors cursor-pointer"
            >
              ← Return to Home
            </button>
            <span className="font-mono-tech">SCRYPT · HMAC-SHA256</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------
  // AUTHENTICATED GLASSY ANIMATED STUDIO DASHBOARD
  // -------------------------
  return (
    <div className="relative min-h-screen pt-20 pb-24 px-3 sm:px-6 lg:px-8 bg-[#080706] text-[#f4f1ea] overflow-x-hidden">
      {/* Subtle Ambient Gold Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-16 left-1/3 w-[600px] h-[360px] rounded-full bg-[#e5c158]/10 blur-[140px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative z-10 max-w-7xl mx-auto rounded-3xl bg-[#100e0c]/82 backdrop-blur-2xl backdrop-saturate-150 border border-[#e5c158]/25 shadow-[0_32px_90px_rgba(0,0,0,0.82)] overflow-hidden"
      >
        {/* Top Frosted Glass Command Bar */}
        <header className="sticky top-0 z-30 bg-[#0d0b09]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#e5c158] text-[#080706] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-base sm:text-lg font-extrabold text-white tracking-wide">
                  FARHAN PALACE · Admin Studio
                </span>
                {hasUnsavedChanges && (
                  <span className="text-[10px] font-mono-tech uppercase tracking-wider px-2 py-0.5 rounded bg-[#e5c158]/20 text-[#e5c158] border border-[#e5c158]/40">
                    Unsaved Draft
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono-tech text-[#a59b84]">
                Signed in as {adminEmail || 'farhanislam0909@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDashboardSave}
              disabled={saving}
              className="px-4 py-2.5 min-h-[40px] rounded-xl bg-[#e5c158] hover:bg-[#f4f1ea] text-[#080706] font-display text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2.5 min-h-[40px] rounded-xl border border-white/15 bg-white/[0.04] hover:border-[#e5c158] text-xs font-display font-bold uppercase tracking-wider text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Preview Live</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#e5c158]" />
            </button>

            {confirmResetOpen ? (
              <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-400/35 rounded-xl px-2.5 py-1">
                <span className="text-[11px] text-red-200 font-medium">Reset all text/items?</span>
                <button
                  type="button"
                  disabled={resetLoading}
                  onClick={handleDashboardReset}
                  className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-[11px] font-bold cursor-pointer"
                >
                  {resetLoading ? '...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  className="px-2 py-1 text-[11px] text-[#c7bfa8] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="px-3.5 py-2.5 min-h-[40px] rounded-xl border border-white/15 bg-white/[0.04] hover:border-red-400/50 text-xs font-semibold text-[#c7bfa8] hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2.5 min-h-[40px] rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 text-xs font-semibold text-[#c7bfa8] hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Responsive Workspace: 240px Sidebar + Fluid Main Glass Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          <aside className="lg:col-span-3 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/25 p-3 sm:p-4">
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left px-3.5 py-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-3 border ${
                      active
                        ? 'bg-[#e5c158] text-[#080706] border-[#e5c158] shadow-lg'
                        : 'bg-transparent text-[#d4cbb8] border-transparent hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${active ? 'text-[#080706]' : 'text-[#e5c158]'}`}
                    />
                    <div className="min-w-0">
                      <div className="font-display text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                        {tab.label}
                      </div>
                      <div
                        className={`text-[10px] truncate hidden lg:block ${
                          active ? 'text-[#080706]/80' : 'text-[#8c8474]'
                        }`}
                      >
                        {tab.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="lg:col-span-9 p-4 sm:p-6 lg:p-8 max-h-[82vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* TAB 1: BRAND & NAVIGATION */}
              {activeTab === 'global' && (
                <motion.div
                  key="tab-global"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                      Brand Identity, Contact Info &amp; Navigation
                    </h2>
                    <p className="text-xs text-[#a59b84] mt-1">
                      Edit global header labels, contact details, payment policy banner, and footer copy across the whole website.
                    </p>
                  </div>

                  <div className={GLASS_CARD}>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                      Site Identity &amp; Global Contact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Brand Wordmark</label>
                        <input
                          type="text"
                          value={cms.brand.siteName}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              brand: { ...cms.brand, siteName: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Founder / Signature Name</label>
                        <input
                          type="text"
                          value={cms.brand.ownerName}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              brand: { ...cms.brand, ownerName: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Official Email</label>
                        <input
                          type="email"
                          value={cms.brand.email}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              brand: { ...cms.brand, email: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Direct Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={cms.brand.phone}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              brand: { ...cms.brand, phone: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Headquarters / Location Line</label>
                        <input
                          type="text"
                          value={cms.brand.location}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              brand: { ...cms.brand, location: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>YouTube Channel URL</label>
                        <input
                          type="url"
                          value={cms.brand.youtubeUrl}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              brand: { ...cms.brand, youtubeUrl: e.target.value },
                            })
                          }
                          placeholder="https://www.youtube.com/@..."
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={GLASS_LABEL}>Footer Sub-Tagline</label>
                      <input
                        type="text"
                        value={cms.brand.footerTagline}
                        onChange={(e) =>
                          onChangeCms({
                            ...cms,
                            brand: { ...cms.brand, footerTagline: e.target.value },
                          })
                        }
                        className={GLASS_INPUT}
                      />
                    </div>

                    <div>
                      <label className={GLASS_LABEL}>Global Payment Terms Notice (Shown in Bag &amp; Settlement)</label>
                      <textarea
                        rows={2}
                        value={cms.brand.paymentTermsNotice}
                        onChange={(e) =>
                          onChangeCms({
                            ...cms,
                            brand: { ...cms.brand, paymentTermsNotice: e.target.value },
                          })
                        }
                        className={GLASS_TEXTAREA}
                      />
                    </div>
                  </div>

                  <div className={GLASS_CARD}>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                      Top Navigation Menu Labels
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(Object.keys(cms.brand.navLabels) as Array<keyof SiteCmsConfig['brand']['navLabels']>).map(
                        (key) => (
                          <div key={key}>
                            <label className={GLASS_LABEL}>{key} Label</label>
                            <input
                              type="text"
                              value={cms.brand.navLabels[key]}
                              onChange={(e) =>
                                onChangeCms({
                                  ...cms,
                                  brand: {
                                    ...cms.brand,
                                    navLabels: {
                                      ...cms.brand.navLabels,
                                      [key]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className={GLASS_INPUT}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: HOME HERO, CURATED CARS, LAB & CINEMA */}
              {activeTab === 'home' && (
                <motion.div
                  key="tab-home"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                      Home Stage, Curated Cars, Lab &amp; Photography Gallery
                    </h2>
                    <p className="text-xs text-[#a59b84] mt-1">
                      Update the auto-looping Hero video/poster, section copy, Curated Garage specs, Engineering Lab studies, and the Clicked by Farhan Tanvir Shuvo Gallery.
                    </p>
                  </div>

                  {/* Hero Section */}
                  <div className={GLASS_CARD}>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                      Hero Video &amp; Overlay Copy
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Hero MP4 Video Path / URL</label>
                        <input
                          type="text"
                          value={cms.hero.videoUrl}
                          onChange={(e) =>
                            onChangeCms({ ...cms, hero: { ...cms.hero, videoUrl: e.target.value } })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Hero Poster Image Path / URL</label>
                        <input
                          type="text"
                          value={cms.hero.posterUrl}
                          onChange={(e) =>
                            onChangeCms({ ...cms, hero: { ...cms.hero, posterUrl: e.target.value } })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Eyebrow Label</label>
                        <input
                          type="text"
                          value={cms.hero.eyebrow}
                          onChange={(e) =>
                            onChangeCms({ ...cms, hero: { ...cms.hero, eyebrow: e.target.value } })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Script Signature Text</label>
                        <input
                          type="text"
                          value={cms.hero.signature}
                          onChange={(e) =>
                            onChangeCms({ ...cms, hero: { ...cms.hero, signature: e.target.value } })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Main Hero Headline</label>
                        <input
                          type="text"
                          value={cms.hero.headline}
                          onChange={(e) =>
                            onChangeCms({ ...cms, hero: { ...cms.hero, headline: e.target.value } })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Venture Sub-Badge</label>
                        <input
                          type="text"
                          value={cms.hero.ventureBadge}
                          onChange={(e) =>
                            onChangeCms({ ...cms, hero: { ...cms.hero, ventureBadge: e.target.value } })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={GLASS_LABEL}>Hero Subtitle</label>
                      <textarea
                        rows={2}
                        value={cms.hero.subtitle}
                        onChange={(e) =>
                          onChangeCms({ ...cms, hero: { ...cms.hero, subtitle: e.target.value } })
                        }
                        className={GLASS_TEXTAREA}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Venture Subline</label>
                        <input
                          type="text"
                          value={cms.hero.ventureSubline}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              hero: { ...cms.hero, ventureSubline: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Primary CTA Label</label>
                        <input
                          type="text"
                          value={cms.hero.primaryCtaLabel}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              hero: { ...cms.hero, primaryCtaLabel: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Secondary CTA Label</label>
                        <input
                          type="text"
                          value={cms.hero.secondaryCtaLabel}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              hero: { ...cms.hero, secondaryCtaLabel: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Home Section Titles */}
                  <div className={GLASS_CARD}>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                      Home Section Headings (Destinations · Engineering Lab · Gallery)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={GLASS_LABEL}>Destinations Title</label>
                        <input
                          type="text"
                          value={cms.homeSections.destinationsTitle}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              homeSections: {
                                ...cms.homeSections,
                                destinationsTitle: e.target.value,
                              },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Engineering Lab Title</label>
                        <input
                          type="text"
                          value={cms.homeSections.labTitle}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              homeSections: { ...cms.homeSections, labTitle: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Gallery Section Title</label>
                        <input
                          type="text"
                          value={cms.homeSections.galleryTitle}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              homeSections: { ...cms.homeSections, galleryTitle: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Curated Vehicles */}
                  <div className={GLASS_CARD}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                        Curated Cars ({cms.curatedVehicles.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const base: VehicleSpec = {
                            ...(cms.curatedVehicles[0] || {
                              id: 'porsche_911_gt3_rs',
                              indexLabel: '05',
                              manufacturer: 'Porsche',
                              model: '911 S/T',
                              shortLabel: '911 S/T',
                              year: '2025 Weissach Spec',
                              trimTag: 'Weissach Lightweight',
                              tagline: 'Pure naturally aspirated engagement.',
                              description: 'Collector lightweight edition.',
                              engine: '4.0L Flat-Six',
                              displacement: '3,996 cc',
                              horsepower: 525,
                              horsepowerNote: '@ 8,500 rpm',
                              torque: 465,
                              torqueUnit: 'Nm @ 6,300 rpm',
                              zeroToHundred: '3.7 s',
                              topSpeed: '300 km/h',
                              transmission: '6-Speed Manual',
                              drivetrain: 'Rear-Wheel Drive',
                              fuelType: 'Petrol',
                              redlineRpm: 9000,
                              downforceNote: 'Carbon Active Aero',
                              studioImage: '/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg',
                              galleryImages: ['/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg'],
                              accentHex: '#e5c158',
                              audioTrack: 'lamborghini',
                              specialFeatures: ['Carbon bucket seats', 'Magnesium wheels'],
                            }),
                            id: `curated-${Date.now()}`,
                            indexLabel: String(cms.curatedVehicles.length + 1).padStart(2, '0'),
                            model: 'New Curated Machine',
                            shortLabel: 'New Spec',
                          };
                          onChangeCms({
                            ...cms,
                            curatedVehicles: [...cms.curatedVehicles, base],
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#e5c158] text-[#080706] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Curated Car</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {cms.curatedVehicles.map((v, idx) => (
                        <div
                          key={v.id}
                          className="rounded-xl bg-black/35 border border-white/10 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono-tech text-xs text-[#e5c158]">
                              #{v.indexLabel} · {v.manufacturer} {v.model}
                            </span>
                            {cms.curatedVehicles.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  onChangeCms({
                                    ...cms,
                                    curatedVehicles: cms.curatedVehicles.filter((x) => x.id !== v.id),
                                  })
                                }
                                className="text-red-300 hover:text-red-200 p-1 cursor-pointer"
                                aria-label="Remove curated car"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={v.manufacturer}
                              onChange={(e) => {
                                const next = [...cms.curatedVehicles];
                                next[idx] = { ...v, manufacturer: e.target.value };
                                onChangeCms({ ...cms, curatedVehicles: next });
                              }}
                              placeholder="Manufacturer"
                              className={GLASS_INPUT}
                            />
                            <input
                              type="text"
                              value={v.model}
                              onChange={(e) => {
                                const next = [...cms.curatedVehicles];
                                next[idx] = { ...v, model: e.target.value };
                                onChangeCms({ ...cms, curatedVehicles: next });
                              }}
                              placeholder="Model"
                              className={GLASS_INPUT}
                            />
                            <input
                              type="text"
                              value={v.shortLabel}
                              onChange={(e) => {
                                const next = [...cms.curatedVehicles];
                                next[idx] = { ...v, shortLabel: e.target.value };
                                onChangeCms({ ...cms, curatedVehicles: next });
                              }}
                              placeholder="Tab Short Label"
                              className={GLASS_INPUT}
                            />
                            <input
                              type="number"
                              value={v.horsepower}
                              onChange={(e) => {
                                const next = [...cms.curatedVehicles];
                                next[idx] = { ...v, horsepower: Number(e.target.value) || 0 };
                                onChangeCms({ ...cms, curatedVehicles: next });
                              }}
                              placeholder="Horsepower"
                              className={`${GLASS_INPUT} font-mono-tech`}
                            />
                            <input
                              type="number"
                              value={v.torque}
                              onChange={(e) => {
                                const next = [...cms.curatedVehicles];
                                next[idx] = { ...v, torque: Number(e.target.value) || 0 };
                                onChangeCms({ ...cms, curatedVehicles: next });
                              }}
                              placeholder="Torque Nm"
                              className={`${GLASS_INPUT} font-mono-tech`}
                            />
                            <input
                              type="text"
                              value={v.studioImage}
                              onChange={(e) => {
                                const next = [...cms.curatedVehicles];
                                next[idx] = { ...v, studioImage: e.target.value };
                                onChangeCms({ ...cms, curatedVehicles: next });
                              }}
                              placeholder="Cover Image URL"
                              className={GLASS_INPUT}
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={v.description}
                            onChange={(e) => {
                              const next = [...cms.curatedVehicles];
                              next[idx] = { ...v, description: e.target.value };
                              onChangeCms({ ...cms, curatedVehicles: next });
                            }}
                            placeholder="Vehicle dossier description"
                            className={GLASS_TEXTAREA}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engineering Research & Photography Gallery */}
                  <div className={GLASS_CARD}>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                      Engineering Discoveries ({cms.researchDiscoveries.length})
                    </h3>
                    <div className="space-y-3">
                      {cms.researchDiscoveries.map((disc: ResearchDiscovery, idx: number) => (
                        <div
                          key={disc.id}
                          className="rounded-xl bg-black/35 border border-white/10 p-3.5 space-y-2"
                        >
                          <input
                            type="text"
                            value={disc.topic}
                            onChange={(e) => {
                              const next = [...cms.researchDiscoveries];
                              next[idx] = { ...disc, topic: e.target.value };
                              onChangeCms({ ...cms, researchDiscoveries: next });
                            }}
                            className={GLASS_INPUT}
                          />
                          <textarea
                            rows={2}
                            value={disc.summary}
                            onChange={(e) => {
                              const next = [...cms.researchDiscoveries];
                              next[idx] = { ...disc, summary: e.target.value };
                              onChangeCms({ ...cms, researchDiscoveries: next });
                            }}
                            className={GLASS_TEXTAREA}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                        Clicked by Farhan Tanvir Shuvo Gallery ({cms.galleryPhotos.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const newItem: GalleryPhotoItem = {
                            id: `gal-adm-${Date.now()}`,
                            title: 'New Captured Frame',
                            category: 'Supra & Performance',
                            image: '/assets/gallery/Picsart_26-06-27_00-10-31-800.jpg',
                            note: 'Clicked by Farhan Tanvir Shuvo.',
                          };
                          onChangeCms({
                            ...cms,
                            galleryPhotos: [newItem, ...cms.galleryPhotos],
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#e5c158] text-[#080706] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Gallery Photo</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {cms.galleryPhotos.map((ph: GalleryPhotoItem, idx: number) => (
                        <div
                          key={ph.id}
                          className="rounded-xl bg-black/35 border border-white/10 p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                        >
                          <img
                            src={ph.image}
                            alt={ph.title}
                            loading="lazy"
                            className="sm:col-span-2 w-full h-16 object-cover rounded-lg border border-white/10"
                          />
                          <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <input
                              type="text"
                              value={ph.title}
                              onChange={(e) => {
                                const next = [...cms.galleryPhotos];
                                next[idx] = { ...ph, title: e.target.value };
                                onChangeCms({ ...cms, galleryPhotos: next });
                              }}
                              placeholder="Frame Title"
                              className={GLASS_INPUT}
                            />
                            <select
                              value={ph.category}
                              onChange={(e) => {
                                const next = [...cms.galleryPhotos];
                                next[idx] = {
                                  ...ph,
                                  category: e.target.value as GalleryPhotoItem['category'],
                                };
                                onChangeCms({ ...cms, galleryPhotos: next });
                              }}
                              className={GLASS_INPUT}
                            >
                              <option value="Supra & Performance">Supra &amp; Performance</option>
                              <option value="Street & Stance">Street &amp; Stance</option>
                              <option value="Mercedes & Luxury">Mercedes &amp; Luxury</option>
                              <option value="Sedans & Interiors">Sedans &amp; Interiors</option>
                            </select>
                            <input
                              type="text"
                              value={ph.image}
                              onChange={(e) => {
                                const next = [...cms.galleryPhotos];
                                next[idx] = { ...ph, image: e.target.value };
                                onChangeCms({ ...cms, galleryPhotos: next });
                              }}
                              placeholder="Image URL"
                              className={GLASS_INPUT}
                            />
                            <input
                              type="text"
                              value={ph.note}
                              onChange={(e) => {
                                const next = [...cms.galleryPhotos];
                                next[idx] = { ...ph, note: e.target.value };
                                onChangeCms({ ...cms, galleryPhotos: next });
                              }}
                              placeholder="Shot Note"
                              className={`${GLASS_INPUT} sm:col-span-3`}
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                onChangeCms({
                                  ...cms,
                                  galleryPhotos: cms.galleryPhotos.filter((x) => x.id !== ph.id),
                                })
                              }
                              className="text-red-300 hover:text-red-200 p-1.5 cursor-pointer"
                              aria-label="Remove gallery photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: WHO I AM */}
              {activeTab === 'about' && (
                <motion.div
                  key="tab-about"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                      Who I Am · Manifesto, Photos &amp; Ventures
                    </h2>
                    <p className="text-xs text-[#a59b84] mt-1">
                      Edit Farhan’s bio copy, portrait gallery photos, Clexora pillars, and milestone cards.
                    </p>
                  </div>

                  <div className={GLASS_CARD}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Main Heading</label>
                        <input
                          type="text"
                          value={cms.about.heading}
                          onChange={(e) =>
                            onChangeCms({ ...cms, about: { ...cms.about, heading: e.target.value } })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Manifesto Headline</label>
                        <input
                          type="text"
                          value={cms.about.manifestoHeadline}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              about: { ...cms.about, manifestoHeadline: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={GLASS_LABEL}>Bio Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={cms.about.bioParagraph1}
                        onChange={(e) =>
                          onChangeCms({
                            ...cms,
                            about: { ...cms.about, bioParagraph1: e.target.value },
                          })
                        }
                        className={GLASS_TEXTAREA}
                      />
                    </div>
                    <div>
                      <label className={GLASS_LABEL}>Bio Paragraph 2</label>
                      <textarea
                        rows={2}
                        value={cms.about.bioParagraph2}
                        onChange={(e) =>
                          onChangeCms({
                            ...cms,
                            about: { ...cms.about, bioParagraph2: e.target.value },
                          })
                        }
                        className={GLASS_TEXTAREA}
                      />
                    </div>
                  </div>

                  {/* Personal Portraits Gallery */}
                  <div className={GLASS_CARD}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                        Founder Portraits ({cms.about.portraits.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const newItem: PortraitItem = {
                            src: '/assets/aistudio/adas_c216d534.jpeg',
                            caption: 'New Portrait Caption',
                            alt: 'Farhan Tanvir Shuvo portrait',
                          };
                          onChangeCms({
                            ...cms,
                            about: {
                              ...cms.about,
                              portraits: [...cms.about.portraits, newItem],
                            },
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#e5c158] text-[#080706] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {cms.about.portraits.map((pt, idx) => (
                        <div
                          key={`${pt.src}-${idx}`}
                          className="rounded-xl bg-black/35 border border-white/10 p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                        >
                          <img
                            src={pt.src}
                            alt={pt.alt}
                            className="sm:col-span-2 w-full h-16 object-cover rounded-lg border border-white/10"
                          />
                          <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              value={pt.src}
                              onChange={(e) => {
                                const next = [...cms.about.portraits];
                                next[idx] = { ...pt, src: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  about: { ...cms.about, portraits: next },
                                });
                              }}
                              placeholder="Image path or URL"
                              className={GLASS_INPUT}
                            />
                            <input
                              type="text"
                              value={pt.caption}
                              onChange={(e) => {
                                const next = [...cms.about.portraits];
                                next[idx] = { ...pt, caption: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  about: { ...cms.about, portraits: next },
                                });
                              }}
                              placeholder="Caption"
                              className={GLASS_INPUT}
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            {cms.about.portraits.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  onChangeCms({
                                    ...cms,
                                    about: {
                                      ...cms.about,
                                      portraits: cms.about.portraits.filter((_, i) => i !== idx),
                                    },
                                  })
                                }
                                className="text-red-300 hover:text-red-200 p-1.5 cursor-pointer"
                                aria-label="Remove portrait"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clexora Pillars & Milestones */}
                  <div className={GLASS_CARD}>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                      Clexora Operations Pillars &amp; Executed Milestones
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cms.about.clexoraPillars.map((pil: ClexoraPillar, idx: number) => (
                        <div
                          key={pil.id}
                          className="rounded-xl bg-black/35 border border-white/10 p-3 space-y-2"
                        >
                          <input
                            type="text"
                            value={pil.title}
                            onChange={(e) => {
                              const next = [...cms.about.clexoraPillars];
                              next[idx] = { ...pil, title: e.target.value };
                              onChangeCms({
                                ...cms,
                                about: { ...cms.about, clexoraPillars: next },
                              });
                            }}
                            className={GLASS_INPUT}
                          />
                          <textarea
                            rows={2}
                            value={pil.summary}
                            onChange={(e) => {
                              const next = [...cms.about.clexoraPillars];
                              next[idx] = { ...pil, summary: e.target.value };
                              onChangeCms({
                                ...cms,
                                about: { ...cms.about, clexoraPillars: next },
                              });
                            }}
                            className={GLASS_TEXTAREA}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/10">
                      {cms.about.milestones.map((ms: AboutMilestone, idx: number) => (
                        <div
                          key={ms.id}
                          className="rounded-xl bg-black/35 border border-white/10 p-3.5 space-y-2"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <input
                              type="text"
                              value={ms.title}
                              onChange={(e) => {
                                const next = [...cms.about.milestones];
                                next[idx] = { ...ms, title: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  about: { ...cms.about, milestones: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                            <input
                              type="text"
                              value={ms.role}
                              onChange={(e) => {
                                const next = [...cms.about.milestones];
                                next[idx] = { ...ms, role: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  about: { ...cms.about, milestones: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                            <input
                              type="text"
                              value={ms.ctaLabel}
                              onChange={(e) => {
                                const next = [...cms.about.milestones];
                                next[idx] = { ...ms, ctaLabel: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  about: { ...cms.about, milestones: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={ms.summary}
                            onChange={(e) => {
                              const next = [...cms.about.milestones];
                              next[idx] = { ...ms, summary: e.target.value };
                              onChangeCms({
                                ...cms,
                                about: { ...cms.about, milestones: next },
                              });
                            }}
                            className={GLASS_TEXTAREA}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: SERVICES PAGE */}
              {activeTab === 'services' && (
                <motion.div
                  key="tab-services"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        Services &amp; Execution Manager
                      </h2>
                      <p className="text-xs text-[#a59b84] mt-1">
                        Edit service offerings (cinematography, Clexora remote office execution, car selling, exclusive items, garage hardware) and deferred payment terms policy.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const created: ServiceOffering = {
                          id: `svc-${Date.now()}`,
                          indexLabel: String(cms.servicesPage.items.length + 1).padStart(2, '0'),
                          category: 'Operations & Execution',
                          ventureTag: 'Farhan Palace',
                          title: 'New Custom Service Offering',
                          summary: 'Describe the scope and outcomes provided to clients.',
                          deliverables: ['Primary deliverable one', 'Dedicated account coordination'],
                          rateLabel: 'Payment Terms Configured Later',
                          turnaround: 'Flexible Timeline',
                          status: 'active',
                        };
                        onChangeCms({
                          ...cms,
                          servicesPage: {
                            ...cms.servicesPage,
                            items: [...cms.servicesPage.items, created],
                          },
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#e5c158] text-[#080706] text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className={GLASS_CARD}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Page Title</label>
                        <input
                          type="text"
                          value={cms.servicesPage.title}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              servicesPage: { ...cms.servicesPage, title: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Payment Notice Heading</label>
                        <input
                          type="text"
                          value={cms.servicesPage.paymentNoticeTitle}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              servicesPage: {
                                ...cms.servicesPage,
                                paymentNoticeTitle: e.target.value,
                              },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={GLASS_LABEL}>Payment Notice Body</label>
                      <textarea
                        rows={2}
                        value={cms.servicesPage.paymentNoticeBody}
                        onChange={(e) =>
                          onChangeCms({
                            ...cms,
                            servicesPage: {
                              ...cms.servicesPage,
                              paymentNoticeBody: e.target.value,
                            },
                          })
                        }
                        className={GLASS_TEXTAREA}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {cms.servicesPage.items.map((svc, idx) => (
                      <div key={svc.id} className={GLASS_CARD}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono-tech text-xs text-[#e5c158]">
                            {svc.indexLabel} · {svc.title}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onChangeCms({
                                ...cms,
                                servicesPage: {
                                  ...cms.servicesPage,
                                  items: cms.servicesPage.items.filter((x) => x.id !== svc.id),
                                },
                              })
                            }
                            className="text-red-300 hover:text-red-200 p-1 cursor-pointer"
                            aria-label="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className={GLASS_LABEL}>Title</label>
                            <input
                              type="text"
                              value={svc.title}
                              onChange={(e) => {
                                const next = [...cms.servicesPage.items];
                                next[idx] = { ...svc, title: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  servicesPage: { ...cms.servicesPage, items: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                          </div>
                          <div>
                            <label className={GLASS_LABEL}>Category</label>
                            <input
                              type="text"
                              value={svc.category}
                              onChange={(e) => {
                                const next = [...cms.servicesPage.items];
                                next[idx] = { ...svc, category: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  servicesPage: { ...cms.servicesPage, items: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                          </div>
                          <div>
                            <label className={GLASS_LABEL}>Venture Tag</label>
                            <input
                              type="text"
                              value={svc.ventureTag}
                              onChange={(e) => {
                                const next = [...cms.servicesPage.items];
                                next[idx] = { ...svc, ventureTag: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  servicesPage: { ...cms.servicesPage, items: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className={GLASS_LABEL}>Pricing / Payment Terms Note</label>
                            <input
                              type="text"
                              value={svc.rateLabel}
                              onChange={(e) => {
                                const next = [...cms.servicesPage.items];
                                next[idx] = { ...svc, rateLabel: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  servicesPage: { ...cms.servicesPage, items: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                          </div>
                          <div>
                            <label className={GLASS_LABEL}>Turnaround</label>
                            <input
                              type="text"
                              value={svc.turnaround}
                              onChange={(e) => {
                                const next = [...cms.servicesPage.items];
                                next[idx] = { ...svc, turnaround: e.target.value };
                                onChangeCms({
                                  ...cms,
                                  servicesPage: { ...cms.servicesPage, items: next },
                                });
                              }}
                              className={GLASS_INPUT}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={GLASS_LABEL}>Summary</label>
                          <textarea
                            rows={2}
                            value={svc.summary}
                            onChange={(e) => {
                              const next = [...cms.servicesPage.items];
                              next[idx] = { ...svc, summary: e.target.value };
                              onChangeCms({
                                ...cms,
                                servicesPage: { ...cms.servicesPage, items: next },
                              });
                            }}
                            className={GLASS_TEXTAREA}
                          />
                        </div>

                        <div>
                          <label className={GLASS_LABEL}>Deliverables (one per line)</label>
                          <textarea
                            rows={3}
                            value={svc.deliverables.join('\n')}
                            onChange={(e) => {
                              const next = [...cms.servicesPage.items];
                              next[idx] = { ...svc, deliverables: splitLines(e.target.value) };
                              onChangeCms({
                                ...cms,
                                servicesPage: { ...cms.servicesPage, items: next },
                              });
                            }}
                            className={GLASS_TEXTAREA}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 5: EXCLUSIVE PANEL */}
              {activeTab === 'exclusive' && (
                <motion.div
                  key="tab-exclusive"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        Exclusive Panel &amp; Collector Allocations
                      </h2>
                      <p className="text-xs text-[#a59b84] mt-1">
                        Add, remove, reprice, or toggle allocation availability for limited-edition pieces.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const created: ExclusiveVaultItem = {
                          id: `exc-${Date.now()}`,
                          title: 'New Exclusive Collector Release',
                          brand: 'Imperion Private Vault',
                          editionTag: 'Edition 1 of 1',
                          category: 'Timepieces',
                          priceUsd: 35000,
                          allocationLabel: '1 Piece Available',
                          status: 'available',
                          grade: 'Grade S · Collector Sealed',
                          provenance: 'Authenticated Certificate',
                          paymentNote: 'Payment terms finalized directly upon reservation',
                          images: ['/src/assets/images/imperion_atelier_showroom_1795257319293.jpg'],
                          description: 'Limited allocation curator item.',
                          highlights: ['Verified provenance', 'Insured delivery ready'],
                        };
                        onChangeCms({
                          ...cms,
                          exclusivePage: {
                            ...cms.exclusivePage,
                            items: [created, ...cms.exclusivePage.items],
                          },
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#e5c158] text-[#080706] text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Exclusive Item</span>
                    </button>
                  </div>

                  <div className={GLASS_CARD}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Exclusive Page Title</label>
                        <input
                          type="text"
                          value={cms.exclusivePage.title}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              exclusivePage: { ...cms.exclusivePage, title: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Deferred Payment Notice Banner</label>
                        <input
                          type="text"
                          value={cms.exclusivePage.paymentBanner}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              exclusivePage: {
                                ...cms.exclusivePage,
                                paymentBanner: e.target.value,
                              },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {cms.exclusivePage.items.map((item, idx) => (
                      <div key={item.id} className={GLASS_CARD}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono-tech text-xs text-[#e5c158]">
                            {item.brand} · {item.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <select
                              value={item.status}
                              onChange={(e) => {
                                const next = [...cms.exclusivePage.items];
                                next[idx] = {
                                  ...item,
                                  status: e.target.value as ExclusiveVaultItem['status'],
                                };
                                onChangeCms({
                                  ...cms,
                                  exclusivePage: { ...cms.exclusivePage, items: next },
                                });
                              }}
                              className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1 text-xs text-white"
                            >
                              <option value="available">Available</option>
                              <option value="upcoming">Allocation Soon</option>
                              <option value="stock_out">Reserved / Out</option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                onChangeCms({
                                  ...cms,
                                  exclusivePage: {
                                    ...cms.exclusivePage,
                                    items: cms.exclusivePage.items.filter((x) => x.id !== item.id),
                                  },
                                })
                              }
                              className="text-red-300 hover:text-red-200 p-1 cursor-pointer"
                              aria-label="Delete exclusive item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const next = [...cms.exclusivePage.items];
                              next[idx] = { ...item, title: e.target.value };
                              onChangeCms({
                                ...cms,
                                exclusivePage: { ...cms.exclusivePage, items: next },
                              });
                            }}
                            placeholder="Title"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={item.brand}
                            onChange={(e) => {
                              const next = [...cms.exclusivePage.items];
                              next[idx] = { ...item, brand: e.target.value };
                              onChangeCms({
                                ...cms,
                                exclusivePage: { ...cms.exclusivePage, items: next },
                              });
                            }}
                            placeholder="Brand"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="number"
                            value={item.priceUsd}
                            onChange={(e) => {
                              const next = [...cms.exclusivePage.items];
                              next[idx] = { ...item, priceUsd: Number(e.target.value) || 0 };
                              onChangeCms({
                                ...cms,
                                exclusivePage: { ...cms.exclusivePage, items: next },
                              });
                            }}
                            placeholder="Price USD"
                            className={`${GLASS_INPUT} font-mono-tech`}
                          />
                          <input
                            type="text"
                            value={item.editionTag}
                            onChange={(e) => {
                              const next = [...cms.exclusivePage.items];
                              next[idx] = { ...item, editionTag: e.target.value };
                              onChangeCms({
                                ...cms,
                                exclusivePage: { ...cms.exclusivePage, items: next },
                              });
                            }}
                            placeholder="Edition Tag"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={item.grade}
                            onChange={(e) => {
                              const next = [...cms.exclusivePage.items];
                              next[idx] = { ...item, grade: e.target.value };
                              onChangeCms({
                                ...cms,
                                exclusivePage: { ...cms.exclusivePage, items: next },
                              });
                            }}
                            placeholder="Grade"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={item.images[0] || ''}
                            onChange={(e) => {
                              const next = [...cms.exclusivePage.items];
                              const imgs = [...item.images];
                              imgs[0] = e.target.value;
                              next[idx] = { ...item, images: imgs };
                              onChangeCms({
                                ...cms,
                                exclusivePage: { ...cms.exclusivePage, items: next },
                              });
                            }}
                            placeholder="Cover Image URL"
                            className={GLASS_INPUT}
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const next = [...cms.exclusivePage.items];
                            next[idx] = { ...item, description: e.target.value };
                            onChangeCms({
                              ...cms,
                              exclusivePage: { ...cms.exclusivePage, items: next },
                            });
                          }}
                          className={GLASS_TEXTAREA}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 6: SHOWROOM CARS */}
              {activeTab === 'showroom' && (
                <motion.div
                  key="tab-showroom"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        Showroom Vehicles ({cms.showroomCars.length})
                      </h2>
                      <p className="text-xs text-[#a59b84] mt-1">
                        Edit pricing, auction grade, Available / Upcoming / Stock Out status, and studio photo URLs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const created: ShowroomCar = {
                          id: `sr-adm-${Date.now()}`,
                          brand: 'Porsche',
                          model: '911 Turbo S',
                          year: 2025,
                          priceUsd: 242000,
                          grade: 'Grade S · 10/10',
                          status: 'available',
                          listingMode: 'buy',
                          mileageKm: '450 km',
                          exteriorColor: 'GT Silver Metallic',
                          interiorTrim: 'Black Club Leather',
                          engine: '3.7L Twin-Turbo Flat-Six',
                          horsepower: '640 HP',
                          transmission: '8-Speed PDK',
                          location: 'Imperion Vault · Dhaka Port Ready',
                          images: ['/src/assets/images/porsche_911_gt3_rs_992_1795352099322.jpg'],
                          highlights: ['Grade S verified chassis', 'Ceramic brakes included'],
                          summary: 'Fresh showroom inventory added from Farhan Palace Admin Studio.',
                        };
                        onChangeCms({ ...cms, showroomCars: [created, ...cms.showroomCars] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#e5c158] text-[#080706] text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Showroom Car</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cms.showroomCars.map((car, idx) => (
                      <div key={car.id} className={GLASS_CARD}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono-tech text-xs text-[#e5c158]">
                            {car.brand} {car.model} · {car.year}
                          </span>
                          <div className="flex items-center gap-2">
                            <select
                              value={car.status}
                              onChange={(e) => {
                                const next = [...cms.showroomCars];
                                next[idx] = { ...car, status: e.target.value as ListingStatus };
                                onChangeCms({ ...cms, showroomCars: next });
                              }}
                              className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1 text-xs text-white"
                            >
                              <option value="available">Available</option>
                              <option value="upcoming">Upcoming</option>
                              <option value="stock_out">Stock Out</option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                onChangeCms({
                                  ...cms,
                                  showroomCars: cms.showroomCars.filter((x) => x.id !== car.id),
                                })
                              }
                              className="text-red-300 hover:text-red-200 p-1 cursor-pointer"
                              aria-label="Delete showroom car"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={car.brand}
                            onChange={(e) => {
                              const next = [...cms.showroomCars];
                              next[idx] = { ...car, brand: e.target.value };
                              onChangeCms({ ...cms, showroomCars: next });
                            }}
                            placeholder="Brand"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={car.model}
                            onChange={(e) => {
                              const next = [...cms.showroomCars];
                              next[idx] = { ...car, model: e.target.value };
                              onChangeCms({ ...cms, showroomCars: next });
                            }}
                            placeholder="Model"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="number"
                            value={car.priceUsd}
                            onChange={(e) => {
                              const next = [...cms.showroomCars];
                              next[idx] = { ...car, priceUsd: Number(e.target.value) || 0 };
                              onChangeCms({ ...cms, showroomCars: next });
                            }}
                            placeholder="Price USD"
                            className={`${GLASS_INPUT} font-mono-tech`}
                          />
                          <input
                            type="text"
                            value={car.grade}
                            onChange={(e) => {
                              const next = [...cms.showroomCars];
                              next[idx] = { ...car, grade: e.target.value };
                              onChangeCms({ ...cms, showroomCars: next });
                            }}
                            placeholder="Grade"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={car.horsepower}
                            onChange={(e) => {
                              const next = [...cms.showroomCars];
                              next[idx] = { ...car, horsepower: e.target.value };
                              onChangeCms({ ...cms, showroomCars: next });
                            }}
                            placeholder="Horsepower"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={car.images[0] || ''}
                            onChange={(e) => {
                              const next = [...cms.showroomCars];
                              const imgs = [...car.images];
                              imgs[0] = e.target.value;
                              next[idx] = { ...car, images: imgs };
                              onChangeCms({ ...cms, showroomCars: next });
                            }}
                            placeholder="Lead Image URL"
                            className={GLASS_INPUT}
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={car.summary}
                          onChange={(e) => {
                            const next = [...cms.showroomCars];
                            next[idx] = { ...car, summary: e.target.value };
                            onChangeCms({ ...cms, showroomCars: next });
                          }}
                          className={GLASS_TEXTAREA}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 7: GARAGE PARTS */}
              {activeTab === 'garage' && (
                <motion.div
                  key="tab-garage"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                        Garage Hardware ({cms.garageItems.length})
                      </h2>
                      <p className="text-xs text-[#a59b84] mt-1">
                        Manage wheels, carbon kits, exhausts, cinema mounts, SKU codes, and stock availability.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const created: GarageProduct = {
                          id: `gr-adm-${Date.now()}`,
                          name: 'New Forged Performance Component',
                          brand: 'Imperion Hardware',
                          category: 'Aero & Carbon',
                          priceUsd: 2450,
                          grade: 'Grade S · OEM+',
                          status: 'available',
                          fitment: 'Universal Performance Fitment',
                          sku: `IMP-${String(cms.garageItems.length + 10).padStart(3, '0')}`,
                          images: ['/src/assets/images/garage_forged_wheel_brake_1795352099797.jpg'],
                          description: 'Hardware component added directly from Admin Studio.',
                          specs: ['CNC billet aerospace alloy', 'Direct OEM mounting points'],
                        };
                        onChangeCms({ ...cms, garageItems: [created, ...cms.garageItems] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#e5c158] text-[#080706] text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Garage Item</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cms.garageItems.map((item, idx) => (
                      <div key={item.id} className={GLASS_CARD}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono-tech text-xs text-[#e5c158]">
                            {item.sku} · {item.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <select
                              value={item.status}
                              onChange={(e) => {
                                const next = [...cms.garageItems];
                                next[idx] = { ...item, status: e.target.value as ListingStatus };
                                onChangeCms({ ...cms, garageItems: next });
                              }}
                              className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1 text-xs text-white"
                            >
                              <option value="available">Available</option>
                              <option value="upcoming">Upcoming</option>
                              <option value="stock_out">Stock Out</option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                onChangeCms({
                                  ...cms,
                                  garageItems: cms.garageItems.filter((x) => x.id !== item.id),
                                })
                              }
                              className="text-red-300 hover:text-red-200 p-1 cursor-pointer"
                              aria-label="Delete garage item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const next = [...cms.garageItems];
                              next[idx] = { ...item, name: e.target.value };
                              onChangeCms({ ...cms, garageItems: next });
                            }}
                            placeholder="Part Name"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={item.brand}
                            onChange={(e) => {
                              const next = [...cms.garageItems];
                              next[idx] = { ...item, brand: e.target.value };
                              onChangeCms({ ...cms, garageItems: next });
                            }}
                            placeholder="Brand"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="number"
                            value={item.priceUsd}
                            onChange={(e) => {
                              const next = [...cms.garageItems];
                              next[idx] = { ...item, priceUsd: Number(e.target.value) || 0 };
                              onChangeCms({ ...cms, garageItems: next });
                            }}
                            placeholder="Price USD"
                            className={`${GLASS_INPUT} font-mono-tech`}
                          />
                          <input
                            type="text"
                            value={item.fitment}
                            onChange={(e) => {
                              const next = [...cms.garageItems];
                              next[idx] = { ...item, fitment: e.target.value };
                              onChangeCms({ ...cms, garageItems: next });
                            }}
                            placeholder="Fitment"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={item.sku}
                            onChange={(e) => {
                              const next = [...cms.garageItems];
                              next[idx] = { ...item, sku: e.target.value };
                              onChangeCms({ ...cms, garageItems: next });
                            }}
                            placeholder="SKU"
                            className={GLASS_INPUT}
                          />
                          <input
                            type="text"
                            value={item.images[0] || ''}
                            onChange={(e) => {
                              const next = [...cms.garageItems];
                              const imgs = [...item.images];
                              imgs[0] = e.target.value;
                              next[idx] = { ...item, images: imgs };
                              onChangeCms({ ...cms, garageItems: next });
                            }}
                            placeholder="Cover Image URL"
                            className={GLASS_INPUT}
                          />
                        </div>

                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const next = [...cms.garageItems];
                            next[idx] = { ...item, description: e.target.value };
                            onChangeCms({ ...cms, garageItems: next });
                          }}
                          className={GLASS_TEXTAREA}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 8: CONTACT & SECURITY */}
              {activeTab === 'contact_security' && (
                <motion.div
                  key="tab-contact-sec"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                      Contact Page Copy &amp; Admin Password Security
                    </h2>
                    <p className="text-xs text-[#a59b84] mt-1">
                      Customize inquiry desk track labels on Contact Me or rotate your admin password using your recovery PIN.
                    </p>
                  </div>

                  <div className={GLASS_CARD}>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                      Contact Me Desk Copy
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={GLASS_LABEL}>Page Eyebrow</label>
                        <input
                          type="text"
                          value={cms.contactPage.eyebrow}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              contactPage: { ...cms.contactPage, eyebrow: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Page Title</label>
                        <input
                          type="text"
                          value={cms.contactPage.title}
                          onChange={(e) =>
                            onChangeCms({
                              ...cms,
                              contactPage: { ...cms.contactPage, title: e.target.value },
                            })
                          }
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={GLASS_LABEL}>Contact Page Subtitle</label>
                      <textarea
                        rows={2}
                        value={cms.contactPage.subtitle}
                        onChange={(e) =>
                          onChangeCms({
                            ...cms,
                            contactPage: { ...cms.contactPage, subtitle: e.target.value },
                          })
                        }
                        className={GLASS_TEXTAREA}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                      {(Object.keys(cms.contactPage.tracks) as Array<
                        keyof SiteCmsConfig['contactPage']['tracks']
                      >).map((tKey) => (
                        <div key={tKey}>
                          <label className={GLASS_LABEL}>{tKey} Track Label</label>
                          <input
                            type="text"
                            value={cms.contactPage.tracks[tKey]}
                            onChange={(e) =>
                              onChangeCms({
                                ...cms,
                                contactPage: {
                                  ...cms.contactPage,
                                  tracks: {
                                    ...cms.contactPage.tracks,
                                    [tKey]: e.target.value,
                                  },
                                },
                              })
                            }
                            className={GLASS_INPUT}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PIN-Verified Password Update */}
                  <form onSubmit={handleAuthenticatedPwdUpdate} className={GLASS_CARD}>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#e5c158]" />
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#e5c158]">
                        Update Admin Password (Requires Recovery PIN)
                      </h3>
                    </div>

                    {secMsg && (
                      <div
                        className={`rounded-xl px-3.5 py-2.5 text-xs border ${
                          secMsg.type === 'ok'
                            ? 'bg-[#e5c158]/10 border-[#e5c158]/35 text-[#f4e5b5]'
                            : 'bg-red-500/10 border-red-400/35 text-red-200'
                        }`}
                      >
                        {secMsg.text}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={GLASS_LABEL}>Admin Email</label>
                        <input
                          type="email"
                          required
                          value={secEmail}
                          onChange={(e) => setSecEmail(e.target.value)}
                          className={GLASS_INPUT}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>Recovery PIN</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          required
                          value={secPin}
                          onChange={(e) => setSecPin(e.target.value)}
                          placeholder="Numeric PIN"
                          className={`${GLASS_INPUT} font-mono-tech`}
                        />
                      </div>
                      <div>
                        <label className={GLASS_LABEL}>New Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={secNewPwd}
                          onChange={(e) => setSecNewPwd(e.target.value)}
                          placeholder="Min 6 chars"
                          className={GLASS_INPUT}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={secLoading}
                      className="px-5 py-2.5 rounded-xl bg-white text-[#080706] hover:bg-[#e5c158] font-display text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      {secLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                      <span>Update Admin Password</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </motion.div>
    </div>
  );
};
