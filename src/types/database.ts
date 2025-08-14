// src/types/database.ts

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
        // ... (existing profiles table)
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
          onboarding_complete: boolean | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          onboarding_complete?: boolean | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          onboarding_complete?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      // Add the new goals table definition
      goals: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          title: string;
          description: string | null;
          due_date: string | null;
          priority: string | null;
          is_completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          priority?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          priority?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'goals_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      goal_steps: {
        Row: {
          id: string;
          goal_id: string;
          user_id: string;
          title: string;
          is_completed: boolean;
          created_at: string;
          step_order: number | null;
        };
        Insert: {
          id?: string;
          goal_id: string;
          user_id: string;
          title: string;
          is_completed?: boolean;
          created_at?: string;
          step_order?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          is_completed?: boolean;
          step_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'goal_steps_goal_id_fkey';
            columns: ['goal_id'];
            referencedRelation: 'goals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'goal_steps_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
