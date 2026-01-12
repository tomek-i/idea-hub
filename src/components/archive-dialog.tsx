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
import { Archive } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ArchiveDialogProps {
  projectName: string;
  onArchive: (archiveNotes: string) => void;
}

export function ArchiveDialog({ projectName, onArchive }: ArchiveDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [archiveNotes, setArchiveNotes] = useState('');

  const handleArchive = () => {
    onArchive(archiveNotes);
    setArchiveNotes('');
    setIsOpen(false);
    toast.success(`"${projectName}" has been archived.`);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Archive project">
          <Archive className="mr-2 h-4 w-4" /> Archive
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Project</AlertDialogTitle>
          <AlertDialogDescription>
            Archive "{projectName}"? You can add notes to help you remember why it was archived.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="archive-notes">Archive Notes (optional)</Label>
          <Textarea
            id="archive-notes"
            value={archiveNotes}
            onChange={(e) => setArchiveNotes(e.target.value)}
            placeholder="Why was this project archived? (e.g., 'Completed', 'No longer relevant', 'Merged into another project')"
            rows={4}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setArchiveNotes('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
