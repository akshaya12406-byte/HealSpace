import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()], // This tells Genkit to use the modern v1 API
  model: 'googleai/gemini-pro',     // This is the fast, low-cost model
});
