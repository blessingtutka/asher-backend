/*
  Warnings:

  - The `type` column on the `Employer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EmpType" AS ENUM ('PERSON', 'ORGANISATION');

-- AlterTable
ALTER TABLE "Employer" DROP COLUMN "type",
ADD COLUMN     "type" "EmpType";
