'use client';

import { ProjectsProvider } from './projects-context';
import { SqliteStorageProvider } from './sqlite-storage-provider';

const storageProvider = new SqliteStorageProvider();

export function ProjectsProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ProjectsProvider storageProvider={storageProvider}>{children}</ProjectsProvider>;
}
