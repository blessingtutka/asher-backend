/*
  Warnings:

  - You are about to drop the column `posterType` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Employer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Employer" ALTER COLUMN "profile" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "activity" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "telephone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "posterType",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "localisation" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "salary" DROP NOT NULL,
ALTER COLUMN "jobType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Worker" ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "cvFile" DROP NOT NULL,
ALTER COLUMN "activity" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "telephone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkerExperience" ALTER COLUMN "description" DROP NOT NULL;

-- DropEnum
DROP TYPE "PosterType";

-- CreateIndex
CREATE UNIQUE INDEX "Employer_userId_key" ON "Employer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_userId_key" ON "Worker"("userId");
