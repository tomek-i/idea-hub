export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type ProjectStatus = 'draft' | 'refined';

export interface Project {
  id: string;
  name: string;
  description: string;
  notes: string;
  todos: Todo[];
  githubUrl: string | null;
  status: ProjectStatus;
}
