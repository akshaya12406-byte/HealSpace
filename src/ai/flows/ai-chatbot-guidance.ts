'use server';

/**
 * @fileOverview An AI chatbot named Mitr to provide empathetic wellness guidance.
 *
 * - mitrWellnessGuidance - A function that handles the chatbot interaction.
 * - MitrWellnessGuidanceInput - The input type for the mitrWellnessGuidance function.
 * - MitrWellnessGuidanceOutput - The return type for the mitrWellnessGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MitrWellnessGuidanceInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the chatbot.'),
});
export type MitrWellnessGuidanceInput = z.infer<typeof MitrWellnessGuidanceInputSchema>;

const MitrWellnessGuidanceOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type MitrWellnessGuidanceOutput = z.infer<typeof MitrWellnessGuidanceOutputSchema>;

export async function mitrWellnessGuidance(input: MitrWellnessGuidanceInput): Promise<MitrWellnessGuidanceOutput> {
  return mitrWellnessGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mitrWellnessGuidancePrompt',
  input: {schema: MitrWellnessGuidanceInputSchema},
  output: {schema: MitrWellnessGuidanceOutputSchema},
  system: `You are Mitr, an AI-powered chatbot designed to provide empathetic wellness guidance. You communicate in Hinglish (a mix of Hindi and English) and use principles of Cognitive Behavioral Therapy (CBT) to help users explore their feelings in a safe and supportive environment. Your responses should be concise, supportive, and culturally sensitive. Always prioritize user safety and well-being. If the user expresses thoughts of self-harm or suicide, immediately direct them to seek professional help and provide resources like the Suicide Prevention Lifeline. Do not give any medical or diagnostic advice. Focus on guiding users to explore and understand their feelings, not on providing definitive solutions. Be short and conversational. Add a smiley emoji at the end of every message.

Keep responses under 50 words.`,
  prompt: `{{#each chatHistory}}
{{#if (eq this.role \"user\")}}
User: {{{this.content}}}
{{else}}
Mitr: {{{this.content}}}
{{/if}}
{{/each}}
User: {{{message}}}`,
});

const mitrWellnessGuidanceFlow = ai.defineFlow(
  {
    name: 'mitrWellnessGuidanceFlow',
    inputSchema: MitrWellnessGuidanceInputSchema,
    outputSchema: MitrWellnessGuidanceOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        return {
          response: output!.response,
        };
    } catch (e: any) {
      console.error('Error during AI chatbot interaction:', e);
      // Fallback mechanism: provide a pre-scripted response in case of API failure
      return {
        response: 'I am currently experiencing technical difficulties. Please try again later. I am here to listen when you are ready. 😊',
      };
    }
  }
);
