import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, RotateCcw, UserRound, Building2, Users, Smartphone } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { getUser, homePathForRole, sendOtp, signIn, verifyOtp, type UserRole } from '@/lib/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('b2b');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setEmail('');
    setPassword('');
    setMobile('');
    setOtp('');
    setOtpSent(false);
    setDemoOtp('');
    setError('');
  };

  const requestOtp = () => {
    if (!email.trim() || !mobile.trim() || !password.trim()) {
      setError('Enter email, mobile and password first');
      return;
    }
    const code = sendOtp(email.trim(), mobile.trim());
    setDemoOtp(code);
    setOtpSent(true);
    setError('');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !mobile.trim()) {
      setError('Please fill email, mobile and password');
      return;
    }
    if (!otpSent) {
      setError('Send OTP to mobile & email to continue');
      return;
    }
    const check = verifyOtp(otp);
    if (!check.ok) {
      setError(check.message);
      return;
    }
    signIn({
      role,
      name: role === 'b2b' ? 'Travel Agency' : 'Client User',
      email: email.trim(),
      mobile: mobile.trim(),
    });
    navigate(homePathForRole(role));
  };

  return (
    <AuthShell>
      <h2 className="text-center text-[26px] font-semibold text-brand-blue mb-2">Sign In</h2>
      <p className="text-center text-[12px] text-sub mb-5">Travel agents (B2B) and clients (B2C)</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setRole('b2b')}
          className={`h-[40px] rounded-[8px] text-[12px] font-medium inline-flex items-center justify-center gap-1.5 border ${
            role === 'b2b' ? 'border-brand-blue bg-brand-light text-brand-blue' : 'border-[#E3E8EF]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> B2B Agent
        </button>
        <button
          type="button"
          onClick={() => setRole('b2c')}
          className={`h-[40px] rounded-[8px] text-[12px] font-medium inline-flex items-center justify-center gap-1.5 border ${
            role === 'b2c' ? 'border-brand-blue bg-brand-light text-brand-blue' : 'border-[#E3E8EF]'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> B2C Client
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <div className="relative">
          <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-[44px] pl-10 pr-3 rounded-[6px] bg-[#EEF5FB] border border-[#D7E3EF] text-[13px] outline-none focus:border-brand-blue"
          />
        </div>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Registered mobile"
            className="w-full h-[44px] pl-10 pr-3 rounded-[6px] bg-[#EEF5FB] border border-[#D7E3EF] text-[13px] outline-none focus:border-brand-blue"
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-[44px] pl-3 pr-10 rounded-[6px] bg-[#EEF5FB] border border-[#D7E3EF] text-[13px] outline-none focus:border-brand-blue"
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A93A0]">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="flex-1 h-[44px] px-3 rounded-[6px] bg-[#EEF5FB] border border-[#D7E3EF] text-[13px] outline-none focus:border-brand-blue"
          />
          <button
            type="button"
            onClick={requestOtp}
            className="h-[44px] px-3 rounded-[6px] bg-[#5B6570] text-white text-[12px] font-medium whitespace-nowrap"
          >
            Send OTP
          </button>
        </div>
        {otpSent && (
          <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-[6px] px-3 py-2">
            OTP sent to email & mobile (demo code: <span className="font-mono font-semibold">{demoOtp}</span>)
          </p>
        )}

        {error && <p className="text-[12px] text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button type="submit" className="h-[42px] rounded-[6px] bg-brand-blue hover:bg-brand-dark text-white text-[13px] font-medium inline-flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
          <button type="button" onClick={reset} className="h-[42px] rounded-[6px] bg-[#5B6570] text-white text-[13px] font-medium inline-flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E1E5EA]" /></div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] text-[#8A93A0] border border-[#E1E5EA] rounded-full w-8 h-8 flex items-center justify-center">OR</span>
        </div>
      </div>

      <Link to="/sign-up" className="h-[42px] w-full rounded-[6px] bg-[#5B6570] hover:bg-[#4A535C] text-white text-[13px] font-medium inline-flex items-center justify-center gap-2">
        <LogIn className="w-4 h-4" /> Sign Up
      </Link>
      <p className="mt-4 text-center text-[11px] text-sub">
        Already signed in as {getUser()?.role?.toUpperCase() || 'guest'}? Use portal after OTP login.
      </p>
    </AuthShell>
  );
}
