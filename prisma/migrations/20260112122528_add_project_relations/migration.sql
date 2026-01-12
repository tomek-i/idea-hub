-- CreateTable
CREATE TABLE "ProjectRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProjectRelation_fromId_idx" ON "ProjectRelation"("fromId");

-- CreateIndex
CREATE INDEX "ProjectRelation_toId_idx" ON "ProjectRelation"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRelation_fromId_toId_key" ON "ProjectRelation"("fromId", "toId");
