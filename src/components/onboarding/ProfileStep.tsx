// src/components/onboarding/ProfileStep.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth/authService';
import Avatar from '../ui/Avatar';

export default function ProfileStep() {
    const { profile } = useAuthStore();
    const [uploading, setUploading] = useState(false);
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
            setWebsite(profile.website || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    // This function just saves the data. The "Finish" button is in the parent.
    const handleProfileUpdate = async () => {
        try {
            await authService.updateProfile({ username, website });
            // No alert needed here, as the flow continues.
        } catch (error: any) {
            alert(`Error updating profile: ${error.message}`);
        }
    };
    const handleAvatarUpload = async (file: File) => {
        setUploading(true);
        try {
            await authService.uploadAvatar(file);
        } catch (error: any) {
            alert(`Error uploading avatar: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Set Up Your Public Profile</h2>
            <p className="text-center text-gray-600 mb-6">This information will be visible to others.</p>
            <div className="space-y-6">
                 <Avatar
                    url={avatarUrl}
                    onUpload={handleAvatarUpload}
                    uploading={uploading}
                />
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={handleProfileUpdate} // Save when user clicks away
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        onBlur={handleProfileUpdate} // Save when user clicks away
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}
