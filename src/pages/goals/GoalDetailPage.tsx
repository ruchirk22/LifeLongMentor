// src/pages/goals/GoalDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGoalStore } from '../../stores/goalStore';
import type { Database } from '../../types/database';

type GoalStep = Database['public']['Tables']['goal_steps']['Row'];

export default function GoalDetailPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const { goals, steps, loading, error, fetchGoalById, fetchSteps, generateAndAddSteps, addStep, updateStep, deleteStep } = useGoalStore();
  const [newStepTitle, setNewStepTitle] = useState('');

  // Find the goal from the store
  const goal = goals.find(g => g.id === goalId);

  useEffect(() => {
    // If goalId exists and the goal is not in our store, fetch it.
    if (goalId && !goal) {
      fetchGoalById(goalId);
    }
    // Fetch steps if they aren't already loaded for this goal
    if (goalId && !steps[goalId]) {
      fetchSteps(goalId);
    }
  }, [goalId, goal, steps, fetchGoalById, fetchSteps]);

  const goalSteps = goalId ? steps[goalId] || [] : [];
  
  const handleAddStep = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newStepTitle.trim() || !goalId) return;
      await addStep(goalId, newStepTitle);
      setNewStepTitle('');
  }
  
  const handleToggleStep = (step: GoalStep) => {
      if (!goalId) return;
      updateStep(goalId, step.id, { is_completed: !step.is_completed });
  }

  // Show a loading indicator while the initial goal data is being fetched.
  if (loading && !goal) {
    return <div className="p-10 text-center text-gray-500">Loading goal details...</div>;
  }

  // If after loading, the goal is still not found, it likely doesn't exist.
  if (!goal) {
    return <div className="p-10 text-center">Goal not found. <Link to="/goals" className="text-indigo-600">Go back to all goals</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{goal.title}</h1>
          <p className="text-gray-600 mt-2">{goal.description}</p>
          <div className="text-sm text-gray-500 mt-2">
            <span>Priority: {goal.priority}</span>
            {goal.due_date && <span> · Due: {new Date(goal.due_date).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Action Steps</h2>
            <button
              onClick={() => generateAndAddSteps(goal)}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400"
            >
              ✨ {loading ? 'Thinking...' : 'Suggest Steps with AI'}
            </button>
          </div>
          
          {error && <p className="text-red-500 mb-4">AI Error: {error}</p>}

          <ul className="space-y-3">
            {goalSteps.map(step => (
              <li key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={step.is_completed}
                    onChange={() => handleToggleStep(step)}
                    className="h-5 w-5 rounded border-gray-300"
                  />
                  <p className={`ml-3 ${step.is_completed ? 'line-through text-gray-500' : ''}`}>{step.title}</p>
                </div>
                <button onClick={() => goalId && deleteStep(goalId, step.id)} className="text-red-500 hover:text-red-700">✕</button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddStep} className="mt-4 flex gap-2">
            <input 
                type="text"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="Add a new step manually"
                className="flex-grow px-3 py-2 border rounded-md"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">+</button>
          </form>
        </div>
        <div className="text-center mt-6">
            <Link to="/goals" className="font-medium text-indigo-600 hover:text-indigo-500">
                &larr; Back to All Goals
            </Link>
        </div>
      </div>
    </div>
  );
}
