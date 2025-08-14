// src/pages/onboarding/OnboardingPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';
import WelcomeStep from './WelcomeStep';
import ProfileStep from './ProfileStep';

const steps = [
    { id: 1, component: WelcomeStep },
    { id: 2, component: ProfileStep },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    };

    const handleFinish = async () => {
        try {
            // Mark onboarding as complete in the database
            await authService.updateProfile({ onboarding_complete: true });
            // Navigate to the dashboard
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            alert("There was an error completing your setup. Please try again.");
        }
    };

    const CurrentStepComponent = steps[currentStep - 1].component;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-xl">
                <CurrentStepComponent />
                <div className="flex justify-end pt-4">
                    {currentStep < steps.length ? (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Next &rarr;
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                            Finish Setup
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
