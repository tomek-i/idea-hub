'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { ProjectCard } from '@/components/project-card';
import { ProjectDetailsSheet } from '@/components/project-details-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjectsStore } from '@/context/projects-context';
import type { Project } from '@/lib/types';

export default function Home() {
  const { projects, isLoaded, ...projectActions } = useProjectsStore();
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const refinedProjects = projects.filter((p) => p.status === 'refined');

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
          <h1 className="text-2xl font-bold mb-6">Refined Projects</h1>
          {!isLoaded ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refinedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelectProject={handleSelectProject}
                  projectActions={projectActions}
                />
              ))}
            </div>
          )}
          {isLoaded && refinedProjects.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No refined projects yet.</p>
              <p className="text-sm">Move a project from drafts to get started.</p>
            </div>
          )}
        </main>
      </div>
      <ProjectDetailsSheet
        project={editingProject}
        allProjects={projects}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingProject(null);
        }}
        onUpdateProject={handleUpdateProject}
        onProjectSelect={handleSelectProject}
        projectActions={projectActions}
        imageActions={{
          uploadImage: projectActions.uploadProjectImage,
          updateImageCaption: projectActions.updateProjectImageCaption,
          deleteImage: projectActions.deleteProjectImage,
        }}
      />
    </>
  );
}
