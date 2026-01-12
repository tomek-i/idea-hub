'use client';

import type { Project, ProjectStatus, Todo } from '@/lib/types';
import type { StorageProvider } from './storage-provider';

const STORE_KEY = 'project-hub-projects';

export class LocalStorageProvider implements StorageProvider {
  private getStoredProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load projects from localStorage', error);
      return [];
    }
  }

  private saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects to localStorage', error);
    }
  }

  async getAllProjects(): Promise<Project[]> {
    return this.getStoredProjects();
  }

  async addProject(
    newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status'>
  ): Promise<Project> {
    const projects = this.getStoredProjects();
    const project: Project = {
      ...newProject,
      id: new Date().toISOString(),
      todos: [],
      githubUrl: null,
      status: 'draft',
    };
    projects.push(project);
    this.saveProjects(projects);
    return project;
  }

  async updateProject(updatedProject: Project): Promise<Project> {
    const projects = this.getStoredProjects();
    const updated = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p));
    this.saveProjects(updated);
    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<void> {
    const projects = this.getStoredProjects();
    const filtered = projects.filter((p) => p.id !== projectId);
    this.saveProjects(filtered);
  }

  async updateProjectStatus(projectId: string, status: ProjectStatus): Promise<Project> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    const updated = { ...project, status };
    const updatedProjects = projects.map((p) => (p.id === projectId ? updated : p));
    this.saveProjects(updatedProjects);
    return updated;
  }

  async addTodo(projectId: string, todoText: string): Promise<Todo> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    const newTodo: Todo = {
      id: new Date().toISOString(),
      text: todoText,
      completed: false,
    };
    project.todos.push(newTodo);
    this.saveProjects(projects);
    return newTodo;
  }

  async updateTodo(projectId: string, updatedTodo: Todo): Promise<Todo> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    project.todos = project.todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
    this.saveProjects(projects);
    return updatedTodo;
  }

  async deleteTodo(projectId: string, todoId: string): Promise<void> {
    const projects = this.getStoredProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    project.todos = project.todos.filter((t) => t.id !== todoId);
    this.saveProjects(projects);
  }

  async purgeAllProjects(): Promise<void> {
    this.saveProjects([]);
  }

  async importProjects(projects: Project[]): Promise<void> {
    this.saveProjects(projects);
  }
}
