/*
  Warnings:

  - You are about to drop the column `bio` on the `Job` table. All the data in the column will be lost.
  - The `status` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSE');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "bio",
DROP COLUMN "status",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'OPEN';
