'use server';

/**
 * @fileOverview An AI chatbot named HealBuddy to provide empathetic wellness guidance.
 *
 * - healBuddyWellnessGuidance - A function that handles the chatbot interaction.
 * - HealBuddyWellnessGuidanceInput - The input type for the healBuddyWellnessGuidance function.
 * - HealBuddyWellnessGuidanceOutput - The return type for the healBuddyWellnessGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z, Message} from 'genkit';

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

const prompt = ai.definePrompt({
  name: 'healBuddyWellnessGuidancePrompt',
  input: {schema: HealBuddyWellnessGuidanceInputSchema},
  output: {schema: HealBuddyWellnessGuidanceOutputSchema},
  tools: [suggestTherapistTool],
  system: `You are HealBuddy, an AI-powered chatbot designed to provide empathetic wellness guidance. You communicate in Hinglish (a mix of Hindi and English) and use principles of Cognitive Behavioral Therapy (CBT) to help users explore their feelings in a safe and supportive environment. Your responses should be concise, supportive, and culturally sensitive. Always prioritize user safety and well-being. If the user expresses thoughts of self-harm or suicide, immediately direct them to seek professional help and provide resources like the Suicide Prevention Lifeline. Do not give any medical or diagnostic advice. Focus on guiding users to explore and understand their feelings, not on providing definitive solutions. Be short and conversational. Add a smiley emoji at the end of every message.

If the user expresses a clear desire to talk to a person or a professional, or if their issues seem complex and beyond the scope of a chatbot, use the suggestTherapist tool.

Keep responses under 50 words.`,
});

const healBuddyWellnessGuidanceFlow = ai.defineFlow(
  {
    name: 'healBuddyWellnessGuidanceFlow',
    inputSchema: HealBuddyWellnessGuidanceInputSchema,
    outputSchema: HealBuddyWellnessGuidanceOutputSchema,
  },
  async ({ message, chatHistory = [] }) => {
    const history = chatHistory.map(
      (msg) => new Message({ role: msg.role, content: [{ text: msg.content }] })
    );

    const result = await prompt({
        message,
        chatHistory
    }, { history });

    const toolRequest = result.toolRequest('suggestTherapist');
    
    if (toolRequest) {
        const handoffResponse = `It sounds like talking to a professional could be really helpful. You're taking a brave step. I can help you find someone to talk to. 

[Browse our therapist marketplace](/therapists) to find the right fit for you.`;
        return {
            response: handoffResponse,
        };
    }

    if (!result.output) {
        return { response: "I'm having some trouble connecting at the moment. Please try again soon. 😊" };
    }

    return {
      response: result.output.response,
    };
  }
);
