/*
  Warnings:

  - Added the required column `last_name` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "last_name" TEXT NOT NULL;
