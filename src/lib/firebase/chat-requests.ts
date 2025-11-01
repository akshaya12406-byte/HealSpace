import { doc, setDoc, addDoc, updateDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface ChatRequest {
    userId: string;
    therapistId: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Timestamp;
}

export const createChatRequest = async (userId: string, therapistId: string) => {
    if (!userId || !therapistId) throw new Error("User ID and Therapist ID are required.");

    const chatRequestsRef = collection(db, 'chat_requests');

    await addDoc(chatRequestsRef, {
        userId,
        therapistId,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
};

export const updateChatRequestStatus = async (requestId: string, status: 'accepted' | 'declined') => {
    if (!requestId) throw new Error("Request ID is required.");

    const requestRef = doc(db, 'chat_requests', requestId);
    
    await updateDoc(requestRef, { status });
};
