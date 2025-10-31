import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({ apiVersion: 'v1' })], // This tells Genkit to use the modern v1 API
  model: 'googleai/gemini-1.5-flash',     // This is the fast, low-cost model
});
