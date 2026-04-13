/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `Config` table. All the data in the column will be lost.
  - You are about to drop the column `composer` on the `Exercise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[configId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `configId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_timeSignatureId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_playlistId_fkey";

-- DropIndex
DROP INDEX "Config_exerciseId_key";

-- DropIndex
DROP INDEX "Config_timeSignatureId_key";

-- AlterTable
ALTER TABLE "Config" DROP COLUMN "exerciseId";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "composer",
ADD COLUMN     "configId" INTEGER NOT NULL,
ALTER COLUMN "playlistId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TimeSignature" ADD COLUMN     "configId" INTEGER;

-- CreateTable
CREATE TABLE "ExerciseSavesUserConfig" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "configId" INTEGER NOT NULL,

    CONSTRAINT "ExerciseSavesUserConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseSavesUserConfig_configId_key" ON "ExerciseSavesUserConfig"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseSavesUserConfig_userId_exerciseId_key" ON "ExerciseSavesUserConfig"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_configId_key" ON "Exercise"("configId");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_timeSignatureId_fkey" FOREIGN KEY ("timeSignatureId") REFERENCES "TimeSignature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSavesUserConfig" ADD CONSTRAINT "ExerciseSavesUserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSavesUserConfig" ADD CONSTRAINT "ExerciseSavesUserConfig_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSavesUserConfig" ADD CONSTRAINT "ExerciseSavesUserConfig_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
