
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './config';

export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    createdAt: Timestamp;
    age: number;
    status: 'pending_approval' | 'approved';
    role: 'user' | 'therapist';
}


export const createUserProfile = async (user: User, additionalData: Partial<UserProfile>) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();
    try {
      await setDoc(userRef, {
        uid: user.uid,
        displayName,
        email,
        photoURL,
        createdAt: Timestamp.fromDate(createdAt),
        role: 'user', // Default role
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }
  return userRef;
};

export const updateUserProfileStatus = async (userId: string, status: 'pending_approval' | 'approved') => {
    if (!userId) return;
    const userRef = doc(db, 'users', userId);
    try {
        await updateDoc(userRef, { status });
    } catch (error) {
        console.error('Error updating user status:', error);
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!userId) return null;
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return snapshot.data() as UserProfile;
    } else {
        console.log("No such document!");
        // To test the therapist view, we can mock a therapist user
        if (process.env.NODE_ENV === 'development' && userId === 'therapist_test_uid') {
             return {
                uid: 'therapist_test_uid',
                displayName: 'Dr. Emily Carter',
                email: 'therapist@healspace.com',
                photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2MTkwOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080',
                createdAt: Timestamp.now(),
                age: 42,
                status: 'approved',
                role: 'therapist',
            };
        }
        return null;
    }
};
