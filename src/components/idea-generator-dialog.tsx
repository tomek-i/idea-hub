'use client';
import { ai } from '@/ai/ai';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProjectsStore } from '@/context/projects-context';
import { Loader, Plus, Sparkles } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function IdeaGeneratorDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const { addProject } = useProjectsStore();
  const keywordsId = 'keywords';
  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setIsLoading(true);
    setIdeas([]);
    try {
      const result = await ai.generateProjectIdeas(keywords);
      setIdeas(result.ideas);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      toast.error('Could not generate ideas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIdeaAsProject = (idea: string) => {
    addProject({
      name: idea,
      description: `Generated from keywords: "${keywords}"`,
      notes: '',
    });
    toast.success(`"${idea}" has been added to your drafts.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles /> AI Idea Generator
          </DialogTitle>
          <DialogDescription>
            Enter some keywords or a description to generate new project ideas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keywords" className="text-right">
              Keywords
            </Label>
            <Input
              id={keywordsId}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'machine learning', 'fitness app'"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {ideas.length > 0 && (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            <h3 className="font-semibold text-sm">Generated Ideas:</h3>
            {ideas.map((idea) => (
              <Card key={idea} className="bg-muted/30">
                <CardContent className="p-3 flex items-center justify-between">
                  <p className="text-sm flex-1">{idea}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddIdeaAsProject(idea)}
                    aria-label={`Add idea as project: ${idea}`}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add to Drafts
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button type="button" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
