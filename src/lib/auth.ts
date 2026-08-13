export type UserRole = 'b2b' | 'b2c';

export type AuthUser = {
  role: UserRole;
  name: string;
  email: string;
  mobile: string;
};

const AUTH_KEY = 'visago_auth';
const USER_KEY = 'visago_user';
const OTP_KEY = 'visago_otp_pending';

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

export function getUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function signIn(user: AuthUser): void {
  sessionStorage.setItem(AUTH_KEY, '1');
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function signOut(): void {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(OTP_KEY);
}

/** Demo OTP — returns the code so UI can show it in toast during development */
export function sendOtp(email: string, mobile: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  sessionStorage.setItem(
    OTP_KEY,
    JSON.stringify({ code, email, mobile, expires: Date.now() + 10 * 60 * 1000 })
  );
  return code;
}

export function verifyOtp(input: string): { ok: true } | { ok: false; message: string } {
  try {
    const raw = sessionStorage.getItem(OTP_KEY);
    if (!raw) return { ok: false, message: 'No OTP sent. Please request again.' };
    const data = JSON.parse(raw) as { code: string; expires: number };
    if (Date.now() > data.expires) return { ok: false, message: 'OTP expired. Please resend.' };
    if (input.trim() !== data.code) return { ok: false, message: 'Invalid OTP' };
    sessionStorage.removeItem(OTP_KEY);
    return { ok: true };
  } catch {
    return { ok: false, message: 'OTP verification failed' };
  }
}

export function homePathForRole(role?: UserRole | null): string {
  if (role === 'b2c') return '/evisa-countries';
  return '/dashboard';
}
