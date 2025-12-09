'use server';

import { AssistWithProjectNotesInputSchema, AssistWithProjectNotesOutputSchema, type AssistWithProjectNotesInput, type AssistWithProjectNotesOutput } from "../schemas/assist-with-project-notes.schema";
import type { LanguageModelV2 } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";


/**
 * @fileOverview An AI assistant for improving project notes using Vercel AI SDK.
 *
 * - assistWithProjectNotes - A function that suggests improvements to project notes.
 * - AssistWithProjectNotesInput - The input type for the assistWithProjectNotes function.
 * - AssistWithProjectNotesOutput - The return type for the assistWithProjectNotes function.
 */
export async function assistWithProjectNotes(
	input: AssistWithProjectNotesInput,
	model: LanguageModelV2 // Accepts a model instance, e.g. openrouter.chat(...)
): Promise<AssistWithProjectNotesOutput> {
	AssistWithProjectNotesInputSchema.parse(input);

	const prompt = `You are an AI assistant helping to improve project notes.\n\nBased on the project description and the current project notes, suggest improvements to the notes, including grammar corrections, clarity enhancements, and relevant topic suggestions.\n\nProject Description: ${input.projectDescription}\nCurrent Project Notes: ${input.projectNotes}\n\nImproved Notes:`;

	const response = await generateText({
		model,
		prompt,
		temperature: 0.7,
	});

	const improvedNotes = response.text.trim();
	AssistWithProjectNotesOutputSchema.parse({ improvedNotes });
	return { improvedNotes };
}
