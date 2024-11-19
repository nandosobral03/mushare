-- CreateTable
CREATE TABLE "SpotifyUser" (
    "spotifyId" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Grid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "spotifyUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "savedCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Grid_spotifyUserId_fkey" FOREIGN KEY ("spotifyUserId") REFERENCES "SpotifyUser" ("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GridAlbum" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gridId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "GridAlbum_gridId_fkey" FOREIGN KEY ("gridId") REFERENCES "Grid" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GridAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "spotifyUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Chart_spotifyUserId_fkey" FOREIGN KEY ("spotifyUserId") REFERENCES "SpotifyUser" ("spotifyId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartAlbum" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chartId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "ChartAlbum_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SearchCache" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GridLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gridId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GridLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "SpotifyUser" ("spotifyId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GridLike_gridId_fkey" FOREIGN KEY ("gridId") REFERENCES "Grid" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChartLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "SpotifyUser" ("spotifyId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartLike_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GridAlbum_gridId_idx" ON "GridAlbum"("gridId");

-- CreateIndex
CREATE INDEX "GridAlbum_albumId_idx" ON "GridAlbum"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_spotifyId_key" ON "Album"("spotifyId");

-- CreateIndex
CREATE INDEX "Chart_spotifyUserId_idx" ON "Chart"("spotifyUserId");

-- CreateIndex
CREATE INDEX "ChartAlbum_chartId_idx" ON "ChartAlbum"("chartId");

-- CreateIndex
CREATE INDEX "ChartAlbum_albumId_idx" ON "ChartAlbum"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "GridLike_userId_gridId_key" ON "GridLike"("userId", "gridId");

-- CreateIndex
CREATE UNIQUE INDEX "ChartLike_userId_chartId_key" ON "ChartLike"("userId", "chartId");
