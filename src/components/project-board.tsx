'use client';

import { useProjectsStore } from '@/context/projects-context';
import type { Project } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { ProjectColumn } from './project-column';
import { ProjectDetailsSheet } from './project-details-sheet';
import { Skeleton } from './ui/skeleton';

export function ProjectBoard() {
  const { projects, isLoaded, ...projectActions } = useProjectsStore();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const previousProjectIdRef = useRef<string | null>(null);

  const draftProjects = projects.filter((p) => p.status === 'draft');
  const refinedProjects = projects.filter((p) => p.status === 'refined');

  // Sync editingProject with the latest version from the global store
  useEffect(() => {
    if (editingProject) {
      // Only sync if we switched to a different project or if projects array changed
      const projectIdChanged = previousProjectIdRef.current !== editingProject.id;
      previousProjectIdRef.current = editingProject.id;

      const updatedProject = projects.find((p) => p.id === editingProject.id);
      if (updatedProject) {
        // Only update if the project data actually changed (by comparing JSON)
        const currentJson = JSON.stringify(editingProject);
        const updatedJson = JSON.stringify(updatedProject);
        if (currentJson !== updatedJson || projectIdChanged) {
          setEditingProject(updatedProject);
        }
      }
    } else {
      previousProjectIdRef.current = null;
    }
  }, [projects, editingProject]);

  const handleSelectProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    projectActions.updateProject(updatedProject);
  };

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="h-10 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-10 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        <ProjectColumn
          title="Drafts"
          projects={draftProjects}
          onSelectProject={handleSelectProject}
          projectActions={projectActions}
          status="draft"
        />
        <ProjectColumn
          title="Refined Projects"
          projects={refinedProjects}
          onSelectProject={handleSelectProject}
          projectActions={projectActions}
          status="refined"
        />
      </div>
      <ProjectDetailsSheet
        project={editingProject}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingProject(null);
        }}
        onUpdateProject={handleUpdateProject}
        projectActions={projectActions}
      />
    </>
  );
}
