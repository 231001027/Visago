import { Link } from 'react-router-dom';
import { Building2, Users, Plane } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-content mx-auto px-5 py-12 md:py-16">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-blue">About Us</p>
      <h1 className="mt-2 text-[32px] md:text-[40px] font-semibold text-ink leading-tight max-w-2xl">
        DU Visas — passport & eVisa bookings online
      </h1>
      <p className="mt-4 text-[15px] text-sub leading-relaxed max-w-3xl">
        DU Visas is built for travel businesses and individual travelers who need a reliable online channel to register visa applications,
        upload required documents, and pay service charges securely. We support both B2B travel agents and B2C clients on one platform.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: Building2, title: 'For travel agents (B2B)', text: 'Agency profiles, bulk applications, wallet recharge and pending payments in one portal.' },
          { icon: Users, title: 'For clients (B2C)', text: 'Simple signup with OTP confirmation, country selection, application forms and online payment.' },
          { icon: Plane, title: 'Multi-country eVisas', text: 'UAE, Georgia, Vietnam, Cambodia, Saudi Arabia, New Zealand, Australia and more destinations.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-[14px] border border-[#E8ECF1] p-5">
            <item.icon className="w-6 h-6 text-[#C62828]" />
            <h3 className="mt-3 text-[16px] font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-[13px] text-sub leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[14px] bg-gradient-to-r from-brand-blue to-brand-dark text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold">Ready to start an application?</h2>
          <p className="text-[13px] text-white/80 mt-1">Browse eVisa countries or create your account with mobile & email OTP.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/evisa-countries" className="h-[40px] px-4 rounded-[8px] bg-white text-brand-blue text-[13px] font-semibold inline-flex items-center">
            eVisa Countries
          </Link>
          <Link to="/sign-up" className="h-[40px] px-4 rounded-[8px] border border-white/40 text-[13px] font-semibold inline-flex items-center">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
