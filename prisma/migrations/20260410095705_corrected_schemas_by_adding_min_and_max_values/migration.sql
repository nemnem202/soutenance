/*
  Warnings:

  - You are about to drop the column `tsChangeId` on the `Cell` table. All the data in the column will be lost.
  - You are about to alter the column `keychange` on the `Cell` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `modifiers` on the `Chord` table. All the data in the column will be lost.
  - You are about to alter the column `note` on the `Chord` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.
  - You are about to alter the column `password` on the `ClassicAuthMethod` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to drop the column `timeSignatureId` on the `Config` table. All the data in the column will be lost.
  - You are about to alter the column `key` on the `Config` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `groove` on the `Config` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `title` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `exerciseId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `Playlist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `Playlist` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `label` on the `Section` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to drop the `TimeSignature` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `modifier` to the `Chord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSignatureBottom` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSignatureTop` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `composer` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('public', 'private');

-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_tsChangeId_fkey";

-- DropForeignKey
ALTER TABLE "Config" DROP CONSTRAINT "Config_timeSignatureId_fkey";

-- DropIndex
DROP INDEX "Cell_tsChangeId_key";

-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "tsChangeId",
ADD COLUMN     "timeSignatureChangeBottom" INTEGER,
ADD COLUMN     "timeSignatureChangeTop" INTEGER,
ALTER COLUMN "keychange" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Chord" DROP COLUMN "modifiers",
ADD COLUMN     "modifier" VARCHAR(20) NOT NULL,
ALTER COLUMN "note" SET DATA TYPE VARCHAR(3);

-- AlterTable
ALTER TABLE "ClassicAuthMethod" ALTER COLUMN "password" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "Config" DROP COLUMN "timeSignatureId",
ADD COLUMN     "timeSignatureBottom" INTEGER NOT NULL,
ADD COLUMN     "timeSignatureTop" INTEGER NOT NULL,
ALTER COLUMN "key" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "groove" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "composer" VARCHAR(200) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "exerciseId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'private',
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "label" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(20);

-- DropTable
DROP TABLE "TimeSignature";

-- CreateTable
CREATE TABLE "PlaylistTag" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "playlistId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistTag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTag" ADD CONSTRAINT "PlaylistTag_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
