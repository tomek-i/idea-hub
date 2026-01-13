-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "githubUrl" TEXT,
    "status" TEXT NOT NULL,
    "archiveNotes" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Project" ("archiveNotes", "description", "githubUrl", "id", "name", "notes", "status") SELECT "archiveNotes", "description", "githubUrl", "id", "name", "notes", "status" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
