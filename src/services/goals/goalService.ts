// src/services/goals/goalService.ts
import { supabase } from '../api/supabaseClient';
import { useAuthStore } from '../../stores/authStore';
import type { Database } from '../../types/database';

type Goal = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['goals']['Update'];
type GoalStep = Database['public']['Tables']['goal_steps']['Row'];
type GoalStepInsert = Database['public']['Tables']['goal_steps']['Insert'];
type GoalStepUpdate = Database['public']['Tables']['goal_steps']['Update'];

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
   * Fetches a single goal by its ID.
   */
  async getGoalById(id: string): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
        // It's normal for single() to error if no row is found.
        // We'll return null in that case.
        if (error.code === 'PGRST116') {
            return null;
        }
        throw error;
    }
    return data;
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

  /**
   * Fetches all steps for a specific goal.
   */
  async getGoalSteps(goalId: string): Promise<GoalStep[]> {
    const { data, error } = await supabase
      .from('goal_steps')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Creates a single new step for a goal.
   */
  async createGoalStep(stepData: Omit<GoalStepInsert, 'user_id'>): Promise<GoalStep> {
    const { user } = useAuthStore.getState().session || {};
    if (!user) throw new Error('User is not authenticated');

    const { data, error } = await supabase
      .from('goal_steps')
      .insert({ ...stepData, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  /**
   * Creates multiple steps for a goal in a single batch.
   */
  async bulkCreateGoalSteps(steps: Omit<GoalStepInsert, 'user_id'>[]): Promise<GoalStep[]> {
    const { user } = useAuthStore.getState().session || {};
    if (!user) throw new Error('User is not authenticated');

    const stepsWithUser = steps.map(step => ({ ...step, user_id: user.id }));

    const { data, error } = await supabase
        .from('goal_steps')
        .insert(stepsWithUser)
        .select();

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing goal step.
   */
  async updateGoalStep(id: string, updates: GoalStepUpdate): Promise<GoalStep> {
    const { data, error } = await supabase
      .from('goal_steps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a goal step.
   */
  async deleteGoalStep(id: string): Promise<void> {
    const { error } = await supabase.from('goal_steps').delete().eq('id', id);
    if (error) throw error;
  },

};
