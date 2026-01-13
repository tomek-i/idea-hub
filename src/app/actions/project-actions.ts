'use server';

import {
  addProject as dbAddProject,
  addProjectRelation as dbAddProjectRelation,
  addTodo as dbAddTodo,
  deleteProject as dbDeleteProject,
  deleteTodo as dbDeleteTodo,
  getRelatedProjects as dbGetRelatedProjects,
  importProjects as dbImportProjects,
  purgeAllProjects as dbPurgeAllProjects,
  removeProjectRelation as dbRemoveProjectRelation,
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
    archiveNotes: p.archiveNotes,
    private: p.private ?? false,
    todos: p.todos.map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
    })),
  }));
}

export async function addProjectAction(
  newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status' | 'archiveNotes'>
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
    archiveNotes: dbProject.archiveNotes,
    private: dbProject.private ?? false,
    todos: [],
  };
}

export async function updateProjectAction(updatedProject: Project): Promise<Project> {
  await dbUpdateProject(updatedProject.id, {
    name: updatedProject.name,
    description: updatedProject.description,
    notes: updatedProject.notes,
    status: updatedProject.status,
    githubUrl: updatedProject.githubUrl || undefined,
    archiveNotes: updatedProject.archiveNotes || undefined,
    private: updatedProject.private,
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
    archiveNotes: fullProject.archiveNotes,
    private: fullProject.private ?? false,
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
  status: ProjectStatus,
  archiveNotes?: string | null
): Promise<Project> {
  const updateData: { status: ProjectStatus; archiveNotes?: string | null } = { status };
  if (status === 'archived' && archiveNotes !== undefined) {
    updateData.archiveNotes = archiveNotes;
  }
  await dbUpdateProject(projectId, updateData);
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
    archiveNotes: fullProject.archiveNotes,
    private: fullProject.private ?? false,
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

export async function updateTodoAction(_projectId: string, updatedTodo: Todo): Promise<Todo> {
  await dbUpdateTodo(updatedTodo.id, {
    text: updatedTodo.text,
    completed: updatedTodo.completed,
  });
  return updatedTodo;
}

export async function deleteTodoAction(_projectId: string, todoId: string): Promise<void> {
  await dbDeleteTodo(todoId);
}

export async function purgeAllProjectsAction(): Promise<void> {
  await dbPurgeAllProjects();
}

export async function importProjectsAction(projects: Project[]): Promise<void> {
  await dbImportProjects(projects);
}

export async function getRelatedProjectsAction(projectId: string): Promise<Project[]> {
  const dbProjects = await dbGetRelatedProjects(projectId);
  return dbProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    notes: p.notes,
    githubUrl: p.githubUrl,
    status: p.status as ProjectStatus,
    archiveNotes: p.archiveNotes,
    private: p.private ?? false,
    todos: p.todos.map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
    })),
  }));
}

export async function addProjectRelationAction(fromId: string, toId: string): Promise<void> {
  await dbAddProjectRelation(fromId, toId);
}

export async function removeProjectRelationAction(fromId: string, toId: string): Promise<void> {
  await dbRemoveProjectRelation(fromId, toId);
}
