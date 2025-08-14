// src/pages/dashboard/DashboardPage.tsx
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import { useAuthStore } from '../../stores/authStore';

export default function DashboardPage() {
  const profile = useAuthStore((state) => state.profile);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Server sign out failed, proceeding with local sign out:', error);
    } finally {
      useAuthStore.getState().setSession(null);
      useAuthStore.getState().setProfile(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-10 text-center bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="User avatar"
            className="w-24 h-24 mx-auto mb-4 rounded-full"
          />
        )}
        <h1 className="mb-4 text-4xl font-bold">Dashboard</h1>
        <p className="mb-6 text-lg">
          Welcome, {profile?.full_name || 'User'}!
        </p>
        <div className="grid grid-cols-1 gap-4">
            <Link
                to="/goals"
                className="px-6 py-3 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
            >
                Manage My Goals
            </Link>
            <Link
                to="/profile"
                className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
                Edit Profile
            </Link>
            <button
                onClick={handleLogout}
                className="px-6 py-3 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
            >
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
}
