'use client';
import { Loader, NotebookText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ai } from '@/ai/ai';
import type { Project } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface NotesEditorProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function NotesEditor({ project, onUpdateProject }: NotesEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAssist = async () => {
    setIsLoading(true);
    setIsDialogOpen(true);
    try {
      const result = await ai.generateProjectNotes(project.description, project.notes);
      setSuggestion(result.improvedNotes);
    } catch (error) {
      console.error('AI assistant failed:', error);
      toast.error('Could not get suggestions. Please try again.');
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onUpdateProject({ ...project, notes: suggestion });
    }
    setIsDialogOpen(false);
    setSuggestion(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSuggestion(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NotebookText className="w-5 h-5" /> Notes
            </div>
            <Button variant="secondary" size="sm" onClick={handleAssist} disabled={isLoading}>
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI Assist
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={project.notes}
            onChange={(e) => onUpdateProject({ ...project, notes: e.target.value })}
            placeholder="Jot down your notes, thoughts, and plans for the project."
            rows={8}
            className="text-base"
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Note Suggestions</DialogTitle>
            <DialogDescription>
              Here are some suggestions to improve your project notes.
            </DialogDescription>
          </DialogHeader>
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {suggestion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label className="font-bold">Current Notes</Label>
                <div className="mt-2 p-3 rounded-md border bg-muted/50 text-sm whitespace-pre-wrap min-h-[200px]">
                  {project.notes || '(empty)'}
                </div>
              </div>
              <div>
                <Label className="font-bold">Suggested Notes</Label>
                <div className="mt-2 p-3 rounded-md border bg-green-500/10 text-sm whitespace-pre-wrap min-h-[200px]">
                  {suggestion}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleAcceptSuggestion} disabled={!suggestion}>
              Accept Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
