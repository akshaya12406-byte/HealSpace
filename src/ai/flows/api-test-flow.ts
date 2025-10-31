'use server';

/**
 * @fileOverview A simple flow to test the connection to the Gemini API.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function testApiKey(): Promise<{ success: boolean; data: any }> {
  try {
    const result = await ai.generate({
      prompt: 'Hello. If you are receiving this, say "API connection successful."',
    });
    const text = result.text;
    return { success: true, data: text };
  } catch (e: any) {
    console.error('API Key Test Failed:', e);
    return {
      success: false,
      data: {
        message: 'API call failed.',
        error: e.message || 'An unknown error occurred.',
        // Including a hint about the most likely cause.
        likelyCause: 'This is often due to an invalid or missing GOOGLE_API_KEY in your .env.local file. Please verify the key and restart your server.',
      },
    };
  }
}
