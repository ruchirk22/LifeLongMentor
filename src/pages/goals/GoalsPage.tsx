// src/pages/goals/GoalsPage.tsx
import { useEffect, useState } from 'react';
import { useGoalStore } from '../../stores/goalStore';
import { Link } from 'react-router-dom';
import GoalForm from '../../components/forms/GoalForm';
import type { Database } from '../../types/database';

type Goal = Database['public']['Tables']['goals']['Row'];

export default function GoalsPage() {
  const { goals, loading, error, fetchGoals, addGoal, updateGoal, toggleComplete, deleteGoal } = useGoalStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleOpenModal = (goal: Goal | null = null) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingGoal(null);
    setIsModalOpen(false);
  };

  const handleSubmitForm = async (formData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'is_completed' | 'completed_at'>) => {
    setIsSubmitting(true);
    if (editingGoal) {
      await updateGoal(editingGoal.id, formData);
    } else {
      await addGoal(formData);
    }
    setIsSubmitting(false);
    handleCloseModal();
  };

  if (loading && goals.length === 0) return <div className="text-center p-10">Loading goals...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm"
          >
            + Add Goal
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {goals.length > 0 ? (
                goals.map((goal) => (
                <li key={goal.id} className="hover:bg-gray-50">
                    <Link to={`/goal/${goal.id}`} className="p-4 flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <input
                        type="checkbox"
                        checked={goal.is_completed}
                        onChange={(e) => {
                            e.preventDefault(); // Prevent navigation when clicking checkbox
                            toggleComplete(goal.id, !goal.is_completed);
                        }}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="ml-4">
                        <p className={`text-lg font-medium text-gray-900 ${goal.is_completed ? 'line-through text-gray-500' : ''}`}>
                            {goal.title}
                        </p>
                        <p className="text-sm text-gray-500">{goal.priority} {goal.due_date ? `· Due ${new Date(goal.due_date).toLocaleDateString()}` : ''}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={(e) => { e.preventDefault(); handleOpenModal(goal); }} className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={(e) => { e.preventDefault(); deleteGoal(goal.id); }} className="text-sm text-red-600 hover:text-red-900">Delete</button>
                    </div>
                    </Link>
                </li>
                ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                You haven't set any goals yet. Let's add one!
              </li>
            )}
          </ul>
        </div>
        <div className="text-center mt-6">
            <Link to="/dashboard" className="font-medium text-indigo-600 hover:text-indigo-500">
                &larr; Back to Dashboard
            </Link>
        </div>
      </div>

      {isModalOpen && (
        <GoalForm 
          initialData={editingGoal}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
