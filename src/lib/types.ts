export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type ProjectStatus = 'draft' | 'refined' | 'archived';

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  caption: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  notes: string;
  todos: Todo[];
  githubUrl: string | null;
  publishedUrl: string | null;
  status: ProjectStatus;
  archiveNotes: string | null;
  private: boolean;
  images: ProjectImage[];
  relatedProjects?: Project[]; // Related projects (optional, loaded separately)
}
