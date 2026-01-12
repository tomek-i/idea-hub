import type { Project, ProjectStatus, Todo } from '@/lib/types';

export interface StorageProvider {
  getAllProjects(): Promise<Project[]>;
  addProject(newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status'>): Promise<Project>;
  updateProject(updatedProject: Project): Promise<Project>;
  deleteProject(projectId: string): Promise<void>;
  updateProjectStatus(projectId: string, status: ProjectStatus): Promise<Project>;
  addTodo(projectId: string, todoText: string): Promise<Todo>;
  updateTodo(projectId: string, updatedTodo: Todo): Promise<Todo>;
  deleteTodo(projectId: string, todoId: string): Promise<void>;
  purgeAllProjects(): Promise<void>;
  importProjects(projects: Project[]): Promise<void>;
}
