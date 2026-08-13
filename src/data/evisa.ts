export type UserRole = 'b2b' | 'b2c';

export type EvisaCountry = {
  id: string;
  name: string;
  region: string;
  processing: string;
  validity: string;
  entry: string;
  summary: string;
  visaFee: number;
  handlingFee: number;
  bankChargePercent: number; // on (visa + handling) for card
  upiBankChargePercent: number;
  requiredDocs: string[];
  formFields: { key: string; label: string; type: 'text' | 'date' | 'select'; options?: string[]; required?: boolean }[];
};

export const EVISA_COUNTRIES: EvisaCountry[] = [
  {
    id: 'uae',
    name: 'UAE',
    region: 'Middle East',
    processing: '3–5 working days',
    validity: '30 / 60 days',
    entry: 'Single / Multiple',
    summary: 'Tourist and visit eVisas for Dubai, Abu Dhabi and other emirates.',
    visaFee: 8500,
    handlingFee: 750,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy (front & back)',
      'Recent photograph (white background)',
      'Confirmed flight ticket / travel itinerary',
      'Hotel booking confirmation',
      'Bank statement (last 3–6 months)',
      'IT returns (last 2–3 years) — if requested',
    ],
    formFields: [
      { key: 'emirates', label: 'Preferred Emirate', type: 'select', options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Other'], required: true },
      { key: 'sponsorType', label: 'Sponsor Type', type: 'select', options: ['Tourist', 'Relative', 'Hotel', 'Company'], required: true },
    ],
  },
  {
    id: 'georgia',
    name: 'Georgia',
    region: 'Europe / Caucasus',
    processing: '2–4 working days',
    validity: '30 days',
    entry: 'Single',
    summary: 'eVisa for tourism and short business visits to Georgia.',
    visaFee: 4200,
    handlingFee: 600,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Travel itinerary',
      'Proof of accommodation',
      'Bank statement',
    ],
    formFields: [
      { key: 'purposeDetail', label: 'Purpose Detail', type: 'text', required: true },
      { key: 'cities', label: 'Cities to Visit', type: 'text', required: true },
    ],
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    region: 'Asia',
    processing: '3–7 working days',
    validity: '30 / 90 days',
    entry: 'Single / Multiple',
    summary: 'Vietnam eVisa for tourism and business travelers.',
    visaFee: 3800,
    handlingFee: 550,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Flight reservation',
      'Hotel booking',
      'Bank statement',
      'IT returns (2–3 years) — business cases',
    ],
    formFields: [
      { key: 'portOfEntry', label: 'Port of Entry', type: 'text', required: true },
      { key: 'visaDuration', label: 'Visa Duration', type: 'select', options: ['30 Days', '90 Days'], required: true },
    ],
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    region: 'Asia',
    processing: '2–3 working days',
    validity: '30 days',
    entry: 'Single',
    summary: 'Cambodia eVisa for tourist travel.',
    visaFee: 3200,
    handlingFee: 500,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Travel itinerary',
      'Accommodation proof',
    ],
    formFields: [
      { key: 'entryPoint', label: 'Entry Point', type: 'select', options: ['Phnom Penh', 'Siem Reap', 'Other'], required: true },
    ],
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    region: 'Middle East',
    processing: '5–7 working days',
    validity: '1 year (multiple) / Tourist',
    entry: 'Single / Multiple',
    summary: 'Tourist eVisa and visit options for Saudi Arabia.',
    visaFee: 12000,
    handlingFee: 900,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Travel insurance',
      'Hotel booking',
      'Bank statement',
      'IT returns (2–3 years)',
      'Any other document required by authorities',
    ],
    formFields: [
      { key: 'visaCategory', label: 'Visa Category', type: 'select', options: ['Tourist', 'Umrah-related Visit', 'Business Visit'], required: true },
    ],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    region: 'Oceania',
    processing: '10–20 working days',
    validity: 'As per NZeTA / visa type',
    entry: 'As approved',
    summary: 'NZeTA / visitor pathway support for New Zealand travel.',
    visaFee: 9500,
    handlingFee: 1200,
    bankChargePercent: 2.9,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Travel itinerary',
      'Proof of funds / bank statement',
      'IT returns (2–3 years)',
      'Employment / cover letter',
    ],
    formFields: [
      { key: 'etaOrVisa', label: 'Application Type', type: 'select', options: ['NZeTA', 'Visitor Visa'], required: true },
    ],
  },
  {
    id: 'australia',
    name: 'Australia',
    region: 'Oceania',
    processing: '7–15 working days',
    validity: 'As per subclass',
    entry: 'As approved',
    summary: 'Visitor / eVisitor style applications for Australia.',
    visaFee: 11000,
    handlingFee: 1300,
    bankChargePercent: 2.9,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Bank statements',
      'IT returns (2–3 years)',
      'Travel itinerary',
      'Employment proof',
      'Other documents as per subclass',
    ],
    formFields: [
      { key: 'subclass', label: 'Visa Subclass', type: 'select', options: ['Tourist (600)', 'eVisitor / ETA pathway', 'Business Visitor'], required: true },
    ],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    region: 'Asia',
    processing: '3–5 working days',
    validity: 'As approved',
    entry: 'Single / Multiple',
    summary: 'Singapore visit / tourist applications for short stays.',
    visaFee: 4500,
    handlingFee: 650,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Flight & hotel booking',
      'Bank statement',
      'IT returns if requested',
    ],
    formFields: [
      { key: 'stayDays', label: 'Intended Stay (days)', type: 'text', required: true },
    ],
  },
  {
    id: 'thailand',
    name: 'Thailand',
    region: 'Asia',
    processing: '3–5 working days',
    validity: '60 days (typical tourist)',
    entry: 'Single / Multiple',
    summary: 'Thailand eVisa / tourist visa assistance.',
    visaFee: 3600,
    handlingFee: 500,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Travel itinerary',
      'Hotel booking',
      'Bank statement',
    ],
    formFields: [
      { key: 'visaTypeTh', label: 'Visa Type', type: 'select', options: ['Tourist', 'Business'], required: true },
    ],
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    region: 'Asia',
    processing: '3–5 working days',
    validity: 'As approved',
    entry: 'Single / Multiple',
    summary: 'Malaysia eVisa / eNTRI style tourist applications.',
    visaFee: 3400,
    handlingFee: 500,
    bankChargePercent: 2.5,
    upiBankChargePercent: 0,
    requiredDocs: [
      'Scanned passport copy',
      'Photograph',
      'Flight booking',
      'Hotel booking',
      'Bank statement',
    ],
    formFields: [
      { key: 'entryCity', label: 'Entry City', type: 'text', required: true },
    ],
  },
];

export function getEvisaCountry(id: string) {
  return EVISA_COUNTRIES.find((c) => c.id === id);
}

export function calcFees(country: EvisaCountry, method: 'upi' | 'card' | 'netbanking') {
  const base = country.visaFee + country.handlingFee;
  const pct = method === 'upi' ? country.upiBankChargePercent : country.bankChargePercent;
  const bankCharges = Math.round((base * pct) / 100);
  return {
    visaFee: country.visaFee,
    handlingFee: country.handlingFee,
    bankCharges,
    total: base + bankCharges,
    method,
  };
}
