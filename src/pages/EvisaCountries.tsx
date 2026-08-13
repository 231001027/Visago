import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { EVISA_COUNTRIES } from '@/data/evisa';

export default function EvisaCountries() {
  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-[28px] md:text-[34px] font-semibold text-ink">eVisa Countries</h1>
      <p className="mt-2 text-[14px] text-sub max-w-2xl">
        Choose a destination to view processing time, required documents, eVisa cost, handling fee and bank charges — then start your application online.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EVISA_COUNTRIES.map((c) => (
          <Link
            key={c.id}
            to={`/evisa-countries/${c.id}`}
            className="group bg-white rounded-[14px] border border-[#E8ECF1] p-5 hover:border-brand-blue/40 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-sub">{c.region}</p>
                <h2 className="text-[20px] font-semibold text-ink mt-0.5">{c.name}</h2>
              </div>
              <MapPin className="w-5 h-5 text-[#C62828]" />
            </div>
            <p className="mt-2 text-[12px] text-sub leading-relaxed line-clamp-2">{c.summary}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-[8px] bg-[#F5F8FC] px-2.5 py-2">
                <p className="text-sub">Processing</p>
                <p className="font-semibold text-ink mt-0.5">{c.processing}</p>
              </div>
              <div className="rounded-[8px] bg-[#F5F8FC] px-2.5 py-2">
                <p className="text-sub">From</p>
                <p className="font-semibold text-brand-blue mt-0.5">
                  ₹ {(c.visaFee + c.handlingFee).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[12px] font-semibold text-brand-blue inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              View fees & apply <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
