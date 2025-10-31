'use server';

/**
 * @fileOverview An AI chatbot named HealBuddy to provide empathetic wellness guidance.
 *
 * - healBuddyWellnessGuidance - A function that handles the chatbot interaction.
 * - HealBuddyWellnessGuidanceInput - The input type for the healBuddyWellnessGuidance function.
 * - HealBuddyWellnessGuidanceOutput - The return type for the healBuddyWellnessGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { type MessageData } from 'genkit/ai';

const HealBuddyWellnessGuidanceInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() })),
      })
    )
    .optional()
    .describe('The chat history between the user and the chatbot.'),
});
export type HealBuddyWellnessGuidanceInput = z.infer<typeof HealBuddyWellnessGuidanceInputSchema>;

const HealBuddyWellnessGuidanceOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type HealBuddyWellnessGuidanceOutput = z.infer<typeof HealBuddyWellnessGuidanceOutputSchema>;

export async function healBuddyWellnessGuidance(
  input: HealBuddyWellnessGuidanceInput
): Promise<HealBuddyWellnessGuidanceOutput> {
  return healBuddyWellnessGuidanceFlow(input);
}

const suggestTherapistTool = ai.defineTool(
  {
    name: 'suggestTherapist',
    description: 'Suggests that the user should consider talking to a therapist.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      recommend: z.boolean().describe('Whether to recommend a therapist.'),
    }),
  },
  async () => {
    return { recommend: true };
  }
);

const systemPrompt = `You are HealBuddy, an AI-powered chatbot designed to provide empathetic wellness guidance. You communicate in Hinglish (a mix of Hindi and English) and use principles of Cognitive Behavioral Therapy (CBT) to help users explore their feelings in a safe and supportive environment. Your responses should be concise, supportive, and culturally sensitive. Always prioritize user safety and well-being. If the user expresses thoughts of self-harm or suicide, immediately direct them to seek professional help and provide resources like the Suicide Prevention Lifeline. Do not give any medical or diagnostic advice. Focus on guiding users to explore and understand their feelings, not on providing definitive solutions. Be short and conversational. Add a smiley emoji at the end of every message.

If the user expresses a clear desire to talk to a person or a professional, or if their issues seem complex and beyond the scope of a chatbot, use the suggestTherapist tool.

Keep responses under 50 words.`;


const healBuddyWellnessGuidanceFlow = ai.defineFlow(
  {
    name: 'healBuddyWellnessGuidanceFlow',
    inputSchema: HealBuddyWellnessGuidanceInputSchema,
    outputSchema: HealBuddyWellnessGuidanceOutputSchema,
  },
  async ({ message, chatHistory = [] }) => {
    
    // Construct the full history, ensuring the new user message is the last item.
    const fullHistory: MessageData[] = [
        ...chatHistory,
        { role: 'user', content: [{ text: message }] },
    ];

    try {
      const result = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        system: systemPrompt,
        history: fullHistory,
        tools: [suggestTherapistTool],
      });

      const toolRequest = result.toolRequest('suggestTherapist');

      if (toolRequest) {
        const handoffResponse = `It sounds like talking to a professional could be really helpful. You're taking a brave step. I can help you find someone to talk to. 

[Browse our therapist marketplace](/therapists) to find the right fit for you.`;
        return {
          response: handoffResponse,
        };
      }
      
      const outputText = result.text;
      if (!outputText) {
        // This case handles if the model returns a response with no text (e.g. only tool call)
        // but the tool call wasn't the one we expected.
        return {
          response: "I'm not sure how to respond to that. Could you try rephrasing? 😊",
        };
      }

      return {
        response: outputText,
      };
    } catch (e: any) {
      console.error('CRITICAL: Error during AI generate call:', e);
      // Fallback mechanism: provide a pre-scripted response in case of any API failure
      return {
        response: "I'm having a little trouble connecting right now. Please try again in a moment. 😊",
      };
    }
  }
);
