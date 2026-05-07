/*
  Warnings:

  - The primary key for the `ExerciseSavesUserConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ExerciseSavesUserConfig` table. All the data in the column will be lost.
  - You are about to alter the column `alt` on the `Image` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `exerciseId` on the `Midifile` table. All the data in the column will be lost.
  - You are about to alter the column `url` on the `Midifile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `volta` on the `VoltaBracket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Midifile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[configId]` on the table `Midifile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `PlaylistTag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `configId` to the `Midifile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `VoltaBracket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Midifile" DROP CONSTRAINT "Midifile_exerciseId_fkey";

-- DropIndex
DROP INDEX "ExerciseSavesUserConfig_configId_key";

-- DropIndex
DROP INDEX "ExerciseSavesUserConfig_userId_exerciseId_key";

-- DropIndex
DROP INDEX "Midifile_exerciseId_key";

-- AlterTable
ALTER TABLE "ExerciseSavesUserConfig" DROP CONSTRAINT "ExerciseSavesUserConfig_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ExerciseSavesUserConfig_pkey" PRIMARY KEY ("configId");

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "alt" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Midifile" DROP COLUMN "exerciseId",
ADD COLUMN     "configId" INTEGER NOT NULL,
ALTER COLUMN "url" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "UserLikesUser" ADD COLUMN     "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VoltaBracket" DROP COLUMN "volta",
ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Midifile_url_key" ON "Midifile"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Midifile_configId_key" ON "Midifile"("configId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistTag_label_key" ON "PlaylistTag"("label");

-- AddForeignKey
ALTER TABLE "Midifile" ADD CONSTRAINT "Midifile_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
