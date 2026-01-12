'use client';

import {
  addProjectAction,
  addTodoAction,
  deleteProjectAction,
  deleteTodoAction,
  getAllProjectsAction,
  importProjectsAction,
  purgeAllProjectsAction,
  updateProjectAction,
  updateProjectStatusAction,
  updateTodoAction,
} from '@/app/actions/project-actions';
import type { Project, ProjectStatus, Todo } from '@/lib/types';
import type { StorageProvider } from './storage-provider';

export class SqliteStorageProvider implements StorageProvider {
  async getAllProjects(): Promise<Project[]> {
    return getAllProjectsAction();
  }

  async addProject(
    newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status'>
  ): Promise<Project> {
    return addProjectAction(newProject);
  }

  async updateProject(updatedProject: Project): Promise<Project> {
    return updateProjectAction(updatedProject);
  }

  async deleteProject(projectId: string): Promise<void> {
    return deleteProjectAction(projectId);
  }

  async updateProjectStatus(
    projectId: string,
    status: ProjectStatus,
    archiveNotes?: string | null
  ): Promise<Project> {
    return updateProjectStatusAction(projectId, status, archiveNotes);
  }

  async addTodo(projectId: string, todoText: string): Promise<Todo> {
    return addTodoAction(projectId, todoText);
  }

  async updateTodo(projectId: string, updatedTodo: Todo): Promise<Todo> {
    return updateTodoAction(projectId, updatedTodo);
  }

  async deleteTodo(projectId: string, todoId: string): Promise<void> {
    return deleteTodoAction(projectId, todoId);
  }

  async purgeAllProjects(): Promise<void> {
    return purgeAllProjectsAction();
  }

  async importProjects(projects: Project[]): Promise<void> {
    return importProjectsAction(projects);
  }
}
