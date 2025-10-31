
'use server';

/**
 * @fileOverview An AI chatbot named HealBuddy to provide empathetic wellness guidance.
 * This file implements an intent-based routing system to handle different user needs
 * (general chat, safety concerns, therapist handoff) in a modular and debuggable way.
 *
 * ## How to Debug This Flow
 * The most powerful way to debug is using the Genkit Trace Viewer.
 * 1. Run `genkit start` in your terminal.
 * 2. Open your browser to http://localhost:4000/traces
 * 3. Every time you send a message in the chat, a new trace will appear.
 * 4. Click on a trace to see the entire execution path, including the input to the
 *    intent router, the determined intent, and the final call to the specialized flow.
 *    You can inspect the exact prompts, model outputs, and any API errors from Google.
 *    This is the fastest way to diagnose why a certain response was generated or if an API call is failing.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { type MessageData } from 'genkit/ai';

// =================================================================================
// 1. Input/Output Schemas
// =================================================================================

const HealBuddyInputSchema = z.object({
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
export type HealBuddyWellnessGuidanceInput = z.infer<typeof HealBuddyInputSchema>;

const HealBuddyOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
  error: z.string().optional().describe('The error message if the flow failed.'),
});
export type HealBuddyWellnessGuidanceOutput = z.infer<typeof HealBuddyOutputSchema>;


// =================================================================================
// 2. Intent Routing Flow
// =================================================================================

const IntentSchema = z.object({
  intent: z.enum(['safety', 'therapist_handoff', 'general_chat'])
    .describe(`
- safety: Use for any user messages expressing thoughts of self-harm, suicide, crisis, or immediate danger.
- therapist_handoff: Use when the user expresses a clear desire to talk to a human, person, or professional, or if their issues seem complex and require professional help.
- general_chat: Use for all other general conversation, wellness questions, and emotional support.`),
});

const routeUserIntent = ai.defineFlow(
  {
    name: 'routeUserIntent',
    inputSchema: z.string(),
    outputSchema: IntentSchema,
  },
  async (message) => {
    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `Analyze the user's message and determine the correct intent.

User message: "${message}"`,
      output: {
        schema: IntentSchema,
      },
    });

    return result.output!;
  }
);


// =================================================================================
// 3. Specialized Response Flows
// =================================================================================

const getSafetyResponse = ai.defineFlow({
    name: 'getSafetyResponse',
    outputSchema: z.string(),
}, async () => {
    return "I hear that you're going through a very difficult time. Please know that you are not alone and help is available. If you are in crisis or immediate danger, please reach out to one of these resources right away: \n- **National Suicide Prevention Lifeline**: Call or text 988 \n- **Crisis Text Line**: Text 'HOME' to 741741 \nFor immediate danger, please call 911. Your safety is the most important thing.";
});


const getTherapistHandoffResponse = ai.defineFlow({
    name: 'getTherapistHandoffResponse',
    outputSchema: z.string(),
}, async () => {
    return "It sounds like talking to a professional could be really helpful. You're taking a brave step. I can help you find someone to talk to. \n\n[Browse our therapist marketplace](/therapists) to find the right fit for you.";
});


const getGeneralChatResponse = ai.defineFlow(
  {
    name: 'getGeneralChatResponse',
    inputSchema: HealBuddyInputSchema,
    outputSchema: z.string(),
  },
  async ({ message, chatHistory = [] }) => {
    const fullHistory: MessageData[] = [
      ...chatHistory,
      { role: 'user', content: [{ text: message }] },
    ];
    
    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: `You are HealBuddy, an AI-powered chatbot designed to provide empathetic wellness guidance. You communicate in Hinglish (a mix of Hindi and English) and use principles of Cognitive Behavioral Therapy (CBT) to help users explore their feelings in a safe and supportive environment. Your responses should be concise, supportive, and culturally sensitive. Always prioritize user safety and well-being. Do not give any medical or diagnostic advice. Focus on guiding users to explore and understand their feelings, not on providing definitive solutions. Be short and conversational. Add a smiley emoji at the end of every message. Keep responses under 50 words.`,
      history: fullHistory,
    });

    return result.text;
  }
);


// =================================================================================
// 4. Main Orchestrator Flow
// =================================================================================

export async function healBuddyWellnessGuidance(
  input: HealBuddyWellnessGuidanceInput
): Promise<HealBuddyWellnessGuidanceOutput> {
  try {
    const { intent } = await routeUserIntent(input.message);
    
    let response = '';

    switch (intent) {
      case 'safety':
        response = await getSafetyResponse();
        break;
      case 'therapist_handoff':
        response = await getTherapistHandoffResponse();
        break;
      case 'general_chat':
        response = await getGeneralChatResponse(input);
        break;
      default:
         response = "I'm not sure how to respond to that. Could you try rephrasing? 😊";
    }

    return { response };

  } catch (e: any) {
    // CRITICAL: Return the actual error for debugging, with a safe fallback message.
    console.error('CRITICAL: Error in healBuddyWellnessGuidance orchestrator:', e);
    return {
      response: "I'm having a little trouble connecting right now. Please try again in a moment. 😊",
      error: (e as Error).message,
    };
  }
}
