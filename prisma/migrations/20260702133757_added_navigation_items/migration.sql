-- CreateEnum
CREATE TYPE "JumpOrigin" AS ENUM ('DC', 'DS');

-- CreateEnum
CREATE TYPE "JumpTarget" AS ENUM ('Fine', 'Coda', 'FirstEnding', 'SecondEnding', 'ThirdEnding');

-- CreateEnum
CREATE TYPE "RhythmGrouping" AS ENUM ('3+2', '2+3', '4+3', '3+4');

-- AlterTable
ALTER TABLE "Cell" ADD COLUMN     "isBreakSymbol" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFineSymbol" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "navigationOrigin" "JumpOrigin",
ADD COLUMN     "navigationTarget" "JumpTarget",
ADD COLUMN     "rhythmGrouping" "RhythmGrouping";

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "repeatCount" INTEGER;
