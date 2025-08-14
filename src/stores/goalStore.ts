// src/stores/goalStore.ts
import { create } from 'zustand';
import { goalService } from '../services/goals/goalService';
import type { Database } from '../types/database';

type Goal = Database['public']['Tables']['goals']['Row'];

interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (newGoal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'is_completed' | 'completed_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleComplete: (id: string, isCompleted: boolean) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const goals = await goalService.getGoals();
      set({ goals, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addGoal: async (newGoal) => {
    try {
      const createdGoal = await goalService.createGoal(newGoal);
      set((state) => ({ goals: [createdGoal, ...state.goals] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const updatedGoal = await goalService.updateGoal(id, updates);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updatedGoal : g)),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteGoal: async (id) => {
    try {
      await goalService.deleteGoal(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  
  toggleComplete: async (id, isCompleted) => {
      const updates = {
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
      };
      get().updateGoal(id, updates);
  }
}));
