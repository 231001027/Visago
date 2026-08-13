import { useState } from 'react';
import { Plane, RefreshCw, User, Phone, MapPin, FileText } from 'lucide-react';
import { PageContainer, PageCard, SectionHeader, CardBody } from '@/components/ui/layout';
import { TextInput, SelectInput, DateInput, FormField, GrayButton, PrimaryButton } from '@/components/ui/primitives';
import { FileUpload } from '@/components/ui/FileUpload';
import { useToast, Toast } from '@/components/ui/Modal';
import { DESTINATIONS, NATIONALITIES, VISA_TYPES, ENTRY_TYPES, GENDERS, MARITAL, PURPOSES } from '@/data/mock';

const empty = {
  applicantName: '', passportNo: '', dob: '', gender: '', nationality: 'INDIAN',
  issueDate: '', expiryDate: '', placeOfBirth: '', marital: '',
  email: '', mobile: '', address: '', city: '', state: '', country: 'INDIA', postal: '',
  goingTo: '', visaType: '', purpose: '', departure: '', return: '', entry: '',
};

export default function ApplyVisa() {
  const { toast, show } = useToast();
  const [nationality, setNationality] = useState('INDIAN');
  const [goingTo, setGoingTo] = useState('');
  const [form, setForm] = useState({ ...empty });
  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const reset = () => { setGoingTo(''); setForm({ ...empty }); show('info', 'Form reset'); };

  const submit = () => {
    if (!form.applicantName || !form.passportNo) { show('error', 'Please fill required applicant fields'); return; }
    show('success', `Visa application for ${goingTo} submitted (demo)`);
  };

  return (
    <PageContainer>
      <Toast toast={toast} />
      <div className="flex justify-center">
        <div className="w-full max-w-[940px]">
          <PageCard title="Apply Visa" icon={<Plane className="w-4 h-4" />} headerStrip="gray">
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
            <div className="mt-4 space-y-4">
              {/* Applicant Information */}
              <div>
                <SectionHeader title="Applicant Information" icon={<User className="w-4 h-4 text-blue-600" />} />
                <PageCard className="rounded-t-none">
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                      <FormField label="Applicant Name" required><TextInput value={form.applicantName} onChange={(e) => set('applicantName', e.target.value)} /></FormField>
                      <FormField label="Passport Number" required><TextInput value={form.passportNo} onChange={(e) => set('passportNo', e.target.value)} /></FormField>
                      <FormField label="Date of Birth" required><DateInput value={form.dob} onChange={(e) => set('dob', e.target.value)} /></FormField>
                      <FormField label="Gender" required>
                        <SelectInput value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                          <option value="">-- Select --</option>{GENDERS.map((g) => <option key={g}>{g}</option>)}
                        </SelectInput>
                      </FormField>
                      <FormField label="Nationality" required>
                        <SelectInput value={form.nationality} onChange={(e) => set('nationality', e.target.value)}>
                          {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
                        </SelectInput>
                      </FormField>
                      <FormField label="Passport Issue Date" required><DateInput value={form.issueDate} onChange={(e) => set('issueDate', e.target.value)} /></FormField>
                      <FormField label="Passport Expiry Date" required><DateInput value={form.expiryDate} onChange={(e) => set('expiryDate', e.target.value)} /></FormField>
                      <FormField label="Place of Birth"><TextInput value={form.placeOfBirth} onChange={(e) => set('placeOfBirth', e.target.value)} /></FormField>
                      <FormField label="Marital Status">
                        <SelectInput value={form.marital} onChange={(e) => set('marital', e.target.value)}>
                          <option value="">-- Select --</option>{MARITAL.map((m) => <option key={m}>{m}</option>)}
                        </SelectInput>
                      </FormField>
                    </div>
                  </CardBody>
                </PageCard>
              </div>

              {/* Contact Information */}
              <div>
                <SectionHeader title="Contact Information" icon={<Phone className="w-4 h-4 text-blue-600" />} />
                <PageCard className="rounded-t-none">
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                      <FormField label="Email"><TextInput value={form.email} onChange={(e) => set('email', e.target.value)} /></FormField>
                      <FormField label="Mobile Number"><TextInput value={form.mobile} onChange={(e) => set('mobile', e.target.value)} /></FormField>
                      <FormField label="City"><TextInput value={form.city} onChange={(e) => set('city', e.target.value)} /></FormField>
                      <FormField label="State"><TextInput value={form.state} onChange={(e) => set('state', e.target.value)} /></FormField>
                      <FormField label="Country"><TextInput value={form.country} onChange={(e) => set('country', e.target.value)} /></FormField>
                      <FormField label="Postal Code"><TextInput value={form.postal} onChange={(e) => set('postal', e.target.value)} /></FormField>
                      <div className="md:col-span-2 lg:col-span-3">
                        <FormField label="Address"><TextInput value={form.address} onChange={(e) => set('address', e.target.value)} /></FormField>
                      </div>
                    </div>
                  </CardBody>
                </PageCard>
              </div>

              {/* Travel Information */}
              <div>
                <SectionHeader title="Travel Information" icon={<MapPin className="w-4 h-4 text-blue-600" />} />
                <PageCard className="rounded-t-none">
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                      <FormField label="Going To"><TextInput value={goingTo} disabled /></FormField>
                      <FormField label="Visa Type" required>
                        <SelectInput value={form.visaType} onChange={(e) => set('visaType', e.target.value)}>
                          <option value="">-- Select --</option>{VISA_TYPES.map((v) => <option key={v}>{v}</option>)}
                        </SelectInput>
                      </FormField>
                      <FormField label="Purpose of Travel">
                        <SelectInput value={form.purpose} onChange={(e) => set('purpose', e.target.value)}>
                          <option value="">-- Select --</option>{PURPOSES.map((p) => <option key={p}>{p}</option>)}
                        </SelectInput>
                      </FormField>
                      <FormField label="Departure Date"><DateInput value={form.departure} onChange={(e) => set('departure', e.target.value)} /></FormField>
                      <FormField label="Return Date"><DateInput value={form.return} onChange={(e) => set('return', e.target.value)} /></FormField>
                      <FormField label="Entry Type">
                        <SelectInput value={form.entry} onChange={(e) => set('entry', e.target.value)}>
                          <option value="">-- Select --</option>{ENTRY_TYPES.map((e) => <option key={e}>{e}</option>)}
                        </SelectInput>
                      </FormField>
                    </div>
                  </CardBody>
                </PageCard>
              </div>

              {/* Passport Document */}
              <div>
                <SectionHeader title="Passport Document" icon={<FileText className="w-4 h-4 text-blue-600" />} />
                <PageCard className="rounded-t-none">
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUpload label="Scanned Passport Copy (Front)" status="" />
                      <FileUpload label="Scanned Passport Copy (Back)" status="" />
                      <FileUpload label="Photograph" status="" />
                      <FileUpload label="Bank Statement" status="" />
                      <FileUpload label="IT Returns (2–3 years)" status="" />
                      <FileUpload label="Any Other Required Documents" status="" />
                    </div>
                  </CardBody>
                </PageCard>
              </div>

              <div className="flex justify-end gap-2">
                <GrayButton onClick={reset}><RefreshCw className="w-3.5 h-3.5" /> Reset</GrayButton>
                <PrimaryButton onClick={submit}>Submit Application</PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
