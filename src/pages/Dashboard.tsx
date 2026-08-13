import { useState, useMemo } from 'react';
import {
  Gauge, FileStack, Clock4, CheckCircle2, XCircle, Wallet, FileText,
  FileWarning, FilePlus2, BarChart3, PieChart as PieIcon, History, Search, FileDown,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { PageContainer, PageCard, EmptyState } from '@/components/ui/layout';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { TextInput, DateInput, SelectInput, FormField, PurpleButton, GreenButton } from '@/components/ui/primitives';
import { MONTHS, HISTORY_MOCK, PENDING_DOCS_MOCK, ADDL_DOCS_MOCK, type HistoryRow, DESTINATIONS, AGENT_PROFILE } from '@/data/mock';
import { useWalletBalance } from '@/hooks/useWalletBalance';

const STATS = [
  { label: 'Submitted', value: 0, icon: FileStack },
  { label: 'Hold For Doc', value: 0, icon: Clock4 },
  { label: 'Approved', value: 0, icon: CheckCircle2 },
  { label: 'Rejected', value: 0, icon: XCircle },
  { label: 'Wallet Balance', value: 0, icon: Wallet },
  { label: 'Invoice', value: 0, icon: FileText },
];

const STATUS_COLORS = { Application: '#2563EB', Pending: '#F59E0B', Approved: '#1D4ED8', Rejected: '#DC2626' };

export default function Dashboard() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const walletBalance = useWalletBalance();

  const monthlyData = useMemo(() => MONTHS.map((m) => ({ name: m, applications: 0 })), []);
  const [visaPeriod, setVisaPeriod] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Today');
  const visaData = [
    { name: 'Application', value: 0 },
    { name: 'Pending', value: 0 },
    { name: 'Approved', value: 0 },
    { name: 'Rejected', value: 0 },
  ];
  const allZero = visaData.every((d) => d.value === 0);

  /* History filters */
  const [f, setF] = useState({ from: '', to: '', goingTo: '', groupNo: '', bookingId: '' });
  const filteredHistory = useMemo(() => {
    return HISTORY_MOCK.filter((r) => {
      if (f.from && r.date < f.from) return false;
      if (f.to && r.date > f.to) return false;
      if (f.goingTo && r.mission !== f.goingTo) return false;
      if (f.groupNo && !r.groupAppNo.toLowerCase().includes(f.groupNo.toLowerCase())) return false;
      if (f.bookingId && !String(r.sl).includes(f.bookingId)) return false;
      return true;
    });
  }, [f]);

  const historyCols: Column<HistoryRow>[] = [
    { key: 'sl', header: 'Sl' },
    { key: 'mission', header: 'Mission' },
    { key: 'name', header: 'Name' },
    { key: 'groupAppNo', header: 'Group Application No' },
    { key: 'date', header: 'Date' },
    { key: 'applyFor', header: 'Apply For' },
    { key: 'pax', header: 'Pax' },
  ];

  const docCols: Column<any>[] = [
    { key: 'mission', header: 'Mission' },
    { key: 'appNo', header: 'Application No' },
    { key: 'date', header: 'Date' },
    { key: 'visaType', header: 'Visa Type' },
    { key: 'applicant', header: 'Applicant Name' },
    { key: 'passport', header: 'Passport No' },
  ];

  const exportCsv = () => {
    const rows = [['Sl','Mission','Name','Group Application No','Date','Apply For','Pax'], ...filteredHistory.map((r) => [r.sl, r.mission, r.name, r.groupAppNo, r.date, r.applyFor, r.pax])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'application-history.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer>
      {/* Welcome + stats */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-dark rounded-[12px] px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-5 text-white shadow-sm">
        <div className="flex items-center gap-3 lg:min-w-[260px]">
          <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center ring-1 ring-white/20 shrink-0">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wide text-white/80">WELCOME BACK</p>
            <p className="text-[16px] font-semibold leading-tight">{AGENT_PROFILE.companyName || 'Agency'}</p>
            <p className="text-[10.5px] text-white/75 mt-0.5">{dateStr}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 flex-1">
          {STATS.map((s) => {
            const value = s.label === 'Wallet Balance' ? walletBalance : s.value;
            return (
              <div key={s.label} className="bg-white/10 rounded-[8px] px-3 py-2.5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-white/85">
                  <s.icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium truncate">{s.label}</span>
                </div>
                <p className="text-[20px] font-semibold mt-0.5 leading-none">
                  {s.label === 'Wallet Balance' ? `₹${value.toLocaleString('en-IN')}` : value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending / Additional documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <PageCard title="Pending Document" icon={<FileWarning className="w-4 h-4" />}>
          <DataTable columns={docCols} rows={PENDING_DOCS_MOCK} emptyMessage="No pending documents" />
        </PageCard>
        <PageCard title="Additional Document" icon={<FilePlus2 className="w-4 h-4" />}>
          <DataTable columns={docCols} rows={ADDL_DOCS_MOCK} emptyMessage="No additional documents" />
        </PageCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <PageCard
          title="Application Submitted"
          icon={<BarChart3 className="w-4 h-4" />}
          actions={<span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Monthly</span>}
        >
          <div className="p-4" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={{ stroke: '#E1E4E8' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RTooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E1E4E8' }} />
                <Line type="monotone" dataKey="applications" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#1D4ED8' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PageCard>

        <PageCard
          title="Visa Status"
          icon={<PieIcon className="w-4 h-4" />}
          actions={
            <div className="flex bg-white/15 rounded-[5px] p-0.5">
              {(['Today', 'Week', 'Month', 'Year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setVisaPeriod(p)}
                  className={`px-2 py-0.5 text-[10px] rounded-[4px] transition-colors ${
                    visaPeriod === p ? 'bg-white text-brand-blue font-semibold' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          }
        >
          <div className="p-4" style={{ height: 300 }}>
            {allZero ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-sub">
                <PieIcon className="w-10 h-10 text-gray-200" />
                <p className="text-[12px]">No visa applications in this period</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={visaData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {visaData.map((d) => (
                      <Cell key={d.name} fill={STATUS_COLORS[d.name as keyof typeof STATUS_COLORS]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <RTooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #E1E4E8' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </PageCard>
      </div>

      {/* Application History */}
      <PageCard title="Application History" icon={<History className="w-4 h-4" />} className="mt-4">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            <FormField label="From Date"><DateInput value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></FormField>
            <FormField label="To Date"><DateInput value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></FormField>
            <FormField label="Going To">
              <SelectInput value={f.goingTo} onChange={(e) => setF({ ...f, goingTo: e.target.value })}>
                <option value="">All</option>
                {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
              </SelectInput>
            </FormField>
            <FormField label="Group Application No"><TextInput value={f.groupNo} onChange={(e) => setF({ ...f, groupNo: e.target.value })} placeholder="GRP2026-..." /></FormField>
            <FormField label="Booking Id"><TextInput value={f.bookingId} onChange={(e) => setF({ ...f, bookingId: e.target.value })} /></FormField>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <PurpleButton className="!w-[95px]" onClick={() => setF({ from: '', to: '', goingTo: '', groupNo: '', bookingId: '' })}>
              <Search className="w-3.5 h-3.5" /> Search
            </PurpleButton>
            <GreenButton className="!w-[95px]" onClick={exportCsv}>
              <FileDown className="w-3.5 h-3.5" /> Export
            </GreenButton>
          </div>
          <DataTable columns={historyCols} rows={filteredHistory} emptyMessage="No application found" />
        </div>
      </PageCard>
    </PageContainer>
  );
}
