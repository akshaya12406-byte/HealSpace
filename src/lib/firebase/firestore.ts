import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './config';

export const createUserProfile = async (user: User, additionalData: object) => {
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
        createdAt,
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
