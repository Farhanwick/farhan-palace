import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const ROOT_DIR = import.meta.dirname;
const DATA_DIR = path.resolve(ROOT_DIR, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'palace-store.json');

// Session signing key from env or ephemeral CSPRNG secret in memory
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');

const DEFAULT_ADMIN_EMAIL =
  (process.env.ADMIN_EMAIL || 'farhanislam0909@gmail.com').trim().toLowerCase();

interface StoredCredential {
  email: string;
  passwordSalt: string;
  passwordHash: string;
  pinSalt: string;
  pinHash: string;
  updatedAt: string;
}

interface PalaceStoreData {
  adminCredential: StoredCredential | null;
  siteContent: Record<string, unknown> | null;
}

// Simple sliding-window rate limiter for auth endpoints
const authAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = authAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    authAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) {
    return false;
  }
  entry.count += 1;
  return true;
}

function ensureStoreLoaded(): PalaceStoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const empty: PalaceStoreData = { adminCredential: null, siteContent: null };
    fs.writeFileSync(STORE_PATH, JSON.stringify(empty, null, 2), 'utf8');
    return empty;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PalaceStoreData>;
    return {
      adminCredential: parsed.adminCredential ?? null,
      siteContent: parsed.siteContent ?? null,
    };
  } catch {
    return { adminCredential: null, siteContent: null };
  }
}

function writeStore(data: PalaceStoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpPath, STORE_PATH);
}

function hashSecret(value: string, existingSalt?: string): { salt: string; hash: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(value, salt, 64).toString('hex');
  return { salt, hash: derived };
}

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyScryptSecret(candidate: string, salt: string, expectedHash: string): boolean {
  const { hash } = hashSecret(candidate, salt);
  return safeEqualStrings(hash, expectedHash);
}

function getEnvAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || '').trim();
}

function getEnvRecoveryPin(): string {
  return (process.env.ADMIN_RECOVERY_PIN || '').trim();
}

function isCredentialInitialized(store: PalaceStoreData): boolean {
  return Boolean(getEnvAdminPassword() || store.adminCredential);
}

function signSessionToken(email: string): string {
  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string): { email: string; exp: number } | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!payload || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  if (!safeEqualStrings(sig, expectedSig)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: string;
      exp?: number;
    };
    if (!decoded.email || typeof decoded.exp !== 'number' || Date.now() > decoded.exp) {
      return null;
    }
    return { email: decoded.email, exp: decoded.exp };
  } catch {
    return null;
  }
}

interface AuthedRequest extends Request {
  adminEmail?: string;
}

function requireAdminAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const token = header.slice(7).trim();
  const session = verifySessionToken(token);
  if (!session) {
    res.status(401).json({ error: 'Invalid or expired admin session' });
    return;
  }
  req.adminEmail = session.email;
  next();
}

