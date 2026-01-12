import { z } from 'zod';

export const AssistWithProjectNotesInputSchema = z.object({
  projectDescription: z.string().describe('The description of the project.'),
  projectNotes: z.string().describe('The current notes for the project.'),
});
export type AssistWithProjectNotesInput = z.infer<typeof AssistWithProjectNotesInputSchema>;

export const AssistWithProjectNotesOutputSchema = z.object({
  improvedNotes: z.string().describe('The improved notes for the project.'),
});
export type AssistWithProjectNotesOutput = z.infer<typeof AssistWithProjectNotesOutputSchema>;
