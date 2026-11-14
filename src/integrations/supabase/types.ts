export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: string
          ledger: Database["public"]["Enums"]["ledger"] | null
          reason: string | null
          result: string
          transaction_id: string | null
        }
        Insert: {
          action: string
          actor_id: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          ledger?: Database["public"]["Enums"]["ledger"] | null
          reason?: string | null
          result?: string
          transaction_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          ledger?: Database["public"]["Enums"]["ledger"] | null
          reason?: string | null
          result?: string
          transaction_id?: string | null
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          created_at: string
          id: string
          ledger: Database["public"]["Enums"]["ledger"]
          name: string
          opening_balance: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ledger: Database["public"]["Enums"]["ledger"]
          name: string
          opening_balance?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ledger?: Database["public"]["Enums"]["ledger"]
          name?: string
          opening_balance?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      import_batches: {
        Row: {
          created_at: string
          created_by: string
          file_name: string
          id: string
          ledger: Database["public"]["Enums"]["ledger"]
          rows_imported: number
          rows_skipped: number
          rows_total: number
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          file_name: string
          id?: string
          ledger: Database["public"]["Enums"]["ledger"]
          rows_imported?: number
          rows_skipped?: number
          rows_total?: number
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          file_name?: string
          id?: string
          ledger?: Database["public"]["Enums"]["ledger"]
          rows_imported?: number
          rows_skipped?: number
          rows_total?: number
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reconciliations: {
        Row: {
          account_name: string
          as_of: string
          balance_admin1: number
          balance_admin2: number
          created_at: string
          created_by: string
          difference: number
          id: string
          notes: string | null
        }
        Insert: {
          account_name: string
          as_of: string
          balance_admin1: number
          balance_admin2: number
          created_at?: string
          created_by?: string
          difference: number
          id?: string
          notes?: string | null
        }
        Update: {
          account_name?: string
          as_of?: string
          balance_admin1?: number
          balance_admin2?: number
          created_at?: string
          created_by?: string
          difference?: number
          id?: string
          notes?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category: string | null
          client_ref: string | null
          created_at: string
          created_by: string
          description: string
          fingerprint: string | null
          id: string
          import_id: string | null
          ledger: Database["public"]["Enums"]["ledger"]
          review_status: Database["public"]["Enums"]["review_status"]
          reviewed_at: string | null
          reviewed_by: string | null
          transfer_id: string | null
          tx_date: string
          tx_type: Database["public"]["Enums"]["tx_type"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          category?: string | null
          client_ref?: string | null
          created_at?: string
          created_by?: string
          description: string
          fingerprint?: string | null
          id?: string
          import_id?: string | null
          ledger: Database["public"]["Enums"]["ledger"]
          review_status?: Database["public"]["Enums"]["review_status"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          transfer_id?: string | null
          tx_date: string
          tx_type: Database["public"]["Enums"]["tx_type"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: string | null
          client_ref?: string | null
          created_at?: string
          created_by?: string
          description?: string
          fingerprint?: string | null
          id?: string
          import_id?: string | null
          ledger?: Database["public"]["Enums"]["ledger"]
          review_status?: Database["public"]["Enums"]["review_status"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          transfer_id?: string | null
          tx_date?: string
          tx_type?: Database["public"]["Enums"]["tx_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_balances"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      account_balances: {
        Row: {
          account_id: string | null
          balance: number | null
          expense: number | null
          income: number | null
          ledger: Database["public"]["Enums"]["ledger"] | null
          name: string | null
          opening_balance: number | null
          sort_order: number | null
          transfer_in: number | null
          transfer_out: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_bank_account: {
        Args: {
          p_ledger: Database["public"]["Enums"]["ledger"]
          p_name: string
          p_opening_balance?: number
          p_sort_order?: number
        }
        Returns: {
          created_at: string
          id: string
          ledger: Database["public"]["Enums"]["ledger"]
          name: string
          opening_balance: number
          sort_order: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "bank_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_transaction: {
        Args: {
          p_account_id: string
          p_amount: number
          p_category: string
          p_client_ref: string
          p_date: string
          p_description: string
          p_ledger: Database["public"]["Enums"]["ledger"]
          p_type: Database["public"]["Enums"]["tx_type"]
        }
        Returns: {
          account_id: string
          amount: number
          category: string | null
          client_ref: string | null
          created_at: string
          created_by: string
          description: string
          fingerprint: string | null
          id: string
          import_id: string | null
          ledger: Database["public"]["Enums"]["ledger"]
          review_status: Database["public"]["Enums"]["review_status"]
          reviewed_at: string | null
          reviewed_by: string | null
          transfer_id: string | null
          tx_date: string
          tx_type: Database["public"]["Enums"]["tx_type"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_transfer: {
        Args: {
          p_amount: number
          p_client_ref: string
          p_date: string
          p_from: string
          p_note: string
          p_to: string
        }
        Returns: string
      }
      current_ledger: {
        Args: never
        Returns: Database["public"]["Enums"]["ledger"]
      }
      delete_bank_account: { Args: { p_id: string }; Returns: undefined }
      delete_transaction: {
        Args: { p_id: string; p_reason: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      import_transactions: {
        Args: { p_file_name: string; p_rows: Json; p_skipped_invalid: number }
        Returns: {
          created_at: string
          created_by: string
          file_name: string
          id: string
          ledger: Database["public"]["Enums"]["ledger"]
          rows_imported: number
          rows_skipped: number
          rows_total: number
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "import_batches"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_opening_balance: {
        Args: { p_account_id: string; p_amount: number; p_reason: string }
        Returns: undefined
      }
      set_review_status: {
        Args: {
          p_id: string
          p_status: Database["public"]["Enums"]["review_status"]
        }
        Returns: undefined
      }
      update_bank_account: {
        Args: { p_id: string; p_name: string; p_sort_order: number }
        Returns: {
          created_at: string
          id: string
          ledger: Database["public"]["Enums"]["ledger"]
          name: string
          opening_balance: number
          sort_order: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "bank_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_transaction: {
        Args: {
          p_account_id: string
          p_amount: number
          p_category: string
          p_date: string
          p_description: string
          p_id: string
          p_reason: string
          p_type: Database["public"]["Enums"]["tx_type"]
        }
        Returns: {
          account_id: string
          amount: number
          category: string | null
          client_ref: string | null
          created_at: string
          created_by: string
          description: string
          fingerprint: string | null
          id: string
          import_id: string | null
          ledger: Database["public"]["Enums"]["ledger"]
          review_status: Database["public"]["Enums"]["review_status"]
          reviewed_at: string | null
          reviewed_by: string | null
          transfer_id: string | null
          tx_date: string
          tx_type: Database["public"]["Enums"]["tx_type"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "super_admin" | "admin1" | "admin2"
      ledger: "admin1" | "admin2"
      review_status: "unchecked" | "match" | "mismatch"
      tx_type: "income" | "expense" | "transfer_in" | "transfer_out"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin1", "admin2"],
      ledger: ["admin1", "admin2"],
      review_status: ["unchecked", "match", "mismatch"],
      tx_type: ["income", "expense", "transfer_in", "transfer_out"],
    },
  },
} as const
