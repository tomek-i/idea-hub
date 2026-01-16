'use client';
import { Archive, ArchiveRestore, ArrowRight, ExternalLink, Github, Trash2, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Project, Todo } from '@/lib/types';
import { ArchiveDialog } from './archive-dialog';
import { ImageUpload } from './image-upload';
import { ImageGallery } from './image-gallery';
import { NotesEditor } from './notes-editor';
import { RelatedProjects } from './related-projects';
import { TodoList } from './todo-list';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import {
  uploadProjectImageAction,
  updateProjectImageCaptionAction,
  deleteProjectImageAction,
  getProjectImagesAction,
} from '@/app/actions/project-actions';

interface ProjectDetailsSheetProps {
  project: Project | null;
  allProjects?: Project[]; // Optional - if not provided, RelatedProjects won't work
  onOpenChange: (isOpen: boolean) => void;
  onUpdateProject: (project: Project) => void;
  onProjectSelect?: (project: Project) => void; // Optional - for navigating to related projects
  projectActions: {
    deleteProject: (projectId: string) => void;
    updateProjectStatus: (
      projectId: string,
      status: 'refined' | 'archived' | 'draft',
      archiveNotes?: string | null
    ) => void;
    addTodo: (projectId: string, todoText: string) => void;
    updateTodo: (projectId: string, updatedTodo: Todo) => void;
    deleteTodo: (projectId: string, todoId: string) => void;
  };
  imageActions?: {
    uploadImage: (projectId: string, formData: FormData) => Promise<void>;
    updateImageCaption: (imageId: string, caption: string) => Promise<void>;
    deleteImage: (imageId: string) => Promise<void>;
  };
}

export function ProjectDetailsSheet({
  project,
  allProjects = [],
  onOpenChange,
  onUpdateProject,
  onProjectSelect,
  projectActions,
  imageActions,
}: ProjectDetailsSheetProps) {
  const [localProject, setLocalProject] = useState<Project | null>(project);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sync local state when project prop changes
  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const nameId = `name-${localProject?.id}`;
  const descriptionId = `description-${localProject?.id}`;
  const githubUrlId = `githubUrl-${localProject?.id}`;
  const privacyId = `privacy-${localProject?.id}`;

  if (!localProject) return null;

  const handleFieldChange = (field: keyof Project, value: string | boolean) => {
    const updatedProject = { ...localProject, [field]: value };
    setLocalProject(updatedProject);
    onUpdateProject(updatedProject);
  };

  const handleMoveToRefined = () => {
    projectActions.updateProjectStatus(localProject.id, 'refined');
    onOpenChange(false);
    toast.success(`"${localProject.name}" has been moved to Refined Projects.`);
  };

  const handleArchive = (archiveNotes: string) => {
    projectActions.updateProjectStatus(localProject.id, 'archived', archiveNotes || null);
    onOpenChange(false);
  };

  const handleUnarchive = () => {
    // Restore to draft by default (user can move to refined if needed)
    projectActions.updateProjectStatus(localProject.id, 'draft', null);
    onOpenChange(false);
    toast.success(`"${localProject.name}" has been unarchived and moved to Drafts.`);
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

  const handleImageUpload = async (files: File[]) => {
    if (!imageActions || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        await imageActions.uploadImage(localProject.id, formData);
      }
      
      // Refresh project data to show new images
      startTransition(async () => {
        const updatedImages = await getProjectImagesAction(localProject.id);
        setLocalProject(prev => prev ? { ...prev, images: updatedImages } : null);
      });
      
      toast.success(`${files.length} image(s) uploaded successfully`);
      setShowImageUpload(false);
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateImageCaption = async (imageId: string, caption: string) => {
    if (!imageActions) return;

    try {
      await imageActions.updateImageCaption(imageId, caption);
      
      // Refresh project data
      startTransition(async () => {
        const updatedImages = await getProjectImagesAction(localProject.id);
        setLocalProject(prev => prev ? { ...prev, images: updatedImages } : null);
      });
      
      toast.success('Caption updated');
    } catch (error) {
      toast.error('Failed to update caption');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!imageActions) return;

    try {
      await imageActions.deleteImage(imageId);
      
      // Refresh project data
      startTransition(async () => {
        const updatedImages = await getProjectImagesAction(localProject.id);
        setLocalProject(prev => prev ? { ...prev, images: updatedImages } : null);
      });
      
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <Sheet open={!!localProject} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">{localProject.name}</SheetTitle>
          <SheetDescription>
            {localProject.status === 'draft'
              ? 'Draft Idea'
              : localProject.status === 'refined'
                ? 'Refined Project'
                : 'Archived Project'}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 space-y-6">
<div className="space-y-2">
            <Label htmlFor={privacyId}>Repository Privacy</Label>
            <div className="flex items-center gap-2">
              <Switch
                id={privacyId}
                checked={!!localProject.private}
                onCheckedChange={(checked) => handleFieldChange('private', checked)}
              />
              <span className="text-sm">
                {localProject.private
                  ? 'Private (only you can see this repo)'
                  : 'Public (anyone can see this repo)'}
              </span>
            </div>
          </div>
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

          {/* Image Management Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <ImagePlus className="w-4 h-4" /> Project Images
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isUploading}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                {showImageUpload ? 'Cancel' : 'Add Images'}
              </Button>
            </div>

            {showImageUpload && (
              <ImageUpload
                onUpload={handleImageUpload}
                className="mt-4"
              />
            )}

            <ImageGallery
              images={localProject.images}
              onDelete={imageActions ? handleDeleteImage : undefined}
              onUpdateCaption={imageActions ? handleUpdateImageCaption : undefined}
              className="mt-4"
            />
          </div>

          {localProject.status === 'archived' && localProject.archiveNotes && (
            <div className="space-y-2 p-4 bg-muted rounded-lg border">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Archive className="w-4 h-4" /> Archive Notes
              </Label>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {localProject.archiveNotes}
              </p>
            </div>
          )}

          <TodoList project={localProject} projectActions={projectActions} />

          {allProjects.length > 0 && (
            <RelatedProjects
              project={localProject}
              allProjects={allProjects}
              onProjectSelect={(relatedProject) => {
                onProjectSelect?.(relatedProject);
                onOpenChange(false);
              }}
            />
          )}

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

          <div className="space-y-2">
            <Label htmlFor="publishedUrl">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Published URL
              </div>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="publishedUrl"
                value={localProject.publishedUrl || ''}
                onChange={(e) => handleFieldChange('publishedUrl', e.target.value)}
                placeholder="https://example.com"
              />
              {localProject.publishedUrl && (
                <Button asChild variant="outline" size="icon">
                  <Link
                    href={localProject.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open published project in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
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

            <div className="flex gap-2">
              {localProject.status === 'archived' ? (
                <Button onClick={handleUnarchive} variant="outline">
                  <ArchiveRestore className="mr-2 h-4 w-4" /> Unarchive
                </Button>
              ) : (
                <>
                  {localProject.status === 'draft' && (
                    <Button onClick={handleMoveToRefined}>
                      Move to Refined <ArrowRight className="ml-2" />
                    </Button>
                  )}
                  <ArchiveDialog projectName={localProject.name} onArchive={handleArchive} />
                </>
              )}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
