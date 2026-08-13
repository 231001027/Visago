import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVISA_COUNTRIES } from '@/data/evisa';
import { SelectInput, FormField, PrimaryButton } from '@/components/ui/primitives';

/** Public entry: pick country then go to country-specific visa form */
export default function VisaApply() {
  const [countryId, setCountryId] = useState('');
  const navigate = useNavigate();
  const selected = useMemo(() => EVISA_COUNTRIES.find((c) => c.id === countryId), [countryId]);

  return (
    <div className="max-w-content mx-auto px-5 py-12">
      <h1 className="text-[28px] font-semibold text-ink">Visa application</h1>
      <p className="mt-2 text-[14px] text-sub max-w-2xl">
        Select an eVisa country to open the online form with government-style fields, document checklist, and fee breakdown.
      </p>

      <div className="mt-8 max-w-xl bg-white rounded-[14px] border border-[#E8ECF1] p-6 space-y-4">
        <FormField label="eVisa Country" required>
          <SelectInput value={countryId} onChange={(e) => setCountryId(e.target.value)}>
            <option value="">-- Select Country --</option>
            {EVISA_COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </SelectInput>
        </FormField>

        {selected && (
          <div className="rounded-[10px] bg-[#F5F8FC] border border-[#E3E8EF] p-3 text-[12px] text-sub space-y-1">
            <p><span className="font-semibold text-ink">Processing:</span> {selected.processing}</p>
            <p><span className="font-semibold text-ink">Documents:</span> {selected.requiredDocs.length} types required</p>
            <p><span className="font-semibold text-ink">Base fees:</span> ₹ {(selected.visaFee + selected.handlingFee).toLocaleString('en-IN')} + bank charges</p>
          </div>
        )}

        <PrimaryButton
          disabled={!countryId}
          onClick={() => navigate(`/evisa-countries/${countryId}`)}
        >
          Continue to {selected?.name || 'country'} form
        </PrimaryButton>
      </div>
    </div>
  );
}
