import { useState } from 'react';
import { Layers, Plus, Upload, ArrowRight, Trash2, FileSpreadsheet } from 'lucide-react';
import { PageContainer, PageCard, CardBody } from '@/components/ui/layout';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SelectInput, TextInput, DateInput, FormField, CyanButton, GrayButton, PrimaryButton, GreenButton } from '@/components/ui/primitives';
import { useToast, Toast } from '@/components/ui/Modal';
import { DESTINATIONS, NATIONALITIES, VISA_TYPES, ENTRY_TYPES, GENDERS } from '@/data/mock';

interface Applicant {
  id: number;
  name: string; passport: string; dob: string; gender: string;
  visaType: string; entry: string; travelDate: string; status: string;
}

export default function BulkApplyVisa() {
  const { toast, show } = useToast();
  const [nationality, setNationality] = useState('INDIAN');
  const [goingTo, setGoingTo] = useState('');
  const [rows, setRows] = useState<Applicant[]>([
    { id: 1, name: '', passport: '', dob: '', gender: '', visaType: '', entry: '', travelDate: '', status: 'Pending' },
  ]);

  const addRow = () => setRows((r) => [...r, { id: Date.now(), name: '', passport: '', dob: '', gender: '', visaType: '', entry: '', travelDate: '', status: 'Pending' }]);
  const removeRow = (id: number) => setRows((r) => r.filter((x) => x.id !== id));
  const upd = (id: number, k: keyof Applicant, v: string) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  const cols: Column<Applicant>[] = [
    { key: 'sl', header: 'Sl No', render: (_r, i) => i + 1, className: 'text-center w-[50px]' },
    { key: 'name', header: 'Applicant Name', render: (r) => <TextInput value={r.name} onChange={(e) => upd(r.id, 'name', e.target.value)} className="!h-[30px] !text-[11px]" /> },
    { key: 'passport', header: 'Passport No', render: (r) => <TextInput value={r.passport} onChange={(e) => upd(r.id, 'passport', e.target.value)} className="!h-[30px] !text-[11px]" /> },
    { key: 'dob', header: 'Date of Birth', render: (r) => <DateInput value={r.dob} onChange={(e) => upd(r.id, 'dob', e.target.value)} className="!h-[30px] !text-[11px]" /> },
    { key: 'gender', header: 'Gender', render: (r) => (
      <SelectInput value={r.gender} onChange={(e) => upd(r.id, 'gender', e.target.value)} className="!h-[30px] !text-[11px]">
        <option value="">--</option>{GENDERS.map((g) => <option key={g}>{g}</option>)}
      </SelectInput>
    ) },
    { key: 'visaType', header: 'Visa Type', render: (r) => (
      <SelectInput value={r.visaType} onChange={(e) => upd(r.id, 'visaType', e.target.value)} className="!h-[30px] !text-[11px]">
        <option value="">--</option>{VISA_TYPES.map((v) => <option key={v}>{v}</option>)}
      </SelectInput>
    ) },
    { key: 'entry', header: 'Entry Type', render: (r) => (
      <SelectInput value={r.entry} onChange={(e) => upd(r.id, 'entry', e.target.value)} className="!h-[30px] !text-[11px]">
        <option value="">--</option>{ENTRY_TYPES.map((e) => <option key={e}>{e}</option>)}
      </SelectInput>
    ) },
    { key: 'travelDate', header: 'Travel Date', render: (r) => <DateInput value={r.travelDate} onChange={(e) => upd(r.id, 'travelDate', e.target.value)} className="!h-[30px] !text-[11px]" /> },
    { key: 'status', header: 'Document Status', render: (r) => (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${r.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{r.status}</span>
    ) },
    { key: 'action', header: 'Action', render: (r) => (
      <button onClick={() => removeRow(r.id)} className="text-brand-blue hover:opacity-80"><Trash2 className="w-3.5 h-3.5" /></button>
    ), className: 'text-center' },
  ];

  return (
    <PageContainer>
      <Toast toast={toast} />
      <PageCard title="Bulk Apply Visa" icon={<Layers className="w-4 h-4" />} headerStrip="gray">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nationality" required>
              <SelectInput value={nationality} onChange={(e) => setNationality(e.target.value)}>
                {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
              </SelectInput>
            </FormField>
            <FormField label="Going To" required>
              <SelectInput value={goingTo} onChange={(e) => setGoingTo(e.target.value)}>
                <option value="">-- Select Destination --</option>
                {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
              </SelectInput>
            </FormField>
          </div>
        </CardBody>
      </PageCard>

      {goingTo && (
        <PageCard className="mt-4">
          <CardBody>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-[13px] font-semibold">Applicant List — {goingTo}</h3>
              <div className="flex gap-2">
                <GreenButton onClick={addRow} className="!h-[30px]"><Plus className="w-3.5 h-3.5" /> Add Applicant</GreenButton>
                <CyanButton onClick={() => show('info', 'Excel upload simulated (demo)')} className="!h-[30px]"><FileSpreadsheet className="w-3.5 h-3.5" /> Upload Excel</CyanButton>
              </div>
            </div>
            <DataTable columns={cols} rows={rows} emptyMessage="No applicants added" />
            <div className="flex justify-end mt-3">
              <PrimaryButton onClick={() => show('success', `${rows.length} applicants queued (demo)`)}>
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </PrimaryButton>
            </div>
          </CardBody>
        </PageCard>
      )}
    </PageContainer>
  );
}
