import { doc, setDoc, getDoc } from 'firebase/firestore';
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
