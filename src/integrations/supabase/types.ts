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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          created_at: string | null
          id: string
          priority_module: string | null
          reason: string | null
          recommendation_date: string
          recommendations: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority_module?: string | null
          reason?: string | null
          recommendation_date?: string
          recommendations: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          priority_module?: string | null
          reason?: string | null
          recommendation_date?: string
          recommendations?: Json
          user_id?: string
        }
        Relationships: []
      }
      clinical_assessments: {
        Row: {
          administered_by: string | null
          assessment_type: string
          created_at: string
          id: string
          notes: string | null
          score: number | null
          severity: string | null
          subscores: Json | null
          user_id: string
        }
        Insert: {
          administered_by?: string | null
          assessment_type: string
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          severity?: string | null
          subscores?: Json | null
          user_id: string
        }
        Update: {
          administered_by?: string | null
          assessment_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          score?: number | null
          severity?: string | null
          subscores?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          check_date: string
          created_at: string | null
          energy_level: number | null
          gratitude_note: string | null
          id: string
          mood: number | null
          pain_level: number | null
          sleep_quality: number | null
          symptoms_today: Json | null
          user_id: string
        }
        Insert: {
          check_date?: string
          created_at?: string | null
          energy_level?: number | null
          gratitude_note?: string | null
          id?: string
          mood?: number | null
          pain_level?: number | null
          sleep_quality?: number | null
          symptoms_today?: Json | null
          user_id: string
        }
        Update: {
          check_date?: string
          created_at?: string | null
          energy_level?: number | null
          gratitude_note?: string | null
          id?: string
          mood?: number | null
          pain_level?: number | null
          sleep_quality?: number | null
          symptoms_today?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_symptoms: Json | null
          daily_goal_minutes: number | null
          display_name: string | null
          id: string
          injury_date: string | null
          injury_type: string | null
          onboarding_completed: boolean | null
          primary_goals: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_symptoms?: Json | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          id: string
          injury_date?: string | null
          injury_type?: string | null
          onboarding_completed?: boolean | null
          primary_goals?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_symptoms?: Json | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          id?: string
          injury_date?: string | null
          injury_type?: string | null
          onboarding_completed?: boolean | null
          primary_goals?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_logs: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          exercise_id: string | null
          id: string
          metrics: Json | null
          module_type: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          metrics?: Json | null
          module_type: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          metrics?: Json | null
          module_type?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          achievements: Json | null
          created_at: string | null
          current_level: number | null
          current_streak: number | null
          id: string
          last_active_date: string | null
          longest_streak: number | null
          modules_unlocked: Json | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
          weekly_goal_sessions: number | null
        }
        Insert: {
          achievements?: Json | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_active_date?: string | null
          longest_streak?: number | null
          modules_unlocked?: Json | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
          weekly_goal_sessions?: number | null
        }
        Update: {
          achievements?: Json | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          id?: string
          last_active_date?: string | null
          longest_streak?: number | null
          modules_unlocked?: Json | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_goal_sessions?: number | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
