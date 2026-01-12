import { Archive, ArrowRight, Github, ListTodo, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ProjectActions } from '@/context/projects-context';
import type { Project } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface ProjectCardProps {
  project: Project;
  onSelectProject: (project: Project) => void;
  projectActions: ProjectActions;
}

export function ProjectCard({ project, onSelectProject, projectActions }: ProjectCardProps) {
  const completedTodos = project.todos.filter((t) => t.completed).length;

  const handleMoveToRefined = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (projectActions?.updateProjectStatus) {
      projectActions.updateProjectStatus(project.id, 'refined');
      toast.success(`"${project.name}" has been moved to Refined Projects.`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (projectActions?.deleteProject) {
      projectActions.deleteProject(project.id);
      toast.error(`"${project.name}" has been deleted.`);
    }
  };

  return (
    <Card className="hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col group">
      <Button
        variant="ghost"
        onClick={() => onSelectProject(project)}
        className="cursor-pointer grow h-auto p-0 hover:bg-transparent focus:bg-transparent"
        aria-label={`View details for ${project.name}`}
      >
        <CardHeader className="w-full">
          <CardTitle className="font-headline">{project.name}</CardTitle>
          <CardDescription className="pt-2 whitespace-pre-wrap wrap-break-word">
            {project.description || 'No description provided.'}
          </CardDescription>
          {project.status === 'archived' && project.archiveNotes && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-start gap-2">
                <Archive className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Archive Notes</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
                    {project.archiveNotes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Button>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground mt-auto">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4" />
          <span>
            {completedTodos} / {project.todos.length}
          </span>
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              aria-label="Open GitHub repository in new tab"
            >
              <Github className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          )}
        </div>

        {project.status === 'draft' && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the project "{project.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleMoveToRefined}
              aria-label="Move to refined"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
