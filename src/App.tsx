// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import OnboardingPage from './components/onboarding/OnboardingPage';
import GoalsPage from './pages/goals/GoalsPage'; // Import the new Goals page

// This component protects routes that require a user to be logged in.
const AuthRoute = ({ children }: { children: React.ReactElement }) => {
  const session = useAuthStore((state) => state.session);
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// This component protects the main app from users who haven't completed onboarding.
const OnboardingRoute = ({ children }: { children: React.ReactElement }) => {
    const profile = useAuthStore((state) => state.profile);

    // If we have a profile and onboarding is not complete, redirect.
    if (profile && !profile.onboarding_complete) {
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};


function App() {
  const { loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Routes that require authentication but NOT onboarding completion */}
        <Route
          path="/onboarding"
          element={
            <AuthRoute>
              <OnboardingPage />
            </AuthRoute>
          }
        />

        {/* Routes that require BOTH authentication AND onboarding completion */}
        <Route
          path="/"
          element={
            <AuthRoute>
              <OnboardingRoute>
                <DashboardPage />
              </OnboardingRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <OnboardingRoute>
                <DashboardPage />
              </OnboardingRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <OnboardingRoute>
                <ProfilePage />
              </OnboardingRoute>
            </AuthRoute>
          }
        />
        {/* Add the new goals route */}
        <Route
            path="/goals"
            element={
                <AuthRoute>
                    <OnboardingRoute>
                        <GoalsPage />
                    </OnboardingRoute>
                </AuthRoute>
            }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
