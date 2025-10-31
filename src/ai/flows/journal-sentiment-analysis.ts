'use server';

/**
 * @fileOverview Sentiment analysis of journal entries using Genkit and Gemini.
 *
 * - analyzeSentiment - Analyzes the sentiment of a journal entry.
 * - JournalSentimentInput - Input type for the analyzeSentiment function.
 * - JournalSentimentOutput - Output type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalSentimentInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The journal entry to analyze for sentiment.'),
});
export type JournalSentimentInput = z.infer<typeof JournalSentimentInputSchema>;

const JournalSentimentOutputSchema = z.object({
  sentimentScore: z
    .number()
    .describe(
      'The sentiment score of the journal entry, ranging from -1 (negative) to 1 (positive).'
    ),
  sentimentLabel: z
    .string()
    .describe('A label describing the sentiment (e.g., positive, negative, neutral).'),
});
export type JournalSentimentOutput = z.infer<typeof JournalSentimentOutputSchema>;

export async function analyzeSentiment(
  input: JournalSentimentInput
): Promise<JournalSentimentOutput> {
  return analyzeSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalSentimentPrompt',
  input: {schema: JournalSentimentInputSchema},
  output: {schema: JournalSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following journal entry. Provide a sentiment score between -1 and 1, and a label describing the sentiment.

Journal Entry: {{{journalEntry}}}

Output the sentiment score and label in JSON format.  The sentimentScore must be a number between -1 and 1.
`,
});

const analyzeSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentFlow',
    inputSchema: JournalSentimentInputSchema,
    outputSchema: JournalSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
