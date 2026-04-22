/*
  Warnings:

  - You are about to drop the column `barsId` on the `Cell` table. All the data in the column will be lost.
  - Added the required column `barsId` to the `Measure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_barsId_fkey";

-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "barsId";

-- AlterTable
ALTER TABLE "Measure" ADD COLUMN     "barsId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_barsId_fkey" FOREIGN KEY ("barsId") REFERENCES "Bar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
