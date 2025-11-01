'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, UserProfile } from '@/lib/firebase/firestore';

export function useUserProfile(userId: string | undefined) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!userId) {
        setLoading(false);
        setUserProfile(null);
        return;
      }

      setLoading(true);
      try {
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
      } catch (e: any) {
        setError(e);
        console.error("Failed to fetch user profile:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId]);

  return { userProfile, loading, error };
}
