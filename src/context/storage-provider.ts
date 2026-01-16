import type { Project, ProjectStatus, Todo } from '@/lib/types';

export interface StorageProvider {
  getAllProjects(): Promise<Project[]>;
  getProject(projectId: string): Promise<Project>;
  addProject(
    newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status' | 'archiveNotes'>
  ): Promise<Project>;
  updateProject(updatedProject: Project): Promise<Project>;
  deleteProject(projectId: string): Promise<void>;
  updateProjectStatus(
    projectId: string,
    status: ProjectStatus,
    archiveNotes?: string | null
  ): Promise<Project>;
  addTodo(projectId: string, todoText: string): Promise<Todo>;
  updateTodo(projectId: string, updatedTodo: Todo): Promise<Todo>;
  deleteTodo(projectId: string, todoId: string): Promise<void>;
  purgeAllProjects(): Promise<void>;
  importProjects(projects: Project[]): Promise<void>;
  uploadProjectImage(projectId: string, formData: FormData): Promise<void>;
  updateProjectImageCaption(imageId: string, caption: string): Promise<void>;
  deleteProjectImage(imageId: string): Promise<void>;
}
