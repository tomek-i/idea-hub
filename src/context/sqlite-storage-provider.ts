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
  uploadProjectImageAction,
  updateProjectImageCaptionAction,
  deleteProjectImageAction,
  getProjectImagesAction,
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

  async getProject(projectId: string): Promise<Project> {
    // Get all projects and find the one we need
    const allProjects = await getAllProjectsAction();
    const project = allProjects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    return project;
  }

  async uploadProjectImage(projectId: string, formData: FormData): Promise<void> {
    await uploadProjectImageAction(projectId, formData);
  }

  async updateProjectImageCaption(imageId: string, caption: string): Promise<void> {
    await updateProjectImageCaptionAction(imageId, caption);
  }

  async deleteProjectImage(imageId: string): Promise<void> {
    await deleteProjectImageAction(imageId);
  }
}
