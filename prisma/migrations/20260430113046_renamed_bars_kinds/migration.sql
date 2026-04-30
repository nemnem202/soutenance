/*
  Warnings:

  - The values [repeatOpen,sectionOpen] on the enum `LeftBarKind` will be removed. If these variants are still used in the database, this will fail.
  - The values [repeatClose,sectionClose] on the enum `RightBarKind` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeftBarKind_new" AS ENUM ('single', 'double', 'loopOpen');
ALTER TABLE "Bar" ALTER COLUMN "left" TYPE "LeftBarKind_new" USING ("left"::text::"LeftBarKind_new");
ALTER TYPE "LeftBarKind" RENAME TO "LeftBarKind_old";
ALTER TYPE "LeftBarKind_new" RENAME TO "LeftBarKind";
DROP TYPE "public"."LeftBarKind_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RightBarKind_new" AS ENUM ('single', 'double', 'loopClose', 'final');
ALTER TABLE "Bar" ALTER COLUMN "right" TYPE "RightBarKind_new" USING ("right"::text::"RightBarKind_new");
ALTER TYPE "RightBarKind" RENAME TO "RightBarKind_old";
ALTER TYPE "RightBarKind_new" RENAME TO "RightBarKind";
DROP TYPE "public"."RightBarKind_old";
COMMIT;
