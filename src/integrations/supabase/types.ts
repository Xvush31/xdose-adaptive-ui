// Minimal Database type for Supabase client (temporary, until types are régénérés)
export type Database = {
  public: {
    Tables: {
      role_requests: {
        Row: {
          id: string;
          user_id: string;
          user_email: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_email: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_email?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
