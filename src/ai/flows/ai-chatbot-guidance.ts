'use server';

/**
 * @fileOverview An AI chatbot named HealBuddy to provide empathetic wellness guidance.
 *
 * - healBuddyWellnessGuidance - A function that handles the chatbot interaction.
 * - HealBuddyWellnessGuidanceInput - The input type for the healBuddyWellnessGuidance function.
 * - HealBuddyWellnessGuidanceOutput - The return type for the healBuddyWellnessGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealBuddyWellnessGuidanceInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the chatbot.'),
});
export type HealBuddyWellnessGuidanceInput = z.infer<typeof HealBuddyWellnessGuidanceInputSchema>;

const HealBuddyWellnessGuidanceOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type HealBuddyWellnessGuidanceOutput = z.infer<typeof HealBuddyWellnessGuidanceOutputSchema>;

export async function healBuddyWellnessGuidance(input: HealBuddyWellnessGuidanceInput): Promise<HealBuddyWellnessGuidanceOutput> {
  return healBuddyWellnessGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healBuddyWellnessGuidancePrompt',
  input: {schema: HealBuddyWellnessGuidanceInputSchema},
  output: {schema: HealBuddyWellnessGuidanceOutputSchema},
  system: `You are HealBuddy, an AI-powered chatbot designed to provide empathetic wellness guidance. You communicate in Hinglish (a mix of Hindi and English) and use principles of Cognitive Behavioral Therapy (CBT) to help users explore their feelings in a safe and supportive environment. Your responses should be concise, supportive, and culturally sensitive. Always prioritize user safety and well-being. If the user expresses thoughts of self-harm or suicide, immediately direct them to seek professional help and provide resources like the Suicide Prevention Lifeline. Do not give any medical or diagnostic advice. Focus on guiding users to explore and understand their feelings, not on providing definitive solutions. Be short and conversational. Add a smiley emoji at the end of every message.

Keep responses under 50 words.`,
  prompt: `{{#each chatHistory}}
{{#if (eq this.role "user")}}
User: {{{this.content}}}
{{else}}
HealBuddy: {{{this.content}}}
{{/if}}
{{/each}}
User: {{{message}}}`,
});

const healBuddyWellnessGuidanceFlow = ai.defineFlow(
  {
    name: 'healBuddyWellnessGuidanceFlow',
    inputSchema: HealBuddyWellnessGuidanceInputSchema,
    outputSchema: HealBuddyWellnessGuidanceOutputSchema,
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
