-- Seed eVisa countries (optional). Safe to re-run (upsert).
insert into public.evisa_countries (
  id, name, region, processing, validity, entry, summary,
  visa_fee, handling_fee, bank_charge_percent, upi_bank_charge_percent,
  required_docs, form_fields, is_active
) values
(
  'uae', 'UAE', 'Middle East', '3–5 working days', '30 / 60 days', 'Single / Multiple',
  'Tourist and visit eVisas for Dubai, Abu Dhabi and other emirates.',
  8500, 750, 2.5, 0,
  '["Scanned passport copy","Photograph","Flight ticket","Hotel booking","Bank statement","IT returns (if requested)"]'::jsonb,
  '[{"key":"emirates","label":"Preferred Emirate","type":"select","options":["Dubai","Abu Dhabi","Sharjah","Other"],"required":true}]'::jsonb,
  true
),
(
  'georgia', 'Georgia', 'Europe / Caucasus', '2–4 working days', '30 days', 'Single',
  'eVisa for tourism and short business visits to Georgia.',
  4200, 600, 2.5, 0,
  '["Scanned passport copy","Photograph","Travel itinerary","Accommodation","Bank statement"]'::jsonb,
  '[{"key":"purposeDetail","label":"Purpose Detail","type":"text","required":true}]'::jsonb,
  true
),
(
  'vietnam', 'Vietnam', 'Asia', '3–7 working days', '30 / 90 days', 'Single / Multiple',
  'Vietnam eVisa for tourism and business travelers.',
  3800, 550, 2.5, 0,
  '["Scanned passport copy","Photograph","Flight reservation","Hotel booking","Bank statement"]'::jsonb,
  '[{"key":"portOfEntry","label":"Port of Entry","type":"text","required":true}]'::jsonb,
  true
),
(
  'cambodia', 'Cambodia', 'Asia', '2–3 working days', '30 days', 'Single',
  'Cambodia eVisa for tourist travel.',
  3200, 500, 2.5, 0,
  '["Scanned passport copy","Photograph","Travel itinerary","Accommodation proof"]'::jsonb,
  '[{"key":"entryPoint","label":"Entry Point","type":"select","options":["Phnom Penh","Siem Reap","Other"],"required":true}]'::jsonb,
  true
),
(
  'saudi-arabia', 'Saudi Arabia', 'Middle East', '5–7 working days', '1 year (multiple) / Tourist', 'Single / Multiple',
  'Tourist eVisa and visit options for Saudi Arabia.',
  12000, 900, 2.5, 0,
  '["Scanned passport copy","Photograph","Travel insurance","Hotel booking","Bank statement","IT returns"]'::jsonb,
  '[{"key":"visaCategory","label":"Visa Category","type":"select","options":["Tourist","Umrah-related Visit","Business Visit"],"required":true}]'::jsonb,
  true
),
(
  'new-zealand', 'New Zealand', 'Oceania', '10–20 working days', 'As per NZeTA / visa type', 'As approved',
  'NZeTA / visitor pathway support for New Zealand travel.',
  9500, 1200, 2.9, 0,
  '["Scanned passport copy","Photograph","Travel itinerary","Bank statement","IT returns"]'::jsonb,
  '[{"key":"etaOrVisa","label":"Application Type","type":"select","options":["NZeTA","Visitor Visa"],"required":true}]'::jsonb,
  true
),
(
  'australia', 'Australia', 'Oceania', '7–15 working days', 'As per subclass', 'As approved',
  'Visitor / eVisitor style applications for Australia.',
  11000, 1300, 2.9, 0,
  '["Scanned passport copy","Photograph","Bank statements","IT returns","Travel itinerary"]'::jsonb,
  '[{"key":"subclass","label":"Visa Subclass","type":"select","options":["Tourist (600)","eVisitor / ETA pathway","Business Visitor"],"required":true}]'::jsonb,
  true
),
(
  'singapore', 'Singapore', 'Asia', '3–5 working days', 'As approved', 'Single / Multiple',
  'Singapore visit / tourist applications for short stays.',
  4500, 650, 2.5, 0,
  '["Scanned passport copy","Photograph","Flight & hotel booking","Bank statement"]'::jsonb,
  '[{"key":"stayDays","label":"Intended Stay (days)","type":"text","required":true}]'::jsonb,
  true
),
(
  'thailand', 'Thailand', 'Asia', '3–5 working days', '60 days (typical tourist)', 'Single / Multiple',
  'Thailand eVisa / tourist visa assistance.',
  3600, 500, 2.5, 0,
  '["Scanned passport copy","Photograph","Travel itinerary","Hotel booking","Bank statement"]'::jsonb,
  '[{"key":"visaTypeTh","label":"Visa Type","type":"select","options":["Tourist","Business"],"required":true}]'::jsonb,
  true
),
(
  'malaysia', 'Malaysia', 'Asia', '3–5 working days', 'As approved', 'Single / Multiple',
  'Malaysia eVisa / eNTRI style tourist applications.',
  3400, 500, 2.5, 0,
  '["Scanned passport copy","Photograph","Flight booking","Hotel booking","Bank statement"]'::jsonb,
  '[{"key":"entryCity","label":"Entry City","type":"text","required":true}]'::jsonb,
  true
)
on conflict (id) do update set
  name = excluded.name,
  region = excluded.region,
  processing = excluded.processing,
  validity = excluded.validity,
  entry = excluded.entry,
  summary = excluded.summary,
  visa_fee = excluded.visa_fee,
  handling_fee = excluded.handling_fee,
  bank_charge_percent = excluded.bank_charge_percent,
  upi_bank_charge_percent = excluded.upi_bank_charge_percent,
  required_docs = excluded.required_docs,
  form_fields = excluded.form_fields,
  is_active = excluded.is_active;
