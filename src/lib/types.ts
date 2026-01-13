export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type ProjectStatus = 'draft' | 'refined' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  notes: string;
  todos: Todo[];
  githubUrl: string | null;
  status: ProjectStatus;
  archiveNotes: string | null;
  private: boolean;
  relatedProjects?: Project[]; // Related projects (optional, loaded separately)
}
