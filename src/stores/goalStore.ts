// src/stores/goalStore.ts
import { create } from 'zustand';
import { goalService } from '../services/goals/goalService';
import { aiService } from '../services/api/aiService';
import type { Database } from '../types/database';

type Goal = Database['public']['Tables']['goals']['Row'];
type GoalStep = Database['public']['Tables']['goal_steps']['Row'];

interface GoalState {
  goals: Goal[];
  steps: { [goalId: string]: GoalStep[] };
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  fetchGoalById: (id: string) => Promise<void>; // This line was missing
  addGoal: (newGoal: any) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleComplete: (id: string, isCompleted: boolean) => Promise<void>;
  
  // Step actions
  fetchSteps: (goalId: string) => Promise<void>;
  generateAndAddSteps: (goal: Goal) => Promise<void>;
  addStep: (goalId: string, title: string) => Promise<void>;
  updateStep: (goalId: string, stepId: string, updates: Partial<GoalStep>) => Promise<void>;
  deleteStep: (goalId: string, stepId: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  steps: {},
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

  /**
   * Fetches a single goal and adds it to the store.
   */
  fetchGoalById: async (id: string) => {
    set({ loading: true });
    try {
      const goal = await goalService.getGoalById(id);
      if (goal) {
        set((state) => ({
          // Add or update the goal in the main array without removing others
          goals: [
            ...state.goals.filter(g => g.id !== id),
            goal
          ],
        }));
      }
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
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
  },

   // --- Step Actions ---
  fetchSteps: async (goalId) => {
    set({ loading: true });
    try {
      const steps = await goalService.getGoalSteps(goalId);
      set((state) => ({
        steps: { ...state.steps, [goalId]: steps },
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
  generateAndAddSteps: async (goal) => {
    set({ loading: true, error: null });
    try {
        const suggestions = await aiService.generateGoalSteps(goal.title, goal.description);
        const newSteps = suggestions.map(s => ({ title: s.title, goal_id: goal.id }));
        const createdSteps = await goalService.bulkCreateGoalSteps(newSteps);
        
        set((state) => ({
            steps: { ...state.steps, [goal.id]: [...(state.steps[goal.id] || []), ...createdSteps] },
            loading: false,
        }));

    } catch (err: any) {
        set({ error: err.message, loading: false });
    }
  },

  addStep: async (goalId, title) => {
    try {
      const newStep = await goalService.createGoalStep({ goal_id: goalId, title });
      set((state) => ({
        steps: { ...state.steps, [goalId]: [...(state.steps[goalId] || []), newStep] },
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateStep: async (goalId, stepId, updates) => {
    try {
      const updatedStep = await goalService.updateGoalStep(stepId, updates);
      set((state) => ({
        steps: {
          ...state.steps,
          [goalId]: state.steps[goalId].map((s) => (s.id === stepId ? updatedStep : s)),
        },
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteStep: async (goalId, stepId) => {
    try {
      await goalService.deleteGoalStep(stepId);
      set((state) => ({
        steps: {
          ...state.steps,
          [goalId]: state.steps[goalId].filter((s) => s.id !== stepId),
        },
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

}));
