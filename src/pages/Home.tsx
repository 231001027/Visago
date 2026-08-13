import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, CreditCard } from 'lucide-react';
import { EVISA_COUNTRIES } from '@/data/evisa';

export default function Home() {
  const featured = EVISA_COUNTRIES.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B3A]/90 via-[#0B1B3A]/70 to-[#C62828]/35" />
        <div className="relative max-w-content mx-auto px-5 py-20 md:py-28 text-white">
          <p className="inline-flex items-center gap-2 text-[12px] font-medium bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-5">
            <Globe2 className="w-3.5 h-3.5" /> Online eVisa & passport platform
          </p>
          <h1 className="text-[36px] md:text-[52px] font-semibold leading-tight max-w-2xl">
            Book eVisas online for travel agents and clients
          </h1>
          <p className="mt-4 text-[16px] text-white/80 max-w-xl leading-relaxed">
            DU Visas helps B2B agencies and B2C travelers apply, upload documents, and pay securely — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/evisa-countries" className="h-[42px] px-5 rounded-[8px] bg-white text-brand-blue text-[13px] font-semibold inline-flex items-center gap-2">
              View eVisa Countries <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/sign-up" className="h-[42px] px-5 rounded-[8px] border border-white/40 text-white text-[13px] font-semibold inline-flex items-center">
              Sign Up (B2B / B2C)
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: CheckCircle2, title: 'Visa registration', text: 'Capture name, address, passport, mobile and email in guided forms.' },
            { icon: ShieldCheck, title: 'Document uploads', text: 'Passport scans, photos, bank statements, IT returns and more.' },
            { icon: CreditCard, title: 'Secure payments', text: 'UPI, net banking, credit and debit cards with transparent fees.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-[14px] border border-[#E8ECF1] p-5 shadow-sm">
              <item.icon className="w-6 h-6 text-brand-blue" />
              <h3 className="mt-3 text-[16px] font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[13px] text-sub leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-[#E8ECF1]">
        <div className="max-w-content mx-auto px-5 py-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-[24px] font-semibold text-ink">Popular eVisa countries</h2>
              <p className="text-[13px] text-sub mt-1">UAE, Georgia, Vietnam, Cambodia, Saudi Arabia, Australia and more.</p>
            </div>
            <Link to="/evisa-countries" className="text-[13px] font-semibold text-brand-blue inline-flex items-center gap-1">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((c) => (
              <Link
                key={c.id}
                to={`/evisa-countries/${c.id}`}
                className="rounded-[12px] border border-[#E8ECF1] p-4 hover:border-brand-blue/40 hover:shadow-md transition-all bg-[#FBFCFE]"
              >
                <p className="text-[11px] uppercase tracking-wide text-sub">{c.region}</p>
                <h3 className="text-[18px] font-semibold text-ink mt-1">{c.name}</h3>
                <p className="text-[12px] text-sub mt-2 line-clamp-2">{c.summary}</p>
                <p className="text-[13px] font-semibold text-brand-blue mt-3">
                  From ₹ {(c.visaFee + c.handlingFee).toLocaleString('en-IN')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
