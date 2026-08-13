export type UserRole = 'b2b' | 'b2c';
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'pending_docs'
  | 'pending_payment'
  | 'paid'
  | 'approved'
  | 'rejected';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'demo';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          mobile: string | null;
          company_name: string | null;
          wallet_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          email: string;
          mobile?: string | null;
          company_name?: string | null;
          wallet_balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          email?: string;
          mobile?: string | null;
          company_name?: string | null;
          wallet_balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      agent_details: {
        Row: {
          id: string;
          user_id: string;
          gst_no: string | null;
          pan_no: string | null;
          tan_no: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          pin: string | null;
          invoice_frequency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gst_no?: string | null;
          pan_no?: string | null;
          tan_no?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          pin?: string | null;
          invoice_frequency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['agent_details']['Insert']>;
        Relationships: [];
      };
      evisa_countries: {
        Row: {
          id: string;
          name: string;
          region: string;
          processing: string | null;
          validity: string | null;
          entry: string | null;
          summary: string | null;
          visa_fee: number;
          handling_fee: number;
          bank_charge_percent: number;
          upi_bank_charge_percent: number;
          required_docs: Json;
          form_fields: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          region: string;
          processing?: string | null;
          validity?: string | null;
          entry?: string | null;
          summary?: string | null;
          visa_fee?: number;
          handling_fee?: number;
          bank_charge_percent?: number;
          upi_bank_charge_percent?: number;
          required_docs?: Json;
          form_fields?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['evisa_countries']['Insert']>;
        Relationships: [];
      };
      visa_applications: {
        Row: {
          id: string;
          user_id: string;
          country_id: string;
          applicant_name: string;
          passport_no: string;
          email: string;
          mobile: string;
          address: string | null;
          dob: string | null;
          nationality: string | null;
          departure_date: string | null;
          return_date: string | null;
          extra_fields: Json;
          status: ApplicationStatus;
          visa_fee: number;
          handling_fee: number;
          bank_charges: number;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          country_id: string;
          applicant_name: string;
          passport_no: string;
          email: string;
          mobile: string;
          address?: string | null;
          dob?: string | null;
          nationality?: string | null;
          departure_date?: string | null;
          return_date?: string | null;
          extra_fields?: Json;
          status?: ApplicationStatus;
          visa_fee?: number;
          handling_fee?: number;
          bank_charges?: number;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['visa_applications']['Insert']>;
        Relationships: [];
      };
      application_documents: {
        Row: {
          id: string;
          application_id: string;
          doc_type: string;
          file_name: string;
          file_path: string;
          mime_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          doc_type: string;
          file_name: string;
          file_path: string;
          mime_type?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['application_documents']['Insert']>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          application_id: string | null;
          amount: number;
          currency: string;
          method: PaymentMethod;
          status: PaymentStatus;
          purpose: string;
          provider: string;
          provider_payment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          application_id?: string | null;
          amount: number;
          currency?: string;
          method?: PaymentMethod;
          status?: PaymentStatus;
          purpose: string;
          provider?: string;
          provider_payment_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      application_status: ApplicationStatus;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type VisaApplication = Database['public']['Tables']['visa_applications']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type ApplicationDocument = Database['public']['Tables']['application_documents']['Row'];
export type EvisaCountryRow = Database['public']['Tables']['evisa_countries']['Row'];
