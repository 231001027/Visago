export const DESTINATIONS = [
  'UAE',
  'Georgia',
  'Vietnam',
  'Cambodia',
  'Saudi Arabia',
  'New Zealand',
  'Australia',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Qatar',
  'Oman',
  'United Kingdom',
  'United States',
  'Canada',
  'Europe / Schengen',
];

export const NATIONALITIES = ['INDIAN', 'AMERICAN', 'BRITISH', 'CANADIAN', 'AUSTRALIAN', 'SINGAPOREAN'];

export const VISA_TYPES = ['Tourist', 'Business', 'Work', 'Student', 'Transit', 'Visit'];
export const ENTRY_TYPES = ['Single', 'Double', 'Multiple'];
export const GENDERS = ['Male', 'Female', 'Other'];
export const MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'];
export const PURPOSES = ['Tourism', 'Business', 'Work', 'Study', 'Family Visit', 'Medical'];
export const INVOICE_FREQ = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
export const COUNTRIES = ['INDIA', 'UNITED ARAB EMIRATES', 'UNITED KINGDOM', 'UNITED STATES', 'CANADA', 'AUSTRALIA'];
export const STATES_IN = ['KARNATAKA', 'MAHARASHTRA', 'DELHI', 'TAMIL NADU', 'KERALA', 'UTTAR PRADESH'];
export const BANK_TYPES = ['Savings', 'Current'];

export const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

export const AGENT_PROFILE = {
  companyName: '',
  email: '',
  mobile: '',
  invoiceFrequency: 'Daily',
  contactPerson: '',
  contactEmail: '',
  contactMobile: '',
  salesPerson: '',
  financeEmail: '',
  agentCode: '',
  gstNo: '',
  panNo: '',
  tanNo: '',
  country: 'INDIA',
  state: 'KARNATAKA',
  city: '',
  pin: '',
  address: '',
};

export interface HistoryRow {
  sl: number;
  mission: string;
  name: string;
  groupAppNo: string;
  date: string;
  applyFor: string;
  pax: number;
}

export const HISTORY_MOCK: HistoryRow[] = [];

export const PENDING_DOCS_MOCK: {
  mission: string;
  appNo: string;
  date: string;
  visaType: string;
  applicant: string;
  passport: string;
}[] = [];

export const ADDL_DOCS_MOCK: {
  mission: string;
  appNo: string;
  date: string;
  visaType: string;
  applicant: string;
  passport: string;
}[] = [];
