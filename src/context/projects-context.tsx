'use client';

import type { Project, ProjectStatus, Todo } from '@/lib/types';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import type { StorageProvider } from './storage-provider';

export type ProjectActions = {
  addProject: (
    newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status' | 'archiveNotes'>
  ) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
  updateProjectStatus: (
    projectId: string,
    status: ProjectStatus,
    archiveNotes?: string | null
  ) => void;
  addTodo: (projectId: string, todoText: string) => void;
  updateTodo: (projectId: string, updatedTodo: Todo) => void;
  deleteTodo: (projectId: string, todoId: string) => void;
  setAllProjects: (newProjects: Project[]) => void;
  purgeAllProjects: () => void;
};

type ProjectsContextType = {
  projects: Project[];
  isLoaded: boolean;
} & ProjectActions;

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

interface ProjectsProviderProps {
  children: ReactNode;
  storageProvider: StorageProvider;
}

export function ProjectsProvider({ children, storageProvider }: ProjectsProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await storageProvider.getAllProjects();
        setProjects(loadedProjects);
      } catch (error) {
        console.error('Failed to load projects', error);
        setProjects([]);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProjects();
  }, [storageProvider]);

  const addProject = useCallback(
    async (newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status' | 'archiveNotes'>) => {
      try {
        const created = await storageProvider.addProject(newProject);
        setProjects((prev) => [...prev, created]);
      } catch (error) {
        console.error('Failed to add project', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const updateProject = useCallback(
    async (updatedProject: Project) => {
      try {
        const updated = await storageProvider.updateProject(updatedProject);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } catch (error) {
        console.error('Failed to update project', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const deleteProject = useCallback(
    async (projectId: string) => {
      try {
        await storageProvider.deleteProject(projectId);
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } catch (error) {
        console.error('Failed to delete project', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const updateProjectStatus = useCallback(
    async (projectId: string, status: ProjectStatus, archiveNotes?: string | null) => {
      try {
        const updated = await storageProvider.updateProjectStatus(projectId, status, archiveNotes);
        setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      } catch (error) {
        console.error('Failed to update project status', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const addTodo = useCallback(
    async (projectId: string, todoText: string) => {
      try {
        const newTodo = await storageProvider.addTodo(projectId, todoText);
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, todos: [...p.todos, newTodo] } : p))
        );
      } catch (error) {
        console.error('Failed to add todo', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const updateTodo = useCallback(
    async (projectId: string, updatedTodo: Todo) => {
      try {
        const updated = await storageProvider.updateTodo(projectId, updatedTodo);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  todos: p.todos.map((t) => (t.id === updated.id ? updated : t)),
                }
              : p
          )
        );
      } catch (error) {
        console.error('Failed to update todo', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const deleteTodo = useCallback(
    async (projectId: string, todoId: string) => {
      try {
        await storageProvider.deleteTodo(projectId, todoId);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, todos: p.todos.filter((t) => t.id !== todoId) } : p
          )
        );
      } catch (error) {
        console.error('Failed to delete todo', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const setAllProjects = useCallback(
    async (newProjects: Project[]) => {
      try {
        // Purge all existing projects first
        await storageProvider.purgeAllProjects();
        // Then import the new projects
        await storageProvider.importProjects(newProjects);
        // Reload projects from storage
        const loadedProjects = await storageProvider.getAllProjects();
        setProjects(loadedProjects);
      } catch (error) {
        console.error('Failed to import projects', error);
        throw error;
      }
    },
    [storageProvider]
  );

  const purgeAllProjects = useCallback(async () => {
    try {
      await storageProvider.purgeAllProjects();
      setProjects([]);
    } catch (error) {
      console.error('Failed to purge projects', error);
      throw error;
    }
  }, [storageProvider]);

  const value = {
    projects,
    isLoaded,
    addProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    addTodo,
    updateTodo,
    deleteTodo,
    setAllProjects,
    purgeAllProjects,
  };

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjectsStore() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjectsStore must be used within a ProjectsProvider');
  }
  return context;
}
