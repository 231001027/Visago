import { useEffect, useState } from 'react';
import { CreditCard, Loader2, ShieldCheck, X, Smartphone } from 'lucide-react';
import { isRazorpayConfigured, startPayment, type PaymentResult } from '@/lib/payments';

type PayMethod = 'upi' | 'card' | 'netbanking' | 'all';

type Props = {
  open: boolean;
  amount: number;
  purpose: string;
  onClose: () => void;
  onSuccess: (result: Extract<PaymentResult, { ok: true }>) => void;
  onError?: (message: string) => void;
};

const METHODS: { id: PayMethod; label: string }[] = [
  { id: 'upi', label: 'UPI ID' },
  { id: 'card', label: 'Cards' },
  { id: 'netbanking', label: 'Netbanking' },
  { id: 'all', label: 'All' },
];

export function PaymentModal({ open, amount, purpose, onClose, onSuccess, onError }: Props) {
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState<PayMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const razorpayReady = isRazorpayConfigured();

  useEffect(() => {
    if (!open) {
      setPaying(false);
      setMethod('upi');
      setUpiId('');
    }
  }, [open]);

  if (!open) return null;

  const pay = async (preferDemo = false) => {
    if (method === 'upi' && !upiId.trim()) {
      onError?.('Enter your UPI ID (example: yourname@okaxis)');
      return;
    }

    setPaying(true);
    const result = await startPayment({
      amount,
      purpose,
      preferDemo,
      method,
      upiId: method === 'upi' ? upiId.trim() : undefined,
    });
    setPaying(false);
    if (result.ok) {
      onSuccess(result);
      onClose();
      return;
    }
    if (!result.cancelled) onError?.(result.message);
    if (result.cancelled) onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45" onClick={() => !paying && onClose()} />
      <div className="relative w-full max-w-md bg-white rounded-[14px] shadow-2xl border border-[#E8ECF1] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-brand-blue to-brand-dark text-white">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <h3 className="text-[14px] font-semibold">Payment Gateway</h3>
          </div>
          <button type="button" disabled={paying} onClick={onClose} className="hover:opacity-80 disabled:opacity-40">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-[10px] bg-[#F5F8FC] border border-[#E3E8EF] p-4">
            <p className="text-[11px] uppercase tracking-wide text-sub">Paying for</p>
            <p className="text-[14px] font-semibold text-ink mt-0.5">{purpose}</p>
            <p className="text-[28px] font-semibold text-brand-blue mt-2 leading-none">
              ₹ {amount.toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            <p className="text-[12px] font-medium text-ink mb-2">Select payment method</p>
            <div className="grid grid-cols-4 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={paying}
                  onClick={() => setMethod(m.id)}
                  className={`rounded-[8px] border py-2 text-[11px] font-medium transition-colors ${
                    method === m.id
                      ? 'border-brand-blue bg-brand-light text-brand-blue'
                      : 'border-[#E3E8EF] bg-white text-ink hover:bg-gray-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {method === 'upi' && (
            <div>
              <label className="block text-[12px] font-medium text-ink mb-1.5">
                UPI ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A93A0]" />
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okaxis / yourname@ybl"
                  autoComplete="off"
                  disabled={paying}
                  className="w-full h-[42px] pl-10 pr-3 rounded-[8px] bg-[#EEF5FB] border border-[#D7E3EF] text-[13px] outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-sub">
                Test UPI (Razorpay): <span className="font-mono text-ink">success@razorpay</span>
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 text-[12px] text-sub leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            {razorpayReady
              ? method === 'upi'
                ? 'Razorpay will open with UPI selected. Your UPI ID is sent to checkout for collect request.'
                : 'Payment opens in secure Razorpay checkout.'
              : 'Demo mode active. Add VITE_RAZORPAY_KEY_ID for live Razorpay UPI.'}
          </div>

          <button
            type="button"
            disabled={paying}
            onClick={() => pay(false)}
            className="w-full h-[42px] rounded-[8px] bg-brand-blue hover:bg-brand-dark text-white text-[13px] font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : method === 'upi' ? <Smartphone className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
            {paying
              ? 'Processing…'
              : razorpayReady
                ? method === 'upi'
                  ? 'Pay with UPI'
                  : 'Pay with Razorpay'
                : 'Pay now (Demo)'}
          </button>

          {razorpayReady && (
            <button
              type="button"
              disabled={paying}
              onClick={() => pay(true)}
              className="w-full h-[38px] rounded-[8px] border border-[#D5D9DE] text-[12px] text-sub hover:bg-gray-50 disabled:opacity-60"
            >
              Use demo payment instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
