// src/services/goals/goalService.ts
import { supabase } from '../api/supabaseClient';
import { useAuthStore } from '../../stores/authStore';
import type { Database } from '../../types/database';

type Goal = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['goals']['Update'];

export const goalService = {
  /**
   * Fetches all goals for the current user.
   */
  async getGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Creates a new goal.
   */
  async createGoal(goalData: Omit<GoalInsert, 'user_id'>): Promise<Goal> {
    const { user } = useAuthStore.getState().session || {};
    if (!user) throw new Error('User is not authenticated');

    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goalData, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing goal.
   */
  async updateGoal(id: string, updates: GoalUpdate): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a goal.
   */
  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
  },
};
