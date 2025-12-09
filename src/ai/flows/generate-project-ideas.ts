"use server";

import { generateText } from "ai";
import type { LanguageModelV2 } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

const GenerateProjectIdeasInputSchema = z.object({
	description: z.string().describe("The description or keywords to base the project ideas on."),
});
export type GenerateProjectIdeasInput = z.infer<typeof GenerateProjectIdeasInputSchema>;

const GenerateProjectIdeasOutputSchema = z.object({
	ideas: z.array(z.string()).describe("An array of generated project ideas."),
});
export type GenerateProjectIdeasOutput = z.infer<typeof GenerateProjectIdeasOutputSchema>;

/**
 * @fileOverview A project idea generation AI agent using Vercel AI SDK.
 *
 * - generateProjectIdeas - A function that handles the project idea generation process.
 * - GenerateProjectIdeasInput - The input type for the generateProjectIdeas function.
 * - GenerateProjectIdeasOutput - The return type for the generateProjectIdeas function.
 */
export async function generateProjectIdeas(
	input: GenerateProjectIdeasInput,
	model: LanguageModelV2
): Promise<GenerateProjectIdeasOutput> {
	GenerateProjectIdeasInputSchema.parse(input);

	const prompt = `You are a creative project idea generator. Based on the description or keywords provided, generate a list of project ideas.\n\nDescription or Keywords: ${input.description}\n\nProject Ideas:`;

	const response = await generateText({
		model,
		prompt,
		temperature: 0.7,
	});

	// Split the response into ideas (assuming each idea is on a new line)
	const ideas = response.text
		.split("\n")
		.map((idea) => idea.trim())
		.filter((idea) => idea.length > 0);

	GenerateProjectIdeasOutputSchema.parse({ ideas });
	return { ideas };
}
