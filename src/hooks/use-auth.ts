'use client';

import { useUser } from '@/firebase';

export const useAuth = () => {
  const { user, isUserLoading } = useUser();
  
  // In development, you can uncomment this block to simulate being a therapist
  // const mockTherapist = {
  //   uid: 'therapist_test_uid',
  //   email: 'therapist@healspace.com',
  //   displayName: 'Dr. Emily Carter',
  //   // Add any other user properties your app might need
  // };

  return { 
    user, // for production, use the real user: user
    // user: mockTherapist, // for testing, use the mock user: mockTherapist
    loading: isUserLoading 
  };
};
