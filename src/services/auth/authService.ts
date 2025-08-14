// src/services/auth/authService.ts

import { supabase } from '../api/supabaseClient';
import { useAuthStore } from '../../stores/authStore';
import type { SignInWithPasswordCredentials } from '@supabase/supabase-js';
import type { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

// Set the global state based on Supabase's auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.getState().setSession(session);

  if (event === 'SIGNED_IN') {
    authService.getProfile();
  }
  
  // When the user signs out, clear the profile from the store.
  if (event === 'SIGNED_OUT') {
    useAuthStore.getState().setProfile(null);
  }

  useAuthStore.getState().setLoading(false);
});

export const authService = {
  /**
   * Signs up a new user.
   */
  signUp: async (credentials: SignUpWithPasswordCredentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) throw error;
    return data;
  },

  /**
   * Signs in an existing user.
   */
  signIn: async (credentials: SignInWithPasswordCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  },

  /**
   * Signs out the current user.
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Fetches the profile for the currently logged-in user.
   */
  getProfile: async () => {
    try {
      const { user } = useAuthStore.getState().session || {};
      if (!user) throw new Error('No user logged in');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        useAuthStore.getState().setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  /**
   * Updates a user's profile.
   */
  updateProfile: async (profile: Partial<Profile>) => {
    const { user } = useAuthStore.getState().session || {};
    if (!user) throw new Error('No user logged in');

    const updateData = {
      ...profile,
      id: user.id,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updateData);
    if (error) throw error;

    // Refresh the local profile state
    await authService.getProfile();
  },

  /**
   * Uploads a new avatar image to Supabase Storage.
   */
  uploadAvatar: async (file: File) => {
    const { user } = useAuthStore.getState().session || {};
    if (!user) throw new Error('No user logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (error) throw error;

    // After uploading, update the user's avatar_url in their profile
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    await authService.updateProfile({ avatar_url: publicUrl });
  },

  /**
   * Gets the current session from Supabase.
   */
  getSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    useAuthStore.getState().setSession(session);
    // If a session exists, fetch the profile
    if (session) {
      await authService.getProfile();
    }
    useAuthStore.getState().setLoading(false);
    return session;
  },
};

// Fetch session on initial load
authService.getSession();
