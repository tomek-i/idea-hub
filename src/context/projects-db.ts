
import { prisma } from "@/lib/prisma";
import type { ProjectStatus } from "@/generated/prisma/enums";



export async function getAllProjects() {
  return prisma.project.findMany({ include: { todos: true } });
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
  data: Partial<{ name: string; description: string; notes: string; status: ProjectStatus; githubUrl: string }>
) {
  // If status is present, ensure it is the correct enum type
  const fixedData = { ...data };
  if (fixedData.status && typeof fixedData.status === 'string') {
    if (["draft", "refined"].includes(fixedData.status)) {
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
