/*
  Warnings:

  - You are about to drop the column `localisation` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "localisation",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "location" TEXT;
