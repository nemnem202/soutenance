-- DropForeignKey
ALTER TABLE "PlaylistIncludesExercise" DROP CONSTRAINT "PlaylistIncludesExercise_playlistId_fkey";

-- AddForeignKey
ALTER TABLE "PlaylistIncludesExercise" ADD CONSTRAINT "PlaylistIncludesExercise_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
