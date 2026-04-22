-- DropForeignKey
ALTER TABLE "Chord" DROP CONSTRAINT "Chord_altId_fkey";

-- DropForeignKey
ALTER TABLE "Chord" DROP CONSTRAINT "Chord_overId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseSavesUserConfig" DROP CONSTRAINT "ExerciseSavesUserConfig_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseSavesUserConfig" DROP CONSTRAINT "ExerciseSavesUserConfig_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistIncludesExercise" DROP CONSTRAINT "PlaylistIncludesExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikesExercise" DROP CONSTRAINT "UserLikesExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikesExercise" DROP CONSTRAINT "UserLikesExercise_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikesUser" DROP CONSTRAINT "UserLikesUser_likedId_fkey";

-- DropForeignKey
ALTER TABLE "UserLikesUser" DROP CONSTRAINT "UserLikesUser_likingId_fkey";

-- AddForeignKey
ALTER TABLE "UserLikesUser" ADD CONSTRAINT "UserLikesUser_likedId_fkey" FOREIGN KEY ("likedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesUser" ADD CONSTRAINT "UserLikesUser_likingId_fkey" FOREIGN KEY ("likingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesExercise" ADD CONSTRAINT "UserLikesExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikesExercise" ADD CONSTRAINT "UserLikesExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSavesUserConfig" ADD CONSTRAINT "ExerciseSavesUserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSavesUserConfig" ADD CONSTRAINT "ExerciseSavesUserConfig_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chord" ADD CONSTRAINT "Chord_overId_fkey" FOREIGN KEY ("overId") REFERENCES "Chord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chord" ADD CONSTRAINT "Chord_altId_fkey" FOREIGN KEY ("altId") REFERENCES "Chord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistIncludesExercise" ADD CONSTRAINT "PlaylistIncludesExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
