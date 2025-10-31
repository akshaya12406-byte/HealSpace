import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type UserCredential,
  type User,
} from 'firebase/auth';
import { app } from './config';
import { createUserProfile, updateUserProfileStatus } from './firestore';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (email: string, password: string, age: number): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const status = age < 18 ? 'pending_approval' : 'approved';
  await createUserProfile(userCredential.user, { age, status });
  return userCredential;
};

export const signInWithEmail = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  // You might want to check if the user exists in firestore and create a profile if not
  // This example assumes a simple sign-in, profile creation might be handled separately
  // or by checking for existence first.
  return userCredential;
};

export const signOut = (): Promise<void> => {
  return firebaseSignOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export const requestParentalConsent = async (userId: string, parentEmail: string) => {
    // In a real application, this would trigger a backend process to send an email.
    // For this mock-up, we'll just log it and update the user's profile.
    console.log(`Parental consent request for user ${userId} sent to ${parentEmail}`);
    // We could add the parent's email to the user's document for tracking.
    await updateUserProfileStatus(userId, "pending_approval");
    return true;
}
