'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import type { Project, ProjectStatus, Todo } from '@/lib/types';

const STORE_KEY = 'project-hub-projects';

export type ProjectActions = {
  addProject: (newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status'>) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
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

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem(STORE_KEY);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to load projects from localStorage', error);
      setProjects([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(projects));
      } catch (error) {
        console.error('Failed to save projects to localStorage', error);
      }
    }
  }, [projects, isLoaded]);

  const addProject = useCallback(
    (newProject: Omit<Project, 'id' | 'todos' | 'githubUrl' | 'status'>) => {
      setProjects((prev) => [
        ...prev,
        {
          ...newProject,
          id: new Date().toISOString(),
          todos: [],
          githubUrl: null,
          status: 'draft',
        },
      ]);
    },
    []
  );

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const updateProjectStatus = useCallback((projectId: string, status: ProjectStatus) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status } : p)));
  }, []);

  const addTodo = useCallback((projectId: string, todoText: string) => {
    const newTodo: Todo = {
      id: new Date().toISOString(),
      text: todoText,
      completed: false,
    };
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, todos: [...p.todos, newTodo] } : p))
    );
  }, []);

  const updateTodo = useCallback((projectId: string, updatedTodo: Todo) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              todos: p.todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)),
            }
          : p
      )
    );
  }, []);

  const deleteTodo = useCallback((projectId: string, todoId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, todos: p.todos.filter((t) => t.id !== todoId) } : p
      )
    );
  }, []);

  const setAllProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
  }, []);

  const purgeAllProjects = useCallback(() => {
    setProjects([]);
  }, []);

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
