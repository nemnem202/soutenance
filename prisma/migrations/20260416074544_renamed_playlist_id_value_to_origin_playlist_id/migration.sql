/*
  Warnings:

  - You are about to drop the column `playlistId` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `originPlaylistId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_playlistId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "playlistId",
ADD COLUMN     "originPlaylistId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_originPlaylistId_fkey" FOREIGN KEY ("originPlaylistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
