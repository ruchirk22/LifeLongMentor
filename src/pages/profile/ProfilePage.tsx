// src/pages/profile/ProfilePage.tsx
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth/authService';
import Avatar from '../../components/ui/Avatar';

export default function ProfilePage() {
  const { profile, session } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
      setWebsite(profile.website || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        username,
        website,
      });
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      await authService.uploadAvatar(file);
      // The authStore will be updated automatically by the service
    } catch (error: any) {
      alert(`Error uploading avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-2xl p-8 mx-auto space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Your Profile
        </h2>

        <Avatar
          url={avatarUrl}
          onUpload={handleAvatarUpload}
          uploading={uploading}
        />

        <form className="space-y-6" onSubmit={handleUpdateProfile}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={session?.user?.email || ''}
              disabled
              className="w-full px-3 py-2 mt-1 bg-gray-200 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700"
            >
              Website
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            to="/dashboard"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
