import type { ReactNode } from 'react';
import { Check, Globe2, MonitorSmartphone, Plane } from 'lucide-react';
import { VisagoLogo } from '@/components/brand/Logo';

const BENEFITS = [
  'Access to visa dashboard',
  'Tailored Support',
  'Competitive Pricing',
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Airplane travel panel */}
      <section className="relative min-h-[46vh] lg:min-h-screen overflow-hidden order-2 lg:order-1">
        {/* Main airplane wing / sky shot */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        {/* Secondary airplane takeoff blend */}
        <div
          className="absolute inset-0 bg-cover bg-[center_30%] opacity-55 mix-blend-soft-light"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071428]/75 via-[#0B2A5A]/45 to-[#C62828]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071428]/70 via-transparent to-[#071428]/25" />

        {/* Soft software window over airplane scene */}
        <div className="absolute right-5 top-28 hidden xl:block w-[270px] rounded-2xl border border-white/25 bg-white/15 backdrop-blur-xl shadow-2xl overflow-hidden -rotate-2">
          <div className="h-8 bg-white/20 flex items-center gap-1.5 px-3">
            <span className="w-2 h-2 rounded-full bg-red-400/90" />
            <span className="w-2 h-2 rounded-full bg-amber-300/90" />
            <span className="w-2 h-2 rounded-full bg-emerald-400/90" />
            <span className="ml-2 text-[10px] text-white/80">Flight + Visa desk</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-white/90">
              <Plane className="w-3.5 h-3.5" />
              Online booking live
            </div>
            <div className="h-14 rounded-lg bg-gradient-to-r from-sky-400/40 to-brand-blue/50 border border-white/20 flex items-center justify-center">
              <Plane className="w-7 h-7 text-white/90" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-7 rounded bg-white/25 text-[9px] text-white/80 flex items-center justify-center">Visa</div>
              <div className="h-7 rounded bg-white/25 text-[9px] text-white/80 flex items-center justify-center">Passport</div>
            </div>
          </div>
        </div>

        {/* Floating plane badge */}
        <div className="absolute left-6 bottom-28 hidden md:flex items-center gap-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-md px-3.5 py-2 text-[12px] text-white shadow-lg">
          <Plane className="w-4 h-4" />
          Fly more · Process visas faster
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 text-white">
          <VisagoLogo variant="color" size="md" to="/home" />

          <div className="max-w-lg mt-10 lg:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1.5 text-[12px] font-medium backdrop-blur-md mb-5">
              <Plane className="w-3.5 h-3.5" />
              Air travel ready
              <span className="opacity-50">·</span>
              <MonitorSmartphone className="w-3.5 h-3.5" />
              Online visa software
            </div>

            <h1 className="text-[34px] md:text-[46px] font-semibold leading-[1.12] tracking-tight">
              Grow your travel business with{' '}
              <span className="text-[#FFB4B4]">Visago</span>
            </h1>

            <p className="mt-4 text-[15px] text-white/80 leading-relaxed">
              From flight-ready travelers to online visa filings — manage passport and visa bookings in one agent portal.
            </p>

            <ul className="mt-8 space-y-3">
              {BENEFITS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] text-white/95">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-300" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[12px] text-white/65 mt-10">
            <Globe2 className="w-3.5 h-3.5" />
            Airports worldwide · Secure online visa processing
          </div>
        </div>
      </section>

      {/* Form panel */}
      <section className="relative order-1 lg:order-2 flex items-center justify-center px-6 py-10 md:px-12 bg-[linear-gradient(165deg,#F5FAFF_0%,#EEF4FB_50%,#F8FAFC_100%)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-brand-blue/15 blur-3xl" />

        {/* Decorative airplane silhouette */}
        <Plane className="pointer-events-none absolute right-10 top-16 w-24 h-24 text-sky-200/70 rotate-12" />
        <Plane className="pointer-events-none absolute left-8 bottom-16 w-16 h-16 text-brand-blue/10 -rotate-6" />

        <div className="relative w-full max-w-[420px]">
          <div className="mb-6 lg:hidden">
            <VisagoLogo variant="color" size="sm" to="/home" />
          </div>
          <div className="bg-white rounded-[18px] border border-[#E6EAF0] shadow-[0_24px_60px_rgba(15,23,42,0.10)] p-7 md:p-8">
            {children}
          </div>
          <p className="mt-5 text-center text-[11px] text-[#94A3B8]">
            Fly ready · Book visas & passports online
          </p>
        </div>
      </section>
    </div>
  );
}
