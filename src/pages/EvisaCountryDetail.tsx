import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, IndianRupee, ShieldCheck } from 'lucide-react';
import { calcFees, getEvisaCountry } from '@/data/evisa';
import { TextInput, DateInput, SelectInput, FormField, PrimaryButton, GrayButton } from '@/components/ui/primitives';
import { FileUpload } from '@/components/ui/FileUpload';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { useToast, Toast } from '@/components/ui/Modal';
import { isAuthenticated } from '@/lib/auth';

export default function EvisaCountryDetail() {
  const { id = '' } = useParams();
  const country = getEvisaCountry(id);
  const navigate = useNavigate();
  const { toast, show } = useToast();
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [payOpen, setPayOpen] = useState(false);
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    address: '',
    passportNo: '',
    mobile: '',
    email: '',
    dob: '',
    nationality: 'INDIAN',
    departure: '',
    return: '',
  });

  const fees = useMemo(() => (country ? calcFees(country, payMethod) : null), [country, payMethod]);

  if (!country || !fees) {
    return (
      <div className="max-w-content mx-auto px-5 py-16 text-center">
        <p className="text-[16px] font-semibold">Country not found</p>
        <Link to="/evisa-countries" className="text-brand-blue text-[13px] mt-3 inline-block">Back to countries</Link>
      </div>
    );
  }

  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const startPay = () => {
    if (!form.name || !form.passportNo || !form.mobile || !form.email || !form.address) {
      show('error', 'Please fill name, address, passport, mobile and email');
      return;
    }
    if (!isAuthenticated()) {
      show('info', 'Please sign in to continue payment');
      navigate('/sign-in');
      return;
    }
    setPayOpen(true);
  };

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <Toast toast={toast} />
      <PaymentModal
        open={payOpen}
        amount={fees.total}
        purpose={`${country.name} eVisa — ${form.name || 'Applicant'}`}
        onClose={() => setPayOpen(false)}
        onError={(m) => show('error', m)}
        onSuccess={(res) => {
          show('success', `Application paid (${res.paymentId}). Documents received for ${country.name}.`);
          navigate(isAuthenticated() ? '/dashboard' : '/home');
        }}
      />

      <Link to="/evisa-countries" className="inline-flex items-center gap-1.5 text-[13px] text-sub hover:text-brand-blue">
        <ArrowLeft className="w-4 h-4" /> All eVisa countries
      </Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[14px] border border-[#E8ECF1] p-5">
            <p className="text-[11px] uppercase tracking-wide text-sub">{country.region}</p>
            <h1 className="text-[28px] font-semibold text-ink mt-1">{country.name} eVisa</h1>
            <p className="mt-2 text-[14px] text-sub leading-relaxed">{country.summary}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
              <div className="rounded-[8px] bg-[#F5F8FC] p-3"><p className="text-sub">Processing</p><p className="font-semibold mt-1">{country.processing}</p></div>
              <div className="rounded-[8px] bg-[#F5F8FC] p-3"><p className="text-sub">Validity</p><p className="font-semibold mt-1">{country.validity}</p></div>
              <div className="rounded-[8px] bg-[#F5F8FC] p-3"><p className="text-sub">Entry</p><p className="font-semibold mt-1">{country.entry}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] border border-[#E8ECF1] p-5">
            <h2 className="text-[16px] font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-brand-blue" /> Visa application registration</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Full Name" required><TextInput value={form.name} onChange={(e) => set('name', e.target.value)} /></FormField>
              <FormField label="Passport Number" required><TextInput value={form.passportNo} onChange={(e) => set('passportNo', e.target.value)} /></FormField>
              <FormField label="Date of Birth"><DateInput value={form.dob} onChange={(e) => set('dob', e.target.value)} /></FormField>
              <FormField label="Nationality"><TextInput value={form.nationality} onChange={(e) => set('nationality', e.target.value)} /></FormField>
              <FormField label="Mobile Number" required><TextInput value={form.mobile} onChange={(e) => set('mobile', e.target.value)} /></FormField>
              <FormField label="Email" required><TextInput type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></FormField>
              <FormField label="Departure Date"><DateInput value={form.departure} onChange={(e) => set('departure', e.target.value)} /></FormField>
              <FormField label="Return Date"><DateInput value={form.return} onChange={(e) => set('return', e.target.value)} /></FormField>
              <div className="md:col-span-2">
                <FormField label="Address" required><TextInput value={form.address} onChange={(e) => set('address', e.target.value)} /></FormField>
              </div>
              {country.formFields.map((f) => (
                <FormField key={f.key} label={f.label} required={f.required}>
                  {f.type === 'select' ? (
                    <SelectInput value={extra[f.key] || ''} onChange={(e) => setExtra((s) => ({ ...s, [f.key]: e.target.value }))}>
                      <option value="">-- Select --</option>
                      {f.options?.map((o) => <option key={o}>{o}</option>)}
                    </SelectInput>
                  ) : f.type === 'date' ? (
                    <DateInput value={extra[f.key] || ''} onChange={(e) => setExtra((s) => ({ ...s, [f.key]: e.target.value }))} />
                  ) : (
                    <TextInput value={extra[f.key] || ''} onChange={(e) => setExtra((s) => ({ ...s, [f.key]: e.target.value }))} />
                  )}
                </FormField>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[14px] border border-[#E8ECF1] p-5">
            <h2 className="text-[16px] font-semibold mb-3">Required documents</h2>
            <ul className="mb-4 space-y-1.5 text-[13px] text-sub">
              {country.requiredDocs.map((d) => (
                <li key={d} className="flex gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />{d}</li>
              ))}
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload label="Scanned Passport Copy" status="" />
              <FileUpload label="Photograph" status="" />
              <FileUpload label="Bank Statement" status="" />
              <FileUpload label="IT Returns (2–3 years)" status="" />
              <FileUpload label="Flight / Hotel / Other Docs" status="" />
              <FileUpload label="Any Other Required Document" status="" />
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[14px] border border-[#E8ECF1] p-5">
            <h2 className="text-[16px] font-semibold flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#C62828]" /> Cost breakdown
            </h2>
            <div className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-sub">eVisa cost</span><span className="font-medium">₹ {fees.visaFee.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-sub">Handling fee</span><span className="font-medium">₹ {fees.handlingFee.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-sub">Bank charges ({payMethod})</span><span className="font-medium">₹ {fees.bankCharges.toLocaleString('en-IN')}</span></div>
              <div className="border-t border-[#E8ECF1] pt-2 flex justify-between text-[15px] font-semibold">
                <span>Total</span><span className="text-brand-blue">₹ {fees.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="mt-4 text-[12px] font-medium text-ink mb-2">Payment method</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['upi', 'UPI'],
                ['card', 'Card'],
                ['netbanking', 'Netbanking'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPayMethod(id)}
                  className={`h-[34px] rounded-[8px] text-[11px] font-medium border ${
                    payMethod === id ? 'border-brand-blue bg-brand-light text-brand-blue' : 'border-[#E3E8EF]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-sub">Credit/Debit card bank charges apply as shown. UPI usually has 0% gateway charge in this demo tariff.</p>

            <div className="mt-4 flex flex-col gap-2">
              <PrimaryButton onClick={startPay}>Pay & Submit Application</PrimaryButton>
              <GrayButton onClick={() => show('info', 'Draft saved locally (demo)')}>Save Draft</GrayButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
