-- CreateTable
CREATE TABLE "UserLikesUser" (
    "likedId" INTEGER NOT NULL,
    "likingId" INTEGER NOT NULL,

    CONSTRAINT "UserLikesUser_pkey" PRIMARY KEY ("likedId","likingId")
);

-- CreateTable
CREATE TABLE "UserLikesExercise" (
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikesExercise_pkey" PRIMARY KEY ("userId","exerciseId")
);

-- CreateTable
CREATE TABLE "UserLikesPlaylist" (
    "userId" INTEGER NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLikesPlaylist_pkey" PRIMARY KEY ("userId","playlistId")
);

-- AddForeignKey
ALTER TABLE "UserLikesUser" ADD CONSTRAINT "UserLikesUser_likedId_fkey" FOREIGN KEY ("likedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesUser" ADD CONSTRAINT "UserLikesUser_likingId_fkey" FOREIGN KEY ("likingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesExercise" ADD CONSTRAINT "UserLikesExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesExercise" ADD CONSTRAINT "UserLikesExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesPlaylist" ADD CONSTRAINT "UserLikesPlaylist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesPlaylist" ADD CONSTRAINT "UserLikesPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
