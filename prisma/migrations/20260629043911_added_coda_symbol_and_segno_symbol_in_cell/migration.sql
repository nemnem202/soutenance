/*
  Warnings:

  - Added the required column `isCodaSymbol` to the `Cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSegnoSymbol` to the `Cell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cell" ADD COLUMN     "isCodaSymbol" BOOLEAN NOT NULL,
ADD COLUMN     "isSegnoSymbol" BOOLEAN NOT NULL;
