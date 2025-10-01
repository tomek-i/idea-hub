// This file is machine-generated - edit with caution!
'use server';

/**
 * @fileOverview A project idea generation AI agent.
 *
 * - generateProjectIdeas - A function that handles the project idea generation process.
 * - GenerateProjectIdeasInput - The input type for the generateProjectIdeas function.
 * - GenerateProjectIdeasOutput - The return type for the generateProjectIdeas function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

const GenerateProjectIdeasInputSchema = z.object({
  description: z.string().describe('The description or keywords to base the project ideas on.'),
});
export type GenerateProjectIdeasInput = z.infer<typeof GenerateProjectIdeasInputSchema>;

const GenerateProjectIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('An array of generated project ideas.'),
});
export type GenerateProjectIdeasOutput = z.infer<typeof GenerateProjectIdeasOutputSchema>;

export async function generateProjectIdeas(
  input: GenerateProjectIdeasInput
): Promise<GenerateProjectIdeasOutput> {
  return generateProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectIdeasPrompt',
  input: { schema: GenerateProjectIdeasInputSchema },
  output: { schema: GenerateProjectIdeasOutputSchema },
  prompt: `You are a creative project idea generator. Based on the description or keywords provided, generate a list of project ideas.

Description or Keywords: {{{description}}}

Project Ideas:`,
});

const generateProjectIdeasFlow = ai.defineFlow(
  {
    name: 'generateProjectIdeasFlow',
    inputSchema: GenerateProjectIdeasInputSchema,
    outputSchema: GenerateProjectIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('No output from the prompt');
    }
    return output;
  }
);
