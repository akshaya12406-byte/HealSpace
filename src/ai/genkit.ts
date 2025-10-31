import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({ apiVersion: 'v1beta' })], // This tells Genkit to use the v1beta API
  model: 'googleai/gemini-pro',     // This is the fast, low-cost model
});
