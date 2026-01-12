'use client';

import { useProjectsStore } from '@/context/projects-context';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BoxSelect, Download, Sparkles, Upload } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { IdeaGeneratorDialog } from './idea-generator-dialog';
import { PurgeDialog } from './purge-dialog';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export function Header() {
  const pathname = usePathname();
  const { projects, setAllProjects } = useProjectsStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (projects.length === 0) {
      toast.error('There are no projects to export.');
      return;
    }
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project-hub-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Your projects have been saved to project-hub-data.json.');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedProjects = JSON.parse(content) as Project[];
            await setAllProjects(importedProjects);
            toast.success('Your projects have been restored.');
          }
        } catch (error) {
          toast.error('The selected file is not valid JSON.');
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <BoxSelect className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl font-headline">
          Project Hub
        </h1>
        <nav className="hidden md:flex items-center gap-4 ml-6">
          <Link
            href="/"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Refined
          </Link>
          <Link
            href="/drafts"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/drafts' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Drafts
          </Link>
          <Link
            href="/archived"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/archived' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Archived
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleImportClick}>
          <Upload className="mr-2 h-4 w-4" /> Import
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json"
        />
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <PurgeDialog />
        <IdeaGeneratorDialog>
          <Button>
            <Sparkles className="mr-2" />
            Generate Ideas
          </Button>
        </IdeaGeneratorDialog>
        <ThemeToggle />
      </div>
    </header>
  );
}
