import { getSupabase, getSupabaseOrNull } from '@/lib/supabase';
import type {
  ApplicationDocument,
  EvisaCountryRow,
  Payment,
  Profile,
  UserRole,
  VisaApplication,
} from '@/types/database';

export async function fetchMyProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export async function upsertProfileFromAuth(input: {
  role: UserRole;
  full_name: string;
  email: string;
  mobile?: string;
  company_name?: string;
}): Promise<Profile> {
  const supabase = getSupabase();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw authError || new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: auth.user.id,
      role: input.role,
      full_name: input.full_name,
      email: input.email,
      mobile: input.mobile ?? null,
      company_name: input.company_name ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function createVisaApplication(
  payload: Omit<VisaApplication, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<VisaApplication> {
  const supabase = getSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('visa_applications')
    .insert({
      ...payload,
      user_id: auth.user.id,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as VisaApplication;
}

export async function listMyApplications(): Promise<VisaApplication[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('visa_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as VisaApplication[]) ?? [];
}

export async function savePayment(
  payload: Omit<Payment, 'id' | 'created_at' | 'user_id'>
): Promise<Payment> {
  const supabase = getSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('payments')
    .insert({
      ...payload,
      user_id: auth.user.id,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as Payment;
}

export async function listMyPayments(): Promise<Payment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Payment[]) ?? [];
}

export async function creditWalletInDb(amount: number): Promise<Profile | null> {
  const supabase = getSupabase();
  const profile = await fetchMyProfile();
  if (!profile) return null;
  const next = Number(profile.wallet_balance) + amount;
  const { data, error } = await supabase
    .from('profiles')
    .update({ wallet_balance: next })
    .eq('id', profile.id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function uploadApplicationDocument(input: {
  applicationId: string;
  docType: string;
  file: File;
}): Promise<ApplicationDocument> {
  const supabase = getSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Not authenticated');

  const path = `${auth.user.id}/${input.applicationId}/${Date.now()}_${input.file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('visa-documents')
    .upload(path, input.file, { upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('application_documents')
    .insert({
      application_id: input.applicationId,
      doc_type: input.docType,
      file_name: input.file.name,
      file_path: path,
      mime_type: input.file.type || null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as ApplicationDocument;
}

export async function fetchEvisaCountriesFromDb(): Promise<EvisaCountryRow[] | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('evisa_countries')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return (data as EvisaCountryRow[]) ?? [];
}
