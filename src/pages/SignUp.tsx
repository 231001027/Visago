import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, RotateCcw, Building2, Mail, Phone, Lock, Users } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { homePathForRole, sendOtp, signIn, verifyOtp, type UserRole } from '@/lib/auth';

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('b2b');
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirm: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const reset = () => {
    setForm({ name: '', email: '', mobile: '', password: '', confirm: '' });
    setOtp('');
    setOtpSent(false);
    setDemoOtp('');
    setError('');
  };

  const requestOtp = () => {
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim() || !form.password.trim()) {
      setError('Fill all fields before sending OTP');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    const code = sendOtp(form.email.trim(), form.mobile.trim());
    setDemoOtp(code);
    setOtpSent(true);
    setError('');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim() || !form.password.trim()) {
      setError('Please fill all required fields');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!otpSent) {
      setError('OTP must be sent to registered mobile and email');
      return;
    }
    const check = verifyOtp(otp);
    if (!check.ok) {
      setError(check.message);
      return;
    }
    signIn({
      role,
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
    });
    navigate(homePathForRole(role));
  };

  const fieldClass =
    'w-full h-[44px] pl-10 pr-3 rounded-[6px] bg-[#EEF5FB] border border-[#D7E3EF] text-[13px] outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20';

  return (
    <AuthShell>
      <h2 className="text-center text-[26px] font-semibold text-brand-blue mb-2">Sign Up</h2>
      <p className="text-center text-[12px] text-sub mb-5">Confirm with OTP on mobile & email</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button type="button" onClick={() => setRole('b2b')} className={`h-[40px] rounded-[8px] text-[12px] font-medium inline-flex items-center justify-center gap-1.5 border ${role === 'b2b' ? 'border-brand-blue bg-brand-light text-brand-blue' : 'border-[#E3E8EF]'}`}>
          <Building2 className="w-3.5 h-3.5" /> B2B Agent
        </button>
        <button type="button" onClick={() => setRole('b2c')} className={`h-[40px] rounded-[8px] text-[12px] font-medium inline-flex items-center justify-center gap-1.5 border ${role === 'b2c' ? 'border-brand-blue bg-brand-light text-brand-blue' : 'border-[#E3E8EF]'}`}>
          <Users className="w-3.5 h-3.5" /> B2C Client
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3.5">
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={role === 'b2b' ? 'Company / Agency Name' : 'Full Name'} className={fieldClass} />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email" className={fieldClass} />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
          <input type="tel" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="Mobile Number" className={fieldClass} />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
          <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Password" className={`${fieldClass} pr-10`} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A93A0]">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
          <input type={showPassword ? 'text' : 'password'} value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Confirm Password" className={fieldClass} />
        </div>

        <div className="flex gap-2">
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP from mobile & email" className="flex-1 h-[44px] px-3 rounded-[6px] bg-[#EEF5FB] border border-[#D7E3EF] text-[13px] outline-none focus:border-brand-blue" />
          <button type="button" onClick={requestOtp} className="h-[44px] px-3 rounded-[6px] bg-[#5B6570] text-white text-[12px] font-medium whitespace-nowrap">Send OTP</button>
        </div>
        {otpSent && (
          <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-[6px] px-3 py-2">
            OTP sent to registered mobile & email (demo: <span className="font-mono font-semibold">{demoOtp}</span>)
          </p>
        )}

        {error && <p className="text-[12px] text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button type="submit" className="h-[42px] rounded-[6px] bg-brand-blue hover:bg-brand-dark text-white text-[13px] font-medium inline-flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Sign Up
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

      <Link to="/sign-in" className="h-[42px] w-full rounded-[6px] bg-[#5B6570] text-white text-[13px] font-medium inline-flex items-center justify-center gap-2">
        Already have an account? Sign In
      </Link>
    </AuthShell>
  );
}
