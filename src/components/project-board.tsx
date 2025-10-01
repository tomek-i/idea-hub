'use client';

import { useState } from 'react';
import { useProjectsStore } from '@/context/projects-context';
import type { Project } from '@/lib/types';
import { ProjectColumn } from './project-column';
import { ProjectDetailsSheet } from './project-details-sheet';
import { Skeleton } from './ui/skeleton';

export function ProjectBoard() {
  const { projects, isLoaded, ...projectActions } = useProjectsStore();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const draftProjects = projects.filter((p) => p.status === 'draft');
  const refinedProjects = projects.filter((p) => p.status === 'refined');

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
