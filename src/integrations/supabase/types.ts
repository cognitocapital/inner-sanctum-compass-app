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
      ai_companion_logs: {
        Row: {
          content: string
          context_snapshot: Json | null
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          context_snapshot?: Json | null
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          context_snapshot?: Json | null
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
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
      brain_region_views: {
        Row: {
          id: string
          region_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          region_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          region_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      brain_scan_markers: {
        Row: {
          created_at: string
          id: string
          note: string | null
          position_x: number
          position_y: number
          position_z: number
          region_id: string | null
          severity: string
          updated_at: string
          upload_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          position_x: number
          position_y: number
          position_z?: number
          region_id?: string | null
          severity?: string
          updated_at?: string
          upload_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          position_x?: number
          position_y?: number
          position_z?: number
          region_id?: string | null
          severity?: string
          updated_at?: string
          upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_scan_markers_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "brain_scan_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_scan_uploads: {
        Row: {
          created_at: string
          id: string
          label: string | null
          mime_type: string | null
          opacity: number
          original_filename: string | null
          scan_kind: string
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          mime_type?: string | null
          opacity?: number
          original_filename?: string | null
          scan_kind?: string
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          mime_type?: string | null
          opacity?: number
          original_filename?: string | null
          scan_kind?: string
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clinical_assessments: {
        Row: {
          administered_by: string | null
          administered_in: string | null
          assessment_type: string
          created_at: string
          id: string
          instrument_version: string | null
          interpretation: string | null
          mcid_change: number | null
          notes: string | null
          red_flags: Json | null
          responses: Json | null
          score: number | null
          severity: string | null
          subscores: Json | null
          user_id: string
        }
        Insert: {
          administered_by?: string | null
          administered_in?: string | null
          assessment_type: string
          created_at?: string
          id?: string
          instrument_version?: string | null
          interpretation?: string | null
          mcid_change?: number | null
          notes?: string | null
          red_flags?: Json | null
          responses?: Json | null
          score?: number | null
          severity?: string | null
          subscores?: Json | null
          user_id: string
        }
        Update: {
          administered_by?: string | null
          administered_in?: string | null
          assessment_type?: string
          created_at?: string
          id?: string
          instrument_version?: string | null
          interpretation?: string | null
          mcid_change?: number | null
          notes?: string | null
          red_flags?: Json | null
          responses?: Json | null
          score?: number | null
          severity?: string | null
          subscores?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      clinical_audit_log: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      clinical_red_flag_events: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          flag_type: string
          id: string
          instrument: string | null
          message: string | null
          metadata: Json
          resolved_at: string | null
          severity: string
          source_assessment_id: string | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          flag_type: string
          id?: string
          instrument?: string | null
          message?: string | null
          metadata?: Json
          resolved_at?: string | null
          severity?: string
          source_assessment_id?: string | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          flag_type?: string
          id?: string
          instrument?: string | null
          message?: string | null
          metadata?: Json
          resolved_at?: string | null
          severity?: string
          source_assessment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clinician_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          clinician_id: string
          created_at: string
          id: string
          message: string | null
          metadata: Json
          patient_id: string
          resolved_at: string | null
          severity: string
          source_id: string | null
          source_table: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type: string
          clinician_id: string
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json
          patient_id: string
          resolved_at?: string | null
          severity?: string
          source_id?: string | null
          source_table?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          clinician_id?: string
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json
          patient_id?: string
          resolved_at?: string | null
          severity?: string
          source_id?: string | null
          source_table?: string | null
          title?: string
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
          last_soundscape: string | null
          mood: number | null
          pain_level: number | null
          post_session_rating: number | null
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
          last_soundscape?: string | null
          mood?: number | null
          pain_level?: number | null
          post_session_rating?: number | null
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
          last_soundscape?: string | null
          mood?: number | null
          pain_level?: number | null
          post_session_rating?: number | null
          sleep_quality?: number | null
          symptoms_today?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      org_members: {
        Row: {
          created_at: string
          id: string
          member_role: string
          org_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_role?: string
          org_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          member_role?: string
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          name: string
          org_type: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          name: string
          org_type?: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          name?: string
          org_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_clinician_links: {
        Row: {
          accepted_at: string | null
          clinician_id: string | null
          consent_scope: Json
          expires_at: string
          id: string
          invite_code: string
          invited_at: string
          org_id: string | null
          patient_id: string
          revoked_at: string | null
          status: string
        }
        Insert: {
          accepted_at?: string | null
          clinician_id?: string | null
          consent_scope?: Json
          expires_at?: string
          id?: string
          invite_code: string
          invited_at?: string
          org_id?: string | null
          patient_id: string
          revoked_at?: string | null
          status?: string
        }
        Update: {
          accepted_at?: string | null
          clinician_id?: string | null
          consent_scope?: Json
          expires_at?: string
          id?: string
          invite_code?: string
          invited_at?: string
          org_id?: string | null
          patient_id?: string
          revoked_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_clinician_links_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_quests: {
        Row: {
          book_chapter_ref: number | null
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json
          phase: number
          quest_key: string
          quest_type: string
          status: string
          symptom_tags: string[]
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          book_chapter_ref?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          phase?: number
          quest_key: string
          quest_type: string
          status?: string
          symptom_tags?: string[]
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          book_chapter_ref?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          phase?: number
          quest_key?: string
          quest_type?: string
          status?: string
          symptom_tags?: string[]
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_symptoms: Json | null
          current_week: number | null
          daily_goal_minutes: number | null
          display_name: string | null
          dominant_symptoms: string[]
          flame_strength: number
          id: string
          injury_date: string | null
          injury_type: string | null
          onboarding_completed: boolean | null
          personal_scan_optin: boolean
          phoenix_phase: number
          primary_goals: string[] | null
          protocol_name: string | null
          protocol_phase: number | null
          protocol_started_at: string | null
          protocol_type: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_symptoms?: Json | null
          current_week?: number | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          dominant_symptoms?: string[]
          flame_strength?: number
          id: string
          injury_date?: string | null
          injury_type?: string | null
          onboarding_completed?: boolean | null
          personal_scan_optin?: boolean
          phoenix_phase?: number
          primary_goals?: string[] | null
          protocol_name?: string | null
          protocol_phase?: number | null
          protocol_started_at?: string | null
          protocol_type?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_symptoms?: Json | null
          current_week?: number | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          dominant_symptoms?: string[]
          flame_strength?: number
          id?: string
          injury_date?: string | null
          injury_type?: string | null
          onboarding_completed?: boolean | null
          personal_scan_optin?: boolean
          phoenix_phase?: number
          primary_goals?: string[] | null
          protocol_name?: string | null
          protocol_phase?: number | null
          protocol_started_at?: string | null
          protocol_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      protocol_definitions: {
        Row: {
          created_at: string
          description: string | null
          gradient: string | null
          icon_variant: string | null
          id: string
          name: string
          protocol_key: string
          target_audience: string
          total_phases: number
          total_weeks: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          gradient?: string | null
          icon_variant?: string | null
          id?: string
          name: string
          protocol_key: string
          target_audience: string
          total_phases: number
          total_weeks: number
        }
        Update: {
          created_at?: string
          description?: string | null
          gradient?: string | null
          icon_variant?: string | null
          id?: string
          name?: string
          protocol_key?: string
          target_audience?: string
          total_phases?: number
          total_weeks?: number
        }
        Relationships: []
      }
      resource_directory: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_verified: boolean
          name: string
          region: string
          tags: Json
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string
          id?: string
          is_verified?: boolean
          name: string
          region?: string
          tags?: Json
          url?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_verified?: boolean
          name?: string
          region?: string
          tags?: Json
          url?: string
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
      user_affected_regions: {
        Row: {
          created_at: string
          id: string
          note: string | null
          region_id: string
          severity: string | null
          source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          region_id: string
          severity?: string | null
          source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          region_id?: string
          severity?: string | null
          source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          is_shared: boolean
          mood_tag: string | null
          phase: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_shared?: boolean
          mood_tag?: string | null
          phase?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_shared?: boolean
          mood_tag?: string | null
          phase?: number
          title?: string
          updated_at?: string
          user_id?: string
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
      week_progress: {
        Row: {
          chapter_completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          practice_completed: boolean | null
          reflection_completed: boolean | null
          reflection_text: string | null
          updated_at: string
          user_id: string
          week_number: number
        }
        Insert: {
          chapter_completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          practice_completed?: boolean | null
          reflection_completed?: boolean | null
          reflection_text?: string | null
          updated_at?: string
          user_id: string
          week_number: number
        }
        Update: {
          chapter_completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          practice_completed?: boolean | null
          reflection_completed?: boolean | null
          reflection_text?: string | null
          updated_at?: string
          user_id?: string
          week_number?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_linked_clinician: {
        Args: { _clinician_id: string; _patient_id: string }
        Returns: boolean
      }
      is_org_admin: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "clinician" | "admin" | "researcher"
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
    Enums: {
      app_role: ["patient", "clinician", "admin", "researcher"],
    },
  },
} as const
