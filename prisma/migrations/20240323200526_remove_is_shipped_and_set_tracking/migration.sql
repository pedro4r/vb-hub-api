/*
  Warnings:

  - You are about to drop the column `is_shipped` on the `packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "packages" DROP COLUMN "is_shipped",
ALTER COLUMN "tracking_number" DROP NOT NULL;
