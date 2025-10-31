'use client';

import { useUser } from '@/firebase';

export const useAuth = () => {
  const { user, isUserLoading } = useUser();
  // Match the old API for now
  return { user, loading: isUserLoading };
};
