"use client";
import { ArrowRight, ExternalLink, Github, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Project, Todo } from "@/lib/types";
import { NotesEditor } from "./notes-editor";
import { TodoList } from "./todo-list";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ProjectDetailsSheetProps {
  project: Project | null;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateProject: (project: Project) => void;
  projectActions: {
    deleteProject: (projectId: string) => void;
    updateProjectStatus: (projectId: string, status: "refined") => void;
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
  const nameId = `name-${project?.id}`;
  const descriptionId = `description-${project?.id}`;
  const githubUrlId = `githubUrl-${project?.id}`;

  if (!project) return null;

  const handleFieldChange = (field: keyof Project, value: string) => {
    onUpdateProject({ ...project, [field]: value });
  };

  const handleMoveToRefined = () => {
    projectActions.updateProjectStatus(project.id, "refined");
    onOpenChange(false);
    toast.success(`"${project.name}" has been moved to Refined Projects.`);
  };

  const handleDelete = () => {
    projectActions.deleteProject(project.id);
    onOpenChange(false);
    toast.error(`"${project.name}" has been deleted.`);
  };

  return (
    <Sheet open={!!project} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">{project.name}</SheetTitle>
          <SheetDescription>{project.status === "draft" ? "Draft Idea" : "Refined Project"}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pr-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor={nameId}>Project Name</Label>
            <Input
              id={nameId}
              value={project.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={descriptionId}>Description</Label>
            <Textarea
              id={descriptionId}
              value={project.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="A short description of the project."
              rows={3}
            />
          </div>

          <NotesEditor project={project} onUpdateProject={onUpdateProject} />

          <TodoList project={project} projectActions={projectActions} />

          {project.status === "refined" && (
            <div className="space-y-2">
              <Label htmlFor="githubUrl">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub Repository
                </div>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={githubUrlId}
                  value={project.githubUrl || ""}
                  onChange={(e) => handleFieldChange("githubUrl", e.target.value)}
                  placeholder="https://github.com/user/repo"
                />
                {project.githubUrl && (
                  <Button asChild variant="outline" size="icon">
                    <Link
                      href={project.githubUrl}
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
                    This will permanently delete the project "{project.name}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {project.status === "draft" && (
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
