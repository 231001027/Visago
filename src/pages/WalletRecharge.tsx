import { useState } from 'react';
import { Wallet, RotateCcw, CreditCard, History } from 'lucide-react';
import { PageContainer, PageCard, CardBody } from '@/components/ui/layout';
import { TextInput, DateInput, SelectInput, FormField, CyanButton, GrayButton } from '@/components/ui/primitives';
import { useToast, Toast } from '@/components/ui/Modal';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { creditWallet, isRazorpayConfigured, listTransactions } from '@/lib/payments';
import { useWalletBalance } from '@/hooks/useWalletBalance';

export default function WalletRecharge() {
  const { toast, show } = useToast();
  const balance = useWalletBalance();
  const [amount, setAmount] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [mode, setMode] = useState('ONLINE');
  const today = new Date().toISOString().slice(0, 10);
  const txns = listTransactions().slice(0, 5);
  const payAmount = Number(amount);

  const reset = () => {
    setAmount('');
    show('info', 'Form reset');
  };

  const startPay = () => {
    if (!amount || !Number.isFinite(payAmount) || payAmount < 1) {
      show('error', 'Enter a valid recharge amount');
      return;
    }
    if (mode !== 'ONLINE') {
      show('info', `${mode} payments are recorded offline (demo). Use ONLINE for gateway.`);
      return;
    }
    setPayOpen(true);
  };

  return (
    <PageContainer>
      <Toast toast={toast} />
      <PaymentModal
        open={payOpen}
        amount={payAmount}
        purpose="Wallet Recharge — DU Visas"
        onClose={() => setPayOpen(false)}
        onError={(msg) => show('error', msg)}
        onSuccess={(res) => {
          const next = creditWallet(res.amount);
          show(
            'success',
            `Payment ${res.paymentId} successful. Wallet credited ₹${res.amount.toLocaleString('en-IN')} (balance ₹${next.toLocaleString('en-IN')})`
          );
          setAmount('');
        }}
      />

      <PageCard title="Wallet Recharge" icon={<Wallet className="w-4 h-4" />} headerStrip="gray">
        <CardBody>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="rounded-[10px] bg-brand-light border border-blue-100 px-4 py-2.5">
              <p className="text-[11px] text-sub">Current Wallet Balance</p>
              <p className="text-[22px] font-semibold text-brand-blue leading-none mt-1">
                ₹ {balance.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="rounded-[10px] bg-[#F8FAFC] border border-[#E3E8EF] px-4 py-2.5 text-[12px] text-sub">
              Gateway:{' '}
              <span className="font-semibold text-ink">
                {isRazorpayConfigured() ? 'Razorpay (live key loaded)' : 'Demo mode'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 max-w-3xl">
            <FormField label="Document Date"><DateInput defaultValue={today} /></FormField>
            <FormField label="Agent Name">
              <SelectInput defaultValue="TRAVEL AGENCY">
                <option>TRAVEL AGENCY</option>
              </SelectInput>
            </FormField>
            <FormField label="Payment Type">
              <SelectInput defaultValue="RECEIPT"><option>RECEIPT</option><option>PAYMENT</option></SelectInput>
            </FormField>
            <FormField label="Mode of Payment">
              <SelectInput value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>ONLINE</option>
                <option>CHEQUE</option>
                <option>NEFT</option>
                <option>CASH</option>
              </SelectInput>
            </FormField>
            <FormField label="Closing Balance">
              <div className="vb-input bg-[#E9EDF1] flex items-center">₹ {balance.toLocaleString('en-IN')}</div>
            </FormField>
          </div>

          <div className="mt-5 max-w-md">
            <FormField label="Recharge Amount" required>
              <TextInput
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                invalid={!amount}
              />
            </FormField>
            <div className="flex flex-wrap gap-2 mt-2">
              {[1000, 5000, 10000, 25000].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="px-2.5 py-1 rounded-[6px] border border-[#D5D9DE] text-[11px] hover:bg-brand-light hover:border-brand-blue/40"
                >
                  ₹ {q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <GrayButton onClick={reset}><RotateCcw className="w-3.5 h-3.5" /> Reset</GrayButton>
            <CyanButton onClick={startPay}>
              <CreditCard className="w-3.5 h-3.5" /> Pay with Gateway
            </CyanButton>
          </div>
        </CardBody>
      </PageCard>

      <PageCard title="Recent Gateway Payments" icon={<History className="w-4 h-4" />} className="mt-4" headerStrip="gray">
        <CardBody>
          {txns.length === 0 ? (
            <p className="text-[12px] text-sub">No payments yet. Recharge to see transactions here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] text-sub border-b border-[#E5E7EB]">
                    <th className="py-2 pr-3 font-semibold">Payment ID</th>
                    <th className="py-2 pr-3 font-semibold">Purpose</th>
                    <th className="py-2 pr-3 font-semibold">Amount</th>
                    <th className="py-2 pr-3 font-semibold">Mode</th>
                    <th className="py-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t.id} className="text-[12px] border-b border-[#F1F5F9]">
                      <td className="py-2.5 pr-3 font-mono text-[11px]">{t.id}</td>
                      <td className="py-2.5 pr-3">{t.purpose}</td>
                      <td className="py-2.5 pr-3 font-semibold">₹ {t.amount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 pr-3 uppercase">{t.mode}</td>
                      <td className="py-2.5">{new Date(t.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </PageCard>
    </PageContainer>
  );
}
