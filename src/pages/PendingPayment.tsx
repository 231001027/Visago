import { useState, useMemo } from 'react';
import { CreditCard, RotateCcw, Save, Info } from 'lucide-react';
import { PageContainer, PageCard, CardBody, SectionHeader } from '@/components/ui/layout';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SelectInput, Checkbox, FormField, CyanButton, GrayButton } from '@/components/ui/primitives';
import { useToast, Toast } from '@/components/ui/Modal';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { debitWallet } from '@/lib/payments';
import { useWalletBalance } from '@/hooks/useWalletBalance';

interface PayRow {
  id: number; entryDate: string; applyFor: string; passport: string; applicant: string;
  mission: string; visaType: string; entry: string; dept: string; retn: string; amt: number;
}

const MOCK_ROWS: PayRow[] = [];

export default function PendingPayment() {
  const { toast, show } = useToast();
  const walletBalance = useWalletBalance();
  const [selected, setSelected] = useState<number[]>([]);
  const [paymode, setPaymode] = useState('WALLET');
  const [rows, setRows] = useState<PayRow[]>(MOCK_ROWS);
  const [payOpen, setPayOpen] = useState(false);

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () => setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));

  const totalPayable = useMemo(
    () => rows.filter((r) => selected.includes(r.id)).reduce((a, r) => a + r.amt, 0),
    [selected, rows]
  );
  const currentBalance = walletBalance - totalPayable;

  const cols: Column<PayRow>[] = [
    { key: 'check', header: <Checkbox checked={selected.length === rows.length && rows.length > 0} onChange={toggleAll} />, render: (r) => <Checkbox checked={selected.includes(r.id)} onChange={() => toggle(r.id)} />, className: 'text-center w-[40px]', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'entryDate', header: 'Entry Date', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'applyFor', header: 'Applyfor', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'passport', header: 'Passport No', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'applicant', header: 'Applicant Name', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'mission', header: 'Mission', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'visaType', header: 'Visa Type', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'entry', header: 'Entry Type', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'dept', header: 'Dept. Date', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'retn', header: 'Retn. Date', headerClassName: '!bg-brand-blue !text-white' },
    { key: 'amt', header: 'Total Amt', render: (r) => `₹ ${r.amt.toLocaleString('en-IN')}`, headerClassName: '!bg-brand-blue !text-white' },
    { key: 'details', header: 'Details', render: () => <Info className="w-3.5 h-3.5 text-blue-600 cursor-pointer" />, className: 'text-center', headerClassName: '!bg-brand-blue !text-white' },
  ];

  const clearPaid = () => {
    setRows((r) => r.filter((x) => !selected.includes(x.id)));
    setSelected([]);
  };

  const save = () => {
    if (selected.length === 0) {
      show('error', 'Select at least one application to pay');
      return;
    }
    if (totalPayable <= 0) {
      show('error', 'Nothing to pay');
      return;
    }

    if (paymode === 'ONLINE') {
      setPayOpen(true);
      return;
    }

    if (paymode === 'WALLET') {
      const res = debitWallet(totalPayable);
      if (!res.ok) {
        show('error', res.message || 'Wallet payment failed');
        return;
      }
      clearPaid();
      show('success', `Paid ₹${totalPayable.toLocaleString('en-IN')} from wallet`);
      return;
    }

    clearPaid();
    show('success', `${paymode} payment recorded (demo)`);
  };

  return (
    <PageContainer>
      <Toast toast={toast} />
      <PaymentModal
        open={payOpen}
        amount={totalPayable}
        purpose={`Visa pending payment (${selected.length} application${selected.length === 1 ? '' : 's'})`}
        onClose={() => setPayOpen(false)}
        onError={(msg) => show('error', msg)}
        onSuccess={(res) => {
          clearPaid();
          show('success', `Online payment ${res.paymentId} successful for ₹${res.amount.toLocaleString('en-IN')}`);
        }}
      />

      <PageCard title="Pending Payment" icon={<CreditCard className="w-4 h-4" />} headerStrip="gray">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            <FormField label="Agent/Customer" required>
              <SelectInput defaultValue="TRAVEL AGENCY">
                <option>TRAVEL AGENCY</option>
              </SelectInput>
            </FormField>
          </div>
        </CardBody>
      </PageCard>

      <div className="mt-4">
        <SectionHeader title="Visa Information" />
        <PageCard className="rounded-t-none">
          <DataTable columns={cols} rows={rows} headerVariant="blue" emptyMessage="No pending payments" />
        </PageCard>
      </div>

      <PageCard className="mt-4">
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField label="Total Payable Amount"><div className="vb-input bg-[#E9EDF1] flex items-center">₹ {totalPayable.toLocaleString('en-IN')}</div></FormField>
            <FormField label="Wallet Balance"><div className="vb-input bg-[#E9EDF1] flex items-center">₹ {walletBalance.toLocaleString('en-IN')}</div></FormField>
            <FormField label="Current Balance"><div className={`vb-input flex items-center ${currentBalance < 0 ? 'text-red-600 font-semibold' : 'bg-[#E9EDF1]'}`}>₹ {currentBalance.toLocaleString('en-IN')}</div></FormField>
            <FormField label="Paymode">
              <SelectInput value={paymode} onChange={(e) => setPaymode(e.target.value)}>
                <option>WALLET</option>
                <option>ONLINE</option>
                <option>CHEQUE</option>
                <option>NEFT</option>
              </SelectInput>
            </FormField>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <GrayButton onClick={() => { setSelected([]); show('info', 'Form reset'); }}><RotateCcw className="w-3.5 h-3.5" /> Reset</GrayButton>
            <CyanButton onClick={save}>
              <Save className="w-3.5 h-3.5" />
              {paymode === 'ONLINE' ? 'Pay Online' : 'Save / Pay'}
            </CyanButton>
          </div>
        </CardBody>
      </PageCard>
    </PageContainer>
  );
}
