// src/components/onboarding/WelcomeStep.tsx
import { useAuthStore } from '../../stores/authStore';

export default function WelcomeStep() {
    const profile = useAuthStore((state) => state.profile);

    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Lifelong Mentor!</h2>
            <p className="mt-4 text-lg text-gray-600">
                Hi {profile?.full_name || 'there'}! We're excited to have you on board.
            </p>
            <p className="mt-2 text-gray-600">
                Let's get your profile set up so you can start achieving your goals.
            </p>
        </div>
    );
}
