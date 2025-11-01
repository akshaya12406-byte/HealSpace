import { PlaceHolderImages } from './placeholder-images';

export interface Therapist {
  id: string; // This ID should now match a user's UID who has the 'therapist' role
  name: string;
  specialties: string[];
  languages: string[];
  imageUrl: string;
  imageHint: string;
}

const getImageUrl = (id: string, fallbackId: string): { url: string, hint: string } => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if(img) return { url: img.imageUrl, hint: img.imageHint };
    
    const fallbackImg = PlaceHolderImages.find(p => p.id === fallbackId);
    return fallbackImg ? { url: fallbackImg.imageUrl, hint: fallbackImg.imageHint } : { url: 'https://picsum.photos/seed/person/400/400', hint: 'person professional' };
}

// IMPORTANT: The `id` for each therapist should correspond to the `uid` of a
// user in your Firebase Authentication that has the role of 'therapist'.
// For testing, the 'therapist_test_uid' matches the mock user in `src/lib/firebase/firestore.ts`.
export const therapists: Therapist[] = [
  {
    id: 'therapist_test_uid', // This ID should be a real therapist's UID in production
    name: 'Dr. Emily Carter',
    specialties: ['Anxiety', 'Depression', 'CBT'],
    languages: ['English', 'Hindi'],
    imageUrl: getImageUrl('therapist-1', 'therapist-1').url,
    imageHint: getImageUrl('therapist-1', 'therapist-1').hint,
  },
  {
    id: 'therapist_id_2', // This ID should be a real therapist's UID in production
    name: 'Dr. Rohan Mehta',
    specialties: ['Stress Management', 'Relationships', 'Mindfulness'],
    languages: ['English', 'Gujarati'],
    imageUrl: getImageUrl('therapist-2', 'therapist-2').url,
    imageHint: getImageUrl('therapist-2', 'therapist-2').hint,
  },
  {
    id: 'therapist_id_3', // This ID should be a real therapist's UID in production
    name: 'Dr. Priya Singh',
    specialties: ['Trauma', 'Grief', 'Family Therapy'],
    languages: ['English', 'Punjabi'],
    imageUrl: getImageUrl('therapist-3', 'therapist-3').url,
    imageHint: getImageUrl('therapist-3', 'therapist-3').hint,
  },
  {
    id: 'therapist_id_4', // This ID should be a real therapist's UID in production
    name: 'Dr. Sameer Khan',
    specialties: ['Anxiety', 'Career Counseling', 'CBT'],
    languages: ['English', 'Urdu'],
    imageUrl: getImageUrl('therapist-4', 'therapist-4').url,
    imageHint: getImageUrl('therapist-4', 'therapist-4').hint,
  },
   {
    id: 'therapist_id_5', // This ID should be a real therapist's UID in production
    name: 'Dr. Aisha Desai',
    specialties: ['Depression', 'Stress Management', 'Mindfulness'],
    languages: ['English', 'Marathi'],
    imageUrl: getImageUrl('therapist-5', 'therapist-5').url,
    imageHint: getImageUrl('therapist-5', 'therapist-5').hint,
  },
  {
    id: 'therapist_id_6', // This ID should be a real therapist's UID in production
    name: 'Dr. Vikram Rao',
    specialties: ['Relationships', 'Family Therapy', 'Grief'],
    languages: ['English', 'Kannada'],
    imageUrl: getImageUrl('therapist-6', 'therapist-6').url,
    imageHint: getImageUrl('therapist-6', 'therapist-6').hint,
  },
];

export const allSpecialties = [...new Set(therapists.flatMap(t => t.specialties))];
export const allLanguages = [...new Set(therapists.flatMap(t => t.languages))];
