/*
  Warnings:

  - You are about to drop the column `file` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "file",
ADD COLUMN     "fileUrl" TEXT;
