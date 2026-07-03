/*
  Warnings:

  - The `navigationTarget` column on the `Cell` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rhythmGrouping` column on the `Cell` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "navigationTarget",
ADD COLUMN     "navigationTarget" TEXT,
DROP COLUMN "rhythmGrouping",
ADD COLUMN     "rhythmGrouping" TEXT;

-- DropEnum
DROP TYPE "JumpTarget";

-- DropEnum
DROP TYPE "RhythmGrouping";
