/*
  Warnings:

  - You are about to drop the column `check_in_id` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_check_in_id_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "check_in_id";
