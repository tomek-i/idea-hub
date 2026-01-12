'use client';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Project, Todo } from '@/lib/types';
import { ArrowRight, ExternalLink, Github, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { NotesEditor } from './notes-editor';
import { TodoList } from './todo-list';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ProjectDetailsSheetProps {
  project: Project | null;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateProject: (project: Project) => void;
  projectActions: {
    deleteProject: (projectId: string) => void;
    updateProjectStatus: (projectId: string, status: 'refined') => void;
    addTodo: (projectId: string, todoText: string) => void;
    updateTodo: (projectId: string, updatedTodo: Todo) => void;
    deleteTodo: (projectId: string, todoId: string) => void;
  };
}

export function ProjectDetailsSheet({
  project,
  onOpenChange,
  onUpdateProject,
  projectActions,
}: ProjectDetailsSheetProps) {
  const [localProject, setLocalProject] = useState<Project | null>(project);

  // Sync local state when project prop changes
  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const nameId = `name-${localProject?.id}`;
  const descriptionId = `description-${localProject?.id}`;
  const githubUrlId = `githubUrl-${localProject?.id}`;

  if (!localProject) return null;

  const handleFieldChange = (field: keyof Project, value: string) => {
    const updatedProject = { ...localProject, [field]: value };
    setLocalProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  const handleMoveToRefined = () => {
    projectActions.updateProjectStatus(localProject.id, 'refined');
    onOpenChange(false);
    toast.success(`"${localProject.name}" has been moved to Refined Projects.`);
  };

  const handleDelete = () => {
    projectActions.deleteProject(localProject.id);
    onOpenChange(false);
    toast.error(`"${localProject.name}" has been deleted.`);
  };

  const handleUpdateProjectFromNotes = (updatedProject: Project) => {
    setLocalProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  return (
    <Sheet open={!!localProject} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">{localProject.name}</SheetTitle>
          <SheetDescription>
            {localProject.status === 'draft' ? 'Draft Idea' : 'Refined Project'}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor={nameId}>Project Name</Label>
            <Input
              id={nameId}
              value={localProject.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={descriptionId}>Description</Label>
            <Textarea
              id={descriptionId}
              value={localProject.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="A short description of the project."
              rows={3}
            />
          </div>

          <NotesEditor project={localProject} onUpdateProject={handleUpdateProjectFromNotes} />

          <TodoList project={localProject} projectActions={projectActions} />

          {localProject.status === 'refined' && (
            <div className="space-y-2">
              <Label htmlFor="githubUrl">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub Repository
                </div>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={githubUrlId}
                  value={localProject.githubUrl || ''}
                  onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/user/repo"
                />
                {localProject.githubUrl && (
                  <Button asChild variant="outline" size="icon">
                    <Link
                      href={localProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open GitHub repository in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <SheetFooter className="mt-auto pt-4 border-t">
          <div className="flex justify-between w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" aria-label="Delete project">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the project "{localProject.name}". This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {localProject.status === 'draft' && (
              <Button onClick={handleMoveToRefined}>
                Move to Refined <ArrowRight className="ml-2" />
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
