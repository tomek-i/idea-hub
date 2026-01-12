'use client';

import { Header } from '@/components/header';
import { ProjectColumn } from '@/components/project-column';
import { ProjectDetailsSheet } from '@/components/project-details-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjectsStore } from '@/context/projects-context';
import type { Project } from '@/lib/types';
import { useState } from 'react';

export default function ArchivedPage() {
  const { projects, isLoaded, ...projectActions } = useProjectsStore();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const archivedProjects = projects.filter((p) => p.status === 'archived');

  const handleSelectProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    projectActions.updateProject(updatedProject);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {!isLoaded ? (
              <div>
                <Skeleton className="h-10 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ) : (
              <ProjectColumn
                title="Archived"
                projects={archivedProjects}
                onSelectProject={handleSelectProject}
                projectActions={projectActions}
                status="archived"
              />
            )}
          </div>
        </main>
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
