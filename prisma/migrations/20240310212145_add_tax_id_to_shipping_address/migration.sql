/*
  Warnings:

  - Added the required column `tax_id` to the `shipping_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shipping_addresses" ADD COLUMN     "tax_id" TEXT NOT NULL;
