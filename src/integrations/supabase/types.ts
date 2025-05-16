export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string | null
          date: string | null
          id: number
          title: string | null
        }
        Insert: {
          content?: string | null
          date?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          content?: string | null
          date?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      calculator_usage: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          co2_reduction: number | null
          description: string | null
          id: number
          title: string | null
        }
        Insert: {
          co2_reduction?: number | null
          description?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          co2_reduction?: number | null
          description?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      material_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          applicable_standards: string | null
          category_id: number | null
          co2e_avg: number | null
          co2e_max: number | null
          co2e_min: number | null
          created_at: string | null
          description: string | null
          id: number
          material: string
          ncc_requirements: string | null
          sustainability_notes: string | null
          sustainability_score: number | null
          sustainability_score_is_manual: boolean | null
          updated_at: string | null
        }
        Insert: {
          applicable_standards?: string | null
          category_id?: number | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          material: string
          ncc_requirements?: string | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          updated_at?: string | null
        }
        Update: {
          applicable_standards?: string | null
          category_id?: number | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          material?: string
          ncc_requirements?: string | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      materials_backup: {
        Row: {
          alternativeto: string | null
          carbon_footprint_kgco2e_kg: number | null
          carbon_footprint_kgco2e_tonne: number | null
          category: string | null
          factor: number | null
          id: string
          name: string | null
          notes: string | null
          recyclability: string | null
          region: string | null
          sustainabilityscore: number | null
          tags: string[] | null
          unit: string | null
        }
        Insert: {
          alternativeto?: string | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          category?: string | null
          factor?: number | null
          id?: string
          name?: string | null
          notes?: string | null
          recyclability?: string | null
          region?: string | null
          sustainabilityscore?: number | null
          tags?: string[] | null
          unit?: string | null
        }
        Update: {
          alternativeto?: string | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          category?: string | null
          factor?: number | null
          id?: string
          name?: string | null
          notes?: string | null
          recyclability?: string | null
          region?: string | null
          sustainabilityscore?: number | null
          tags?: string[] | null
          unit?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          status: string
          stripe_payment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          status: string
          stripe_payment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          status?: string
          stripe_payment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          had_trial: boolean | null
          id: string
          role: string | null
          subscription_tier: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          had_trial?: boolean | null
          id: string
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          had_trial?: boolean | null
          id?: string
          role?: string | null
          subscription_tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          energy: Json | null
          id: string
          materials: Json | null
          name: string
          result: Json | null
          tags: string[] | null
          total: number | null
          transport: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          energy?: Json | null
          id?: string
          materials?: Json | null
          name: string
          result?: Json | null
          tags?: string[] | null
          total?: number | null
          transport?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          energy?: Json | null
          id?: string
          materials?: Json | null
          name?: string
          result?: Json | null
          tags?: string[] | null
          total?: number | null
          transport?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      dependent_view1: {
        Row: {
          applicable_standards: string | null
          category_id: number | null
          co2e_avg: number | null
          co2e_max: number | null
          co2e_min: number | null
          created_at: string | null
          description: string | null
          id: number | null
          material: string | null
          ncc_requirements: string | null
          sustainability_notes: string | null
          sustainability_score: number | null
          sustainability_score_is_manual: boolean | null
          updated_at: string | null
        }
        Insert: {
          applicable_standards?: string | null
          category_id?: number | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          material?: string | null
          ncc_requirements?: string | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          updated_at?: string | null
        }
        Update: {
          applicable_standards?: string | null
          category_id?: number | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          material?: string | null
          ncc_requirements?: string | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      dependent_view2: {
        Row: {
          applicable_standards: string | null
          category_id: number | null
          co2e_avg: number | null
          co2e_max: number | null
          co2e_min: number | null
          created_at: string | null
          description: string | null
          id: number | null
          material: string | null
          ncc_requirements: string | null
          sustainability_notes: string | null
          sustainability_score: number | null
          sustainability_score_is_manual: boolean | null
          updated_at: string | null
        }
        Insert: {
          applicable_standards?: string | null
          category_id?: number | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          material?: string | null
          ncc_requirements?: string | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          updated_at?: string | null
        }
        Update: {
          applicable_standards?: string | null
          category_id?: number | null
          co2e_avg?: number | null
          co2e_max?: number | null
          co2e_min?: number | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          material?: string | null
          ncc_requirements?: string | null
          sustainability_notes?: string | null
          sustainability_score?: number | null
          sustainability_score_is_manual?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      material_sustainability_ranking: {
        Row: {}
        Relationships: []
      }
      materials_view: {
        Row: {
          alternativeto: string | null
          carbon_footprint_kgco2e_kg: number | null
          carbon_footprint_kgco2e_tonne: number | null
          category: string | null
          factor: number | null
          id: string | null
          name: string | null
          notes: string | null
          recyclability: string | null
          region: string | null
          sustainabilityscore: number | null
          tags: string[] | null
          unit: string | null
        }
        Insert: {
          alternativeto?: string | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          category?: string | null
          factor?: number | null
          id?: string | null
          name?: string | null
          notes?: string | null
          recyclability?: string | null
          region?: string | null
          sustainabilityscore?: number | null
          tags?: string[] | null
          unit?: string | null
        }
        Update: {
          alternativeto?: string | null
          carbon_footprint_kgco2e_kg?: number | null
          carbon_footprint_kgco2e_tonne?: number | null
          category?: string | null
          factor?: number | null
          id?: string | null
          name?: string | null
          notes?: string | null
          recyclability?: string | null
          region?: string | null
          sustainabilityscore?: number | null
          tags?: string[] | null
          unit?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_sustainability_scores: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_total_co2e: {
        Args: { material_quantities: Json }
        Returns: Json
      }
      calculate_weighted_sustainability: {
        Args: {
          carbon_fp: number
          recyclability: number
          regional_factor: number
        }
        Returns: number
      }
      get_material_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
        }[]
      }
      get_materials: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Tables"]["materials"]["Row"][]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      set_manual_sustainability_score: {
        Args: { material_id: number; score: number; notes: string }
        Returns: undefined
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
