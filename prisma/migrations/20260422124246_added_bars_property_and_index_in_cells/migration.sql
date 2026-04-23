/*
  Warnings:

  - Added the required column `barsId` to the `Cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `Cell` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeftBarKind" AS ENUM ('single', 'repeatOpen', 'sectionOpen');

-- CreateEnum
CREATE TYPE "RightBarKind" AS ENUM ('single', 'repeatClose', 'sectionClose', 'final');

-- AlterTable
ALTER TABLE "Cell" ADD COLUMN     "barsId" INTEGER NOT NULL,
ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Bar" (
    "id" SERIAL NOT NULL,
    "left" "LeftBarKind",
    "right" "RightBarKind",

    CONSTRAINT "Bar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_barsId_fkey" FOREIGN KEY ("barsId") REFERENCES "Bar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
