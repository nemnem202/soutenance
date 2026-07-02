/*
  Warnings:

  - Changed the type of `groove` on the `Config` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MMAGrooveTitle" AS ENUM ('JazzBasie', 'JazzWaltz', 'BossaNova', 'Ballad', 'Metal', 'Shuffle', 'Bebop', '8Beat', '16Beat', '50sRock', 'Mambo', 'Salsa', 'Techno', '04JAZZ01', 'AFRO01', 'FUS01');

-- AlterTable
ALTER TABLE "Config" DROP COLUMN "groove",
ADD COLUMN     "groove" "MMAGrooveTitle" NOT NULL;
