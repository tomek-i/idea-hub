'use server';

import {
  addProject as dbAddProject,
  addProjectRelation as dbAddProjectRelation,
  addTodo as dbAddTodo,
  addProjectImage as dbAddProjectImage,
  deleteProject as dbDeleteProject,
  deleteTodo as dbDeleteTodo,
  deleteProjectImage as dbDeleteProjectImage,
  getRelatedProjects as dbGetRelatedProjects,
  importProjects as dbImportProjects,
  purgeAllProjects as dbPurgeAllProjects,
  removeProjectRelation as dbRemoveProjectRelation,
  updateProject as dbUpdateProject,
  updateTodo as dbUpdateTodo,
  updateProjectImage as dbUpdateProjectImage,
  getProjectImages as dbGetProjectImages,
  getAllProjects,
} from '@/context/projects-db';
import type { Project, ProjectStatus, Todo, ProjectImage } from '@/lib/types';

export async function getAllProjectsAction(): Promise<Project[]> {
  const dbProjects = await getAllProjects();
  // Convert database format to app format
  return dbProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    notes: p.notes,
    githubUrl: p.githubUrl,
    publishedUrl: p.publishedUrl,
    status: p.status as ProjectStatus,
    archiveNotes: p.archiveNotes,
    private: p.private ?? false,
    images: p.images.map((img) => ({
      id: img.id,
      projectId: img.projectId,
      url: img.url,
      caption: img.caption,
      alt: img.alt,
      width: img.width,
      height: img.height,
      fileSize: img.fileSize,
      mimeType: img.mimeType,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    })),
    todos: p.todos.map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
    })),
  }));
}

export async function addProjectAction(
  newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'publishedUrl' | 'status' | 'archiveNotes' | 'images'>
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
    publishedUrl: dbProject.publishedUrl,
    status: dbProject.status as ProjectStatus,
    archiveNotes: dbProject.archiveNotes,
    private: dbProject.private ?? false,
    images: [],
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
    publishedUrl: updatedProject.publishedUrl || undefined,
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
    publishedUrl: fullProject.publishedUrl,
    status: fullProject.status as ProjectStatus,
    archiveNotes: fullProject.archiveNotes,
    private: fullProject.private ?? false,
    images: fullProject.images.map((img) => ({
      id: img.id,
      projectId: img.projectId,
      url: img.url,
      caption: img.caption,
      alt: img.alt,
      width: img.width,
      height: img.height,
      fileSize: img.fileSize,
      mimeType: img.mimeType,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    })),
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
    publishedUrl: fullProject.publishedUrl,
    status: fullProject.status as ProjectStatus,
    archiveNotes: fullProject.archiveNotes,
    private: fullProject.private ?? false,
    images: fullProject.images.map((img) => ({
      id: img.id,
      projectId: img.projectId,
      url: img.url,
      caption: img.caption,
      alt: img.alt,
      width: img.width,
      height: img.height,
      fileSize: img.fileSize,
      mimeType: img.mimeType,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    })),
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
    publishedUrl: p.publishedUrl,
    status: p.status as ProjectStatus,
    archiveNotes: p.archiveNotes,
    private: p.private ?? false,
    images: p.images.map((img) => ({
      id: img.id,
      projectId: img.projectId,
      url: img.url,
      caption: img.caption,
      alt: img.alt,
      width: img.width,
      height: img.height,
      fileSize: img.fileSize,
      mimeType: img.mimeType,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    })),
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

// Image management actions
export async function uploadProjectImageAction(
  projectId: string,
  formData: FormData
): Promise<ProjectImage> {
  const file = formData.get('file') as File;
  const caption = formData.get('caption') as string | null;
  const alt = formData.get('alt') as string | null;

  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  // Generate unique filename
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const timestamp = Date.now();
  const filename = `${projectId}-${timestamp}-${file.name}`;
  const filepath = `uploads/${filename}`;

  // Save file to public/uploads directory
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    await fs.writeFile(path.join(process.cwd(), 'public', filepath), buffer);
  } catch (error) {
    throw new Error('Failed to save file');
  }

  // For now, we'll skip dimension extraction to avoid canvas dependency issues
  // In production, you might want to use a proper image processing library
  const width = null;
  const height = null;

  // Create database record
  const dbImage = await dbAddProjectImage(projectId, {
    url: `/${filepath}`,
    caption,
    alt,
    width,
    height,
    fileSize: file.size,
    mimeType: file.type,
  });

  return {
    id: dbImage.id,
    projectId: dbImage.projectId,
    url: dbImage.url,
    caption: dbImage.caption,
    alt: dbImage.alt,
    width: dbImage.width,
    height: dbImage.height,
    fileSize: dbImage.fileSize,
    mimeType: dbImage.mimeType,
    createdAt: dbImage.createdAt,
    updatedAt: dbImage.updatedAt,
  };
}

export async function updateProjectImageCaptionAction(
  imageId: string,
  caption: string
): Promise<void> {
  await dbUpdateProjectImage(imageId, { caption });
}

export async function deleteProjectImageAction(imageId: string): Promise<void> {
  try {
    // For now, we'll just delete from database
    // In production, you'd want to delete the file from storage too
    await dbDeleteProjectImage(imageId);
  } catch (error) {
    throw new Error('Failed to delete image');
  }
}

export async function getProjectImagesAction(projectId: string): Promise<ProjectImage[]> {
  const dbImages = await dbGetProjectImages(projectId);
  return dbImages.map((img) => ({
    id: img.id,
    projectId: img.projectId,
    url: img.url,
    caption: img.caption,
    alt: img.alt,
    width: img.width,
    height: img.height,
    fileSize: img.fileSize,
    mimeType: img.mimeType,
    createdAt: img.createdAt,
    updatedAt: img.updatedAt,
  }));
}
