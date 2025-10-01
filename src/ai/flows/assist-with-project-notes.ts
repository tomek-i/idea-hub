'use server';

/**
 * @fileOverview An AI assistant for improving project notes.
 *
 * - assistWithProjectNotes - A function that suggests improvements to project notes.
 * - AssistWithProjectNotesInput - The input type for the assistWithProjectNotes function.
 * - AssistWithProjectNotesOutput - The return type for the assistWithProjectNotes function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

const AssistWithProjectNotesInputSchema = z.object({
  projectDescription: z.string().describe('The description of the project.'),
  projectNotes: z.string().describe('The current notes for the project.'),
});
export type AssistWithProjectNotesInput = z.infer<typeof AssistWithProjectNotesInputSchema>;

const AssistWithProjectNotesOutputSchema = z.object({
  improvedNotes: z.string().describe('The improved notes for the project.'),
});
export type AssistWithProjectNotesOutput = z.infer<typeof AssistWithProjectNotesOutputSchema>;

export async function assistWithProjectNotes(
  input: AssistWithProjectNotesInput
): Promise<AssistWithProjectNotesOutput> {
  return assistWithProjectNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistWithProjectNotesPrompt',
  input: { schema: AssistWithProjectNotesInputSchema },
  output: { schema: AssistWithProjectNotesOutputSchema },
  prompt: `You are an AI assistant helping to improve project notes.

  Based on the project description and the current project notes, suggest improvements to the notes, including grammar corrections, clarity enhancements, and relevant topic suggestions.

  Project Description: {{{projectDescription}}}
  Current Project Notes: {{{projectNotes}}}

  Improved Notes:`,
});

const assistWithProjectNotesFlow = ai.defineFlow(
  {
    name: 'assistWithProjectNotesFlow',
    inputSchema: AssistWithProjectNotesInputSchema,
    outputSchema: AssistWithProjectNotesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('No output from the prompt');
    }
    return output;
  }
);
