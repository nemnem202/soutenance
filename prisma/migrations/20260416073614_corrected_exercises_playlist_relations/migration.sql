/*
  Warnings:

  - You are about to drop the `_PlaylistCollections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PlaylistCollections" DROP CONSTRAINT "_PlaylistCollections_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlaylistCollections" DROP CONSTRAINT "_PlaylistCollections_B_fkey";

-- DropTable
DROP TABLE "_PlaylistCollections";

-- CreateTable
CREATE TABLE "PlaylistIncludesExercise" (
    "exerciseId" INTEGER NOT NULL,
    "playlistId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistIncludesExercise_pkey" PRIMARY KEY ("exerciseId","playlistId")
);

-- AddForeignKey
ALTER TABLE "PlaylistIncludesExercise" ADD CONSTRAINT "PlaylistIncludesExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistIncludesExercise" ADD CONSTRAINT "PlaylistIncludesExercise_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
