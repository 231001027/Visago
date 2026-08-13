import { useState } from 'react';
import { UserCog, Plus, Building2, ShieldCheck, FileSignature, Landmark, ScrollText, Trash2 } from 'lucide-react';
import { PageContainer, PageCard, SectionHeader, CardBody } from '@/components/ui/layout';
import { FileUpload } from '@/components/ui/FileUpload';
import { TextInput, DateInput, SelectInput, Checkbox, FormField, PrimaryButton, CyanButton, GrayButton } from '@/components/ui/primitives';
import { useToast, Toast, ConfirmModal } from '@/components/ui/Modal';
import { AGENT_PROFILE, INVOICE_FREQ, COUNTRIES, STATES_IN, BANK_TYPES } from '@/data/mock';

interface BankBranch { id: number; beneficiary: string; bankName: string; acNo: string; ifsc: string; type: string; }

export default function ProfileUpdate() {
  const { toast, show } = useToast();
  const [confirm, setConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [registered, setRegistered] = useState(true);
  const [msme, setMsme] = useState(false);
  const [indemnity, setIndemnity] = useState(false);

  const [branches, setBranches] = useState<BankBranch[]>([
    { id: 1, beneficiary: '', bankName: '', acNo: '', ifsc: '', type: 'Savings' },
  ]);

  const addBranch = () =>
    setBranches((b) => [...b, { id: Date.now(), beneficiary: '', bankName: '', acNo: '', ifsc: '', type: 'Savings' }]);
  const removeBranch = (id: number) => setBranches((b) => b.filter((x) => x.id !== id));
  const updateBranch = (id: number, field: keyof BankBranch, value: string) =>
    setBranches((b) => b.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const submit = () => {
    if (!agreed) { show('error', 'Please accept the Terms & Conditions'); return; }
    setConfirm(true);
  };

  return (
    <PageContainer>
      <Toast toast={toast} />
      <ConfirmModal
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => show('success', 'Profile updated successfully')}
        title="Update Profile"
        message="Are you sure you want to update your agency profile?"
        confirmText="Yes, Update"
      />

      <PageCard title="Profile Update" icon={<UserCog className="w-4 h-4" />} headerStrip="blue">
        <CardBody>
          {/* BASIC DETAILS */}
          <h3 className="text-[13px] font-semibold mb-3 text-ink">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormField label="Company Name" required><TextInput defaultValue={AGENT_PROFILE.companyName} /></FormField>
            <FormField label="Email Id" required><TextInput defaultValue={AGENT_PROFILE.email} /></FormField>
            <FormField label="Mobile No" required><TextInput defaultValue={AGENT_PROFILE.mobile} /></FormField>
            <FormField label="Invoice Frequency" required>
              <SelectInput defaultValue={AGENT_PROFILE.invoiceFrequency}>
                {INVOICE_FREQ.map((f) => <option key={f}>{f}</option>)}
              </SelectInput>
            </FormField>
            <FormField label="Contact Person Name" required><TextInput defaultValue={AGENT_PROFILE.contactPerson} /></FormField>
            <FormField label="Contact Person Email" required><TextInput defaultValue={AGENT_PROFILE.contactEmail} /></FormField>
            <FormField label="Contact Person Mobile No." required><TextInput defaultValue={AGENT_PROFILE.contactMobile} /></FormField>
            <FormField label="Sales Person Name"><TextInput defaultValue={AGENT_PROFILE.salesPerson} /></FormField>
            <FormField label="Finance Person Email" required><TextInput defaultValue={AGENT_PROFILE.financeEmail} /></FormField>
            <FormField label="Agent Code"><TextInput defaultValue={AGENT_PROFILE.agentCode} disabled /></FormField>
          </div>
        </CardBody>
      </PageCard>

      {/* GST */}
      <div className="mt-4">
        <SectionHeader title="GST" icon={<ShieldCheck className="w-4 h-4 text-blue-600" />} />
        <PageCard className="rounded-t-none">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3">
              <div className="flex items-center pt-5"><Checkbox checked={registered} onChange={setRegistered} label="Registered" /></div>
              <FormField label="GST No." required><TextInput defaultValue={AGENT_PROFILE.gstNo} /></FormField>
              <FormField label="PAN No." required><TextInput defaultValue={AGENT_PROFILE.panNo} /></FormField>
              <FormField label="TAN No."><TextInput defaultValue={AGENT_PROFILE.tanNo} placeholder="Optional" /></FormField>
              <FormField label="Country" required>
                <SelectInput defaultValue={AGENT_PROFILE.country}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</SelectInput>
              </FormField>
              <FormField label="State" required>
                <SelectInput defaultValue={AGENT_PROFILE.state}>{STATES_IN.map((s) => <option key={s}>{s}</option>)}</SelectInput>
              </FormField>
              <FormField label="City" required><TextInput defaultValue={AGENT_PROFILE.city} /></FormField>
              <FormField label="Pin" required><TextInput defaultValue={AGENT_PROFILE.pin} /></FormField>
              <div className="md:col-span-2 lg:col-span-4">
                <FormField label="Address" required><TextInput defaultValue={AGENT_PROFILE.address} /></FormField>
              </div>
            </div>
            <div className="mt-4 max-w-xl">
              <FileUpload label="GST Certificate / PAN Card Copy" status="" />
            </div>
          </CardBody>
        </PageCard>
      </div>

      {/* MSME + Indemnity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div>
          <SectionHeader title="MSME" icon={<Building2 className="w-4 h-4 text-blue-600" />} />
          <PageCard className="rounded-t-none">
            <CardBody>
              <Checkbox checked={msme} onChange={setMsme} label="MSME" />
              {msme && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="MSME No."><TextInput placeholder="Enter MSME registration no." /></FormField>
                  <FormField label="MSME Valid Till"><DateInput /></FormField>
                  <div className="md:col-span-2"><FileUpload label="MSME Certificate" status="" /></div>
                </div>
              )}
            </CardBody>
          </PageCard>
        </div>
        <div>
          <SectionHeader title="Indemnity Letter" icon={<FileSignature className="w-4 h-4 text-blue-600" />} />
          <PageCard className="rounded-t-none">
            <CardBody>
              <p className="text-[12px] text-sub mb-3 leading-relaxed">
                In case of applying for UAE visa, please check Indemnity Terms &amp; Conditions.
              </p>
              <Checkbox checked={indemnity} onChange={setIndemnity} label="Indemnity Terms & Conditions" />
              {indemnity && <div className="mt-3"><FileUpload label="Indemnity Letter Upload" status="" /></div>}
            </CardBody>
          </PageCard>
        </div>
      </div>

      {/* Bank */}
      <div className="mt-4">
        <SectionHeader title="Bank" icon={<Landmark className="w-4 h-4 text-blue-600" />} />
        <PageCard className="rounded-t-none">
          <CardBody className="space-y-4">
            {branches.map((b, idx) => (
              <div key={b.id} className="border border-[#E0E0E0] rounded-[10px] p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-sub">Branch {idx + 1}</span>
                  {branches.length > 1 && (
                    <button onClick={() => removeBranch(b.id)} className="text-brand-blue hover:opacity-80 inline-flex items-center gap-1 text-[11px]">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                  <FormField label="Beneficiary Name"><TextInput value={b.beneficiary} onChange={(e) => updateBranch(b.id, 'beneficiary', e.target.value)} /></FormField>
                  <FormField label="Bank Name"><TextInput value={b.bankName} onChange={(e) => updateBranch(b.id, 'bankName', e.target.value)} /></FormField>
                  <FormField label="Bank A/C"><TextInput value={b.acNo} onChange={(e) => updateBranch(b.id, 'acNo', e.target.value)} /></FormField>
                  <FormField label="IFSC"><TextInput value={b.ifsc} onChange={(e) => updateBranch(b.id, 'ifsc', e.target.value)} /></FormField>
                  <FormField label="Bank Type">
                    <SelectInput value={b.type} onChange={(e) => updateBranch(b.id, 'type', e.target.value)}>
                      {BANK_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </SelectInput>
                  </FormField>
                </div>
                <div className="mt-3 max-w-xl"><FileUpload label="Cancel Cheque" status="" /></div>
              </div>
            ))}
            <CyanButton onClick={addBranch} className="!w-auto">
              <Plus className="w-4 h-4" /> Add other Branch
            </CyanButton>
          </CardBody>
        </PageCard>
      </div>

      {/* Terms */}
      <PageCard title="Terms & Conditions" icon={<ScrollText className="w-4 h-4" />} headerStrip="blue" className="mt-4">
        <CardBody>
          <div className="h-44 overflow-y-auto border border-[#E0E0E0] rounded-[8px] p-4 text-[12px] text-sub leading-relaxed space-y-2">
            <p>1. I agree to make an online deposit of money into the designated Bank Accounts of Visago towards visa processing fees and service charges.</p>
            <p>2. The agency is responsible for the authenticity of all documents submitted on behalf of applicants. Visago is not liable for visa rejections due to incorrect or incomplete documentation.</p>
            <p>3. Processing timelines are indicative and depend on the respective embassy/consulate. Visago does not guarantee any fixed turnaround time.</p>
            <p>4. All service charges are non-refundable once an application has been submitted. Government fees are subject to the refund policy of the issuing authority.</p>
            <p>5. The agency must maintain sufficient wallet balance to initiate new applications. Pending payments attract a hold on further submissions.</p>
            <p>6. Visago reserves the right to suspend or terminate agency accounts in case of fraudulent activity, misrepresentation, or breach of these terms.</p>
            <p>7. Any disputes shall be governed by the laws of the Republic of India and courts of Bengaluru shall have exclusive jurisdiction.</p>
          </div>
          <div className="mt-3"><Checkbox checked={agreed} onChange={setAgreed} label="I agree to the Terms & Conditions" /></div>
          <div className="mt-4 flex justify-end">
            <PrimaryButton onClick={submit} className="!w-[160px]">Update Profile</PrimaryButton>
          </div>
        </CardBody>
      </PageCard>
    </PageContainer>
  );
}
