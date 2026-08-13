const WALLET_KEY = 'visago_wallet_balance';
const TXN_KEY = 'visago_payment_txns';

export type PaymentResult = {
  ok: true;
  paymentId: string;
  amount: number;
  mode: 'razorpay' | 'demo';
} | {
  ok: false;
  cancelled?: boolean;
  message: string;
};

export type PaymentTxn = {
  id: string;
  amount: number;
  purpose: string;
  mode: 'razorpay' | 'demo';
  createdAt: string;
};

export function getWalletBalance(): number {
  const raw = localStorage.getItem(WALLET_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function setWalletBalance(amount: number): void {
  localStorage.setItem(WALLET_KEY, String(Math.max(0, Math.round(amount))));
  window.dispatchEvent(new Event('visago-wallet'));
}

export function creditWallet(amount: number): number {
  const next = getWalletBalance() + amount;
  setWalletBalance(next);
  return next;
}

export function debitWallet(amount: number): { ok: boolean; balance: number; message?: string } {
  const bal = getWalletBalance();
  if (amount > bal) return { ok: false, balance: bal, message: 'Insufficient wallet balance' };
  const next = bal - amount;
  setWalletBalance(next);
  return { ok: true, balance: next };
}

export function listTransactions(): PaymentTxn[] {
  try {
    return JSON.parse(localStorage.getItem(TXN_KEY) || '[]') as PaymentTxn[];
  } catch {
    return [];
  }
}

function saveTransaction(txn: PaymentTxn): void {
  const list = [txn, ...listTransactions()].slice(0, 50);
  localStorage.setItem(TXN_KEY, JSON.stringify(list));
}

export function getRazorpayKey(): string {
  return (import.meta.env.VITE_RAZORPAY_KEY_ID || '').trim();
}

export function isRazorpayConfigured(): boolean {
  return getRazorpayKey().startsWith('rzp_');
}

function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-visago-razorpay]');
    if (existing) {
      existing.addEventListener('load', () => resolve(!!window.Razorpay));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.visagoRazorpay = '1';
    script.onload = () => resolve(!!window.Razorpay);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function startPayment(params: {
  amount: number;
  purpose: string;
  name?: string;
  email?: string;
  contact?: string;
  preferDemo?: boolean;
  /** Preferred checkout method — defaults to UPI */
  method?: 'upi' | 'card' | 'netbanking' | 'all';
  /** UPI VPA e.g. name@okaxis / name@ybl */
  upiId?: string;
}): Promise<PaymentResult> {
  const amount = Math.round(params.amount);
  if (!Number.isFinite(amount) || amount < 1) {
    return { ok: false, message: 'Enter a valid amount (minimum ₹1)' };
  }

  const method = params.method ?? 'upi';
  const upiId = (params.upiId || '').trim().toLowerCase();

  if (method === 'upi' && upiId && !/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upiId)) {
    return { ok: false, message: 'Enter a valid UPI ID (example: yourname@okaxis)' };
  }

  const useRazorpay = !params.preferDemo && isRazorpayConfigured();

  if (useRazorpay) {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      return { ok: false, message: 'Unable to load Razorpay. Check your network or use demo mode.' };
    }

    return new Promise((resolve) => {
      const options: RazorpayOptions = {
        key: getRazorpayKey(),
        amount: amount * 100,
        currency: 'INR',
        name: 'Visago',
        description: params.purpose,
        image: '/visago-icon.png',
        prefill: {
          name: params.name || 'Travel Agency',
          email: params.email || 'agent@visago.com',
          contact: params.contact || '',
          ...(method === 'upi' ? { method: 'upi' as const } : {}),
          ...(method === 'upi' && upiId ? { vpa: upiId } : {}),
          ...(method === 'card' ? { method: 'card' as const } : {}),
          ...(method === 'netbanking' ? { method: 'netbanking' as const } : {}),
        },
        method: {
          upi: method === 'upi' || method === 'all',
          card: method === 'card' || method === 'all',
          netbanking: method === 'netbanking' || method === 'all',
          wallet: method === 'all',
          emi: false,
        },
        notes: {
          purpose: params.purpose,
          ...(upiId ? { upi_id: upiId } : {}),
        },
        theme: { color: '#2563EB' },
        handler: (response) => {
          const paymentId = response.razorpay_payment_id;
          saveTransaction({
            id: paymentId,
            amount,
            purpose: params.purpose,
            mode: 'razorpay',
            createdAt: new Date().toISOString(),
          });
          resolve({ ok: true, paymentId, amount, mode: 'razorpay' });
        },
        modal: {
          ondismiss: () => resolve({ ok: false, cancelled: true, message: 'Payment cancelled' }),
        },
      };

      // Push UPI block to the top of Razorpay checkout
      if (method === 'upi') {
        options.config = {
          display: {
            blocks: {
              upi: {
                name: 'Pay with UPI ID',
                instruments: [{ method: 'upi' }],
              },
            },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: true },
          },
        };
      }

      const rzp = new window.Razorpay!(options);

      rzp.on('payment.failed', (res) => {
        resolve({ ok: false, message: res.error?.description || 'Payment failed' });
      });

      rzp.open();
    });
  }

  // Demo gateway — simulates a successful online payment
  if (method === 'upi' && !upiId) {
    return { ok: false, message: 'Enter your UPI ID to continue' };
  }

  const paymentId = `demo_${Date.now()}`;
  await new Promise((r) => setTimeout(r, 900));
  saveTransaction({
    id: paymentId,
    amount,
    purpose: params.purpose,
    mode: 'demo',
    createdAt: new Date().toISOString(),
  });
  return { ok: true, paymentId, amount, mode: 'demo' };
}
