import type { ProjectStatus } from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

export async function getAllProjects(includeRelated = false) {
  if (includeRelated) {
    return prisma.project.findMany({
      include: {
        todos: true,
        relatedTo: {
          include: {
            to: {
              include: { todos: true },
            },
          },
        },
      },
    });
  }
  return prisma.project.findMany({ include: { todos: true } });
}

export async function getRelatedProjects(projectId: string) {
  const relations = await prisma.projectRelation.findMany({
    where: { fromId: projectId },
    include: {
      to: {
        include: { todos: true },
      },
    },
  });
  return relations.map((r) => r.to);
}

export async function addProjectRelation(fromId: string, toId: string) {
  // Prevent self-relation
  if (fromId === toId) {
    throw new Error('A project cannot be related to itself');
  }
  // Check if relation already exists
  const existing = await prisma.projectRelation.findUnique({
    where: { fromId_toId: { fromId, toId } },
  });
  if (existing) {
    throw new Error('This relation already exists');
  }
  return prisma.projectRelation.create({
    data: { fromId, toId },
  });
}

export async function removeProjectRelation(fromId: string, toId: string) {
  return prisma.projectRelation.delete({
    where: { fromId_toId: { fromId, toId } },
  });
}

export async function addProject(data: { name: string; description: string; notes: string }) {
  return prisma.project.create({
    data: {
      ...data,
      status: 'draft',
      githubUrl: null,
    },
  });
}
export async function updateProject(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    notes: string;
    status: ProjectStatus;
    githubUrl: string;
    archiveNotes: string | null;
  }>
) {
  // If status is present, ensure it is the correct enum type
  const fixedData = { ...data };
  if (fixedData.status && typeof fixedData.status === 'string') {
    if (['draft', 'refined', 'archived'].includes(fixedData.status)) {
      fixedData.status = fixedData.status as ProjectStatus;
    } else {
      delete fixedData.status;
    }
  }
  return prisma.project.update({
    where: { id },
    data: fixedData,
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export async function addTodo(projectId: string, text: string) {
  return prisma.todo.create({
    data: {
      text,
      completed: false,
      projectId,
    },
  });
}

export async function updateTodo(id: string, data: Partial<{ text: string; completed: boolean }>) {
  return prisma.todo.update({
    where: { id },
    data,
  });
}

export async function deleteTodo(id: string) {
  return prisma.todo.delete({ where: { id } });
}

export async function purgeAllProjects() {
  // Delete all todos first (due to foreign key constraint)
  await prisma.todo.deleteMany({});
  // Then delete all projects
  await prisma.project.deleteMany({});
}

interface ImportProject {
  id: string;
  name: string;
  description: string;
  notes: string;
  githubUrl: string | null;
  status: ProjectStatus;
  archiveNotes: string | null;
  todos?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

export async function importProjects(projects: ImportProject[]) {
  // First purge all existing data
  await purgeAllProjects();

  // Then import all projects with their todos
  for (const project of projects) {
    const { todos, ...projectData } = project;
    const createdProject = await prisma.project.create({
      data: {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        notes: projectData.notes,
        githubUrl: projectData.githubUrl,
        status: projectData.status,
        archiveNotes: projectData.archiveNotes || null,
      },
    });

    // Create todos for this project
    if (todos && todos.length > 0) {
      await prisma.todo.createMany({
        data: todos.map((todo) => ({
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
          projectId: createdProject.id,
        })),
      });
    }
  }
}
