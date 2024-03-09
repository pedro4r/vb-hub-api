/*
  Warnings:

  - Added the required column `status` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "status" INTEGER NOT NULL;
