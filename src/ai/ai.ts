import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateProjectIdeas } from './flows/generate-project-ideas';
import { assistWithProjectNotes } from './flows/assist-with-project-notes';

const openrouter = createOpenRouter({
  // TODO: get from env
  apiKey: 'YOUR_OPENROUTER_API_KEY',
});
// TODO: get from env perhaps?
const model = openrouter.chat('anthropic/claude-3.5-sonnet');



export const ai = {
  generateProjectIdeas: async (description: string) => {
    return await generateProjectIdeas(
      { description },model
      
    );
  },
  generateProjectNotes: async (description: string, notes: string) => {
    return await assistWithProjectNotes(
      { projectDescription: description, projectNotes: notes },model
    );
  }
}