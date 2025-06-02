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
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id: number
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: number
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          user_id: string
          video_id: number
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          user_id: string
          video_id: number
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          user_id?: string
          video_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id: number
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_requests: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string | null
          creator_id: string
          features: string[] | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          features?: string[] | null
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          features?: string[] | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      text_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          images: string[] | null
          user_id: string
          visibility: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          user_id: string
          visibility?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          user_id?: string
          visibility?: string | null
        }
        Relationships: []
      }
      tips: {
        Row: {
          amount: number
          created_at: string | null
          from_user_id: string
          id: string
          message: string | null
          to_user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          from_user_id: string
          id?: string
          message?: string | null
          to_user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          from_user_id?: string
          id?: string
          message?: string | null
          to_user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          tier_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          tier_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          tier_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          comments_count: number | null
          created_at: string | null
          description: string | null
          duration: number | null
          file_path: string
          file_size: number | null
          id: string
          is_premium: boolean | null
          likes_count: number | null
          required_tier_id: string | null
          status: string | null
          thumbnail_path: string | null
          title: string
          updated_at: string | null
          user_id: string
          views_count: number | null
          visibility: string | null
        }
        Insert: {
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          is_premium?: boolean | null
          likes_count?: number | null
          required_tier_id?: string | null
          status?: string | null
          thumbnail_path?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          views_count?: number | null
          visibility?: string | null
        }
        Update: {
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          is_premium?: boolean | null
          likes_count?: number | null
          required_tier_id?: string | null
          status?: string | null
          thumbnail_path?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_required_tier_id_fkey"
            columns: ["required_tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