// Sanitize dynamic URLs recursively inside saved CMS payloads to block javascript:/data: XSS vectors
function sanitizeCmsPayload(value: unknown): unknown {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();
    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('vbscript:') ||
      lower.startsWith('data:text/html')
    ) {
      return '';
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeCmsPayload(item));
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      out[k] = sanitizeCmsPayload(v);
    }
    return out;
  }
  return value;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '2mb' }));

  // Admin initialization status (never leaks credentials)
  app.get('/api/admin/status', (_req: Request, res: Response) => {
    const store = ensureStoreLoaded();
    const envPwd = getEnvAdminPassword();
    res.json({
      initialized: isCredentialInitialized(store),
      usingEnvSecret: Boolean(envPwd),
      emailHint: store.adminCredential?.email || DEFAULT_ADMIN_EMAIL,
    });
  });

  // One-time first-run admin setup/claim when ADMIN_PASSWORD env is unset
  app.post('/api/admin/bootstrap', (req: Request, res: Response) => {
    const ip = req.ip || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
      return;
    }

    const store = ensureStoreLoaded();
    if (isCredentialInitialized(store)) {
      res.status(409).json({ error: 'Admin account is already claimed. Please sign in.' });
      return;
    }

    const { email, password, pin } = (req.body || {}) as {
      email?: unknown;
      password?: unknown;
      pin?: unknown;
    };

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPwd = typeof password === 'string' ? password : '';
    const cleanPin = typeof pin === 'string' ? pin.trim() : '';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      res.status(400).json({ error: 'Enter a valid admin email address.' });
      return;
    }
    if (cleanPwd.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }
    if (!/^\d{4,10}$/.test(cleanPin)) {
      res.status(400).json({ error: 'Recovery PIN must be 4 to 10 digits.' });
      return;
    }

    const pwdHashed = hashSecret(cleanPwd);
    const pinHashed = hashSecret(cleanPin);

    store.adminCredential = {
      email: cleanEmail,
      passwordSalt: pwdHashed.salt,
      passwordHash: pwdHashed.hash,
      pinSalt: pinHashed.salt,
      pinHash: pinHashed.hash,
      updatedAt: new Date().toISOString(),
    };
    writeStore(store);

    const token = signSessionToken(cleanEmail);
    res.json({ token, email: cleanEmail });
  });

  // Admin password sign-in
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const ip = req.ip || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({ error: 'Too many login attempts. Please wait a minute.' });
      return;
    }

    const store = ensureStoreLoaded();
    if (!isCredentialInitialized(store)) {
      res.status(400).json({ error: 'Admin credentials not initialized yet.' });
      return;
    }

    const { email, password } = (req.body || {}) as {
      email?: unknown;
      password?: unknown;
    };

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPwd = typeof password === 'string' ? password : '';

    const envPwd = getEnvAdminPassword();
    const expectedEmail = store.adminCredential?.email || DEFAULT_ADMIN_EMAIL;

    const emailMatches = safeEqualStrings(cleanEmail, expectedEmail);
    let passwordMatches = false;

    if (envPwd && !store.adminCredential?.updatedAt) {
      passwordMatches = safeEqualStrings(cleanPwd, envPwd);
    } else if (store.adminCredential) {
      passwordMatches = verifyScryptSecret(
        cleanPwd,
        store.adminCredential.passwordSalt,
        store.adminCredential.passwordHash
      );
      if (!passwordMatches && envPwd) {
        passwordMatches = safeEqualStrings(cleanPwd, envPwd);
      }
    } else if (envPwd) {
      passwordMatches = safeEqualStrings(cleanPwd, envPwd);
    }

    if (!emailMatches || !passwordMatches) {
      res.status(401).json({ error: 'Invalid admin email or password.' });
      return;
    }

    const token = signSessionToken(expectedEmail);
    res.json({ token, email: expectedEmail });
  });

  // Forgot password reset verified via Recovery PIN
  app.post('/api/admin/reset-password', (req: Request, res: Response) => {
    const ip = req.ip || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({ error: 'Too many attempts. Please wait a minute.' });
      return;
    }

    const store = ensureStoreLoaded();
    const envPin = getEnvRecoveryPin();
    if (!store.adminCredential && !envPin) {
      res.status(400).json({ error: 'No recovery PIN has been configured yet.' });
      return;
    }

    const { email, pin, newPassword } = (req.body || {}) as {
      email?: unknown;
      pin?: unknown;
      newPassword?: unknown;
    };

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPin = typeof pin === 'string' ? pin.trim() : '';
    const cleanNewPwd = typeof newPassword === 'string' ? newPassword : '';

    if (cleanNewPwd.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }

    const expectedEmail = store.adminCredential?.email || DEFAULT_ADMIN_EMAIL;
    const emailMatches = safeEqualStrings(cleanEmail, expectedEmail);

    let pinMatches = false;
    if (envPin) {
      pinMatches = safeEqualStrings(cleanPin, envPin);
    }
    if (!pinMatches && store.adminCredential) {
      pinMatches = verifyScryptSecret(
        cleanPin,
        store.adminCredential.pinSalt,
        store.adminCredential.pinHash
      );
    }

    if (!emailMatches || !pinMatches) {
      res.status(403).json({ error: 'Email or Recovery PIN is incorrect.' });
      return;
    }

    const pwdHashed = hashSecret(cleanNewPwd);
    const pinRecord = store.adminCredential
      ? {
          pinSalt: store.adminCredential.pinSalt,
          pinHash: store.adminCredential.pinHash,
        }
      : hashSecret(cleanPin);

    store.adminCredential = {
      email: expectedEmail,
      passwordSalt: pwdHashed.salt,
      passwordHash: pwdHashed.hash,
      pinSalt: 'pinSalt' in pinRecord ? pinRecord.pinSalt : pinRecord.salt,
      pinHash: 'pinHash' in pinRecord ? pinRecord.pinHash : pinRecord.hash,
      updatedAt: new Date().toISOString(),
    };
    writeStore(store);

    const token = signSessionToken(expectedEmail);
    res.json({ token, email: expectedEmail, message: 'Password updated cleanly.' });
  });

  // Verify Bearer session token
  app.get('/api/admin/verify', requireAdminAuth, (req: AuthedRequest, res: Response) => {
    res.json({ valid: true, email: req.adminEmail });
  });

  // Public CMS read
  app.get('/api/cms', (_req: Request, res: Response) => {
    const store = ensureStoreLoaded();
    res.json({ siteContent: store.siteContent });
  });

  // Protected CMS update
  app.put('/api/cms', requireAdminAuth, (req: AuthedRequest, res: Response) => {
    const incoming = req.body as { siteContent?: unknown };
    if (!incoming || !incoming.siteContent || typeof incoming.siteContent !== 'object') {
      res.status(400).json({ error: 'Valid siteContent payload is required.' });
      return;
    }

    const sanitized = sanitizeCmsPayload(incoming.siteContent) as Record<string, unknown>;
    const store = ensureStoreLoaded();
    store.siteContent = sanitized;
    writeStore(store);

    res.json({ saved: true, updatedAt: new Date().toISOString(), siteContent: store.siteContent });
  });

  // Protected CMS reset to defaults (preserves admin credentials)
  app.post('/api/cms/reset', requireAdminAuth, (_req: AuthedRequest, res: Response) => {
    const store = ensureStoreLoaded();
    store.siteContent = null;
    writeStore(store);
    res.json({ reset: true });
  });

  // Serve static public media (fast-start hero video + photography) directly with byte-range & cache headers
  const publicDir = path.resolve(ROOT_DIR, 'public');
  const srcImagesDir = path.resolve(ROOT_DIR, 'src/assets/images');
  app.use(
    express.static(publicDir, {
      index: false,
      etag: true,
      lastModified: true,
      acceptRanges: true,
      maxAge: IS_PROD ? '7d' : '1h',
    })
  );
  if (fs.existsSync(srcImagesDir)) {
    app.use(
      '/src/assets/images',
      express.static(srcImagesDir, {
        index: false,
        etag: true,
        lastModified: true,
        maxAge: IS_PROD ? '7d' : '1h',
      })
    );
  }

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(ROOT_DIR, 'dist');
    app.use(
      express.static(distDir, {
        index: false,
        maxAge: '7d',
        etag: true,
      })
    );
    app.use((_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FARHAN PALACE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
