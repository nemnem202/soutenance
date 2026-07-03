/*
  Warnings:

  - The `navigationOrigin` column on the `Cell` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "navigationOrigin",
ADD COLUMN     "navigationOrigin" TEXT;
