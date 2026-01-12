'use server';

import {
  addProject as dbAddProject,
  addTodo as dbAddTodo,
  deleteProject as dbDeleteProject,
  deleteTodo as dbDeleteTodo,
  importProjects as dbImportProjects,
  purgeAllProjects as dbPurgeAllProjects,
  updateProject as dbUpdateProject,
  updateTodo as dbUpdateTodo,
  getAllProjects,
} from '@/context/projects-db';
import type { Project, ProjectStatus, Todo } from '@/lib/types';

export async function getAllProjectsAction(): Promise<Project[]> {
  const dbProjects = await getAllProjects();
  // Convert database format to app format
  return dbProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    notes: p.notes,
    githubUrl: p.githubUrl,
    status: p.status as ProjectStatus,
    todos: p.todos.map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
    })),
  }));
}

export async function addProjectAction(
  newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status'>
): Promise<Project> {
  const dbProject = await dbAddProject({
    name: newProject.name,
    description: newProject.description,
    notes: newProject.notes,
  });
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    notes: dbProject.notes,
    githubUrl: dbProject.githubUrl,
    status: dbProject.status as ProjectStatus,
    todos: [],
  };
}

export async function updateProjectAction(updatedProject: Project): Promise<Project> {
  const dbProject = await dbUpdateProject(updatedProject.id, {
    name: updatedProject.name,
    description: updatedProject.description,
    notes: updatedProject.notes,
    status: updatedProject.status,
    githubUrl: updatedProject.githubUrl || undefined,
  });
  const dbProjectWithTodos = await getAllProjects();
  const fullProject = dbProjectWithTodos.find((p) => p.id === updatedProject.id);
  if (!fullProject) {
    throw new Error(`Project with id ${updatedProject.id} not found`);
  }
  return {
    id: fullProject.id,
    name: fullProject.name,
    description: fullProject.description,
    notes: fullProject.notes,
    githubUrl: fullProject.githubUrl,
    status: fullProject.status as ProjectStatus,
    todos: fullProject.todos.map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
    })),
  };
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  await dbDeleteProject(projectId);
}

export async function updateProjectStatusAction(
  projectId: string,
  status: ProjectStatus
): Promise<Project> {
  const dbProject = await dbUpdateProject(projectId, { status });
  const dbProjectWithTodos = await getAllProjects();
  const fullProject = dbProjectWithTodos.find((p) => p.id === projectId);
  if (!fullProject) {
    throw new Error(`Project with id ${projectId} not found`);
  }
  return {
    id: fullProject.id,
    name: fullProject.name,
    description: fullProject.description,
    notes: fullProject.notes,
    githubUrl: fullProject.githubUrl,
    status: fullProject.status as ProjectStatus,
    todos: fullProject.todos.map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
    })),
  };
}

export async function addTodoAction(projectId: string, todoText: string): Promise<Todo> {
  const dbTodo = await dbAddTodo(projectId, todoText);
  return {
    id: dbTodo.id,
    text: dbTodo.text,
    completed: dbTodo.completed,
  };
}

export async function updateTodoAction(projectId: string, updatedTodo: Todo): Promise<Todo> {
  await dbUpdateTodo(updatedTodo.id, {
    text: updatedTodo.text,
    completed: updatedTodo.completed,
  });
  return updatedTodo;
}

export async function deleteTodoAction(projectId: string, todoId: string): Promise<void> {
  await dbDeleteTodo(todoId);
}

export async function purgeAllProjectsAction(): Promise<void> {
  await dbPurgeAllProjects();
}

export async function importProjectsAction(projects: Project[]): Promise<void> {
  await dbImportProjects(projects);
}
