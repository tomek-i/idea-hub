'use client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { ProjectActions } from '@/context/projects-context';
import type { Project, ProjectStatus } from '@/lib/types';
import { ProjectCard } from './project-card';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';

interface ProjectColumnProps {
  title: string;
  projects: Project[];
  status: ProjectStatus;
  onSelectProject: (project: Project) => void;
  projectActions: ProjectActions;
}

export function ProjectColumn({
  title,
  projects,
  status,
  onSelectProject,
  projectActions,
}: ProjectColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      projectActions.addProject({
        name: newProjectName.trim(),
        description: '',
        notes: '',
      });
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  return (
    <Card className="bg-card/50 border-dashed">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {status === 'draft' && !isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            aria-label="Add new draft"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {status === 'draft' && isAdding && (
            <div className="flex gap-2 p-2 bg-card rounded-lg">
              <Input
                placeholder="New idea name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                autoFocus
              />
              <Button size="sm" onClick={handleAddProject}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          )}
          {projects.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No {title.toLowerCase()} yet.</p>
            </div>
          )}
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
              projectActions={projectActions}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
