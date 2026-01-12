'use client';

import {
  getRelatedProjectsAction,
  addProjectRelationAction,
  removeProjectRelationAction,
} from '@/app/actions/project-actions';
import type { Project } from '@/lib/types';
import { Link2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface RelatedProjectsProps {
  project: Project;
  allProjects: Project[];
  onProjectSelect?: (project: Project) => void;
}

export function RelatedProjects({ project, allProjects, onProjectSelect }: RelatedProjectsProps) {
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load related projects
  useEffect(() => {
    const loadRelatedProjects = async () => {
      try {
        setIsLoading(true);
        const related = await getRelatedProjectsAction(project.id);
        setRelatedProjects(related);
      } catch (error) {
        console.error('Failed to load related projects', error);
        toast.error('Failed to load related projects');
      } finally {
        setIsLoading(false);
      }
    };

    if (project.id) {
      loadRelatedProjects();
    }
  }, [project.id]);

  // Filter available projects (exclude current project and already related projects)
  const availableProjects = allProjects.filter(
    (p) =>
      p.id !== project.id &&
      !relatedProjects.some((rp) => rp.id === p.id) &&
      (searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddRelation = async (relatedProjectId: string) => {
    try {
      await addProjectRelationAction(project.id, relatedProjectId);
      const relatedProject = allProjects.find((p) => p.id === relatedProjectId);
      if (relatedProject) {
        setRelatedProjects([...relatedProjects, relatedProject]);
        toast.success(`Added "${relatedProject.name}" as a related project`);
      }
      setSearchQuery('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add related project';
      toast.error(message);
    }
  };

  const handleRemoveRelation = async (relatedProjectId: string) => {
    try {
      await removeProjectRelationAction(project.id, relatedProjectId);
      setRelatedProjects(relatedProjects.filter((p) => p.id !== relatedProjectId));
      toast.success('Removed related project');
    } catch {
      toast.error('Failed to remove related project');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Link2 className="w-4 h-4" /> Related Projects
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Related
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <div className="p-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {availableProjects.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  {searchQuery ? 'No projects found' : 'No available projects to add'}
                </div>
              ) : (
                availableProjects.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => handleAddRelation(p.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      {p.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {p.description}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : relatedProjects.length === 0 ? (
        <div className="text-sm text-muted-foreground py-2">
          No related projects yet. Add some to connect related ideas.
        </div>
      ) : (
        <div className="space-y-2">
          {relatedProjects.map((relatedProject) => (
            <div
              key={relatedProject.id}
              className="flex items-center justify-between p-2 bg-muted rounded-lg group"
            >
              <button
                type="button"
                onClick={() => onProjectSelect?.(relatedProject)}
                className="flex-1 text-left hover:text-primary transition-colors"
              >
                <div className="font-medium text-sm">{relatedProject.name}</div>
                {relatedProject.description && (
                  <div className="text-xs text-muted-foreground truncate">
                    {relatedProject.description}
                  </div>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveRelation(relatedProject.id)}
                aria-label={`Remove ${relatedProject.name} from related projects`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
