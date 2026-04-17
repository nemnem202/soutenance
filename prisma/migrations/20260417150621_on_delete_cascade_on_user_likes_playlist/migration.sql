-- DropForeignKey
ALTER TABLE "UserLikesPlaylist" DROP CONSTRAINT "UserLikesPlaylist_playlistId_fkey";

-- AddForeignKey
ALTER TABLE "UserLikesPlaylist" ADD CONSTRAINT "UserLikesPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
