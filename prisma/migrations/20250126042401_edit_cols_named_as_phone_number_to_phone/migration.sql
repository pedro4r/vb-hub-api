/*
  Warnings:

  - You are about to drop the column `phone_number` on the `package_shipping_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `shipping_addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "package_shipping_addresses" DROP COLUMN "phone_number",
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "shipping_addresses" DROP COLUMN "phone_number",
ADD COLUMN     "phone" TEXT;
