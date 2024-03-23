/*
  Warnings:

  - You are about to drop the column `tax_id` on the `shipping_addresses` table. All the data in the column will be lost.
  - Added the required column `package_shipping_addresses` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "package_shipping_addresses" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shipping_addresses" DROP COLUMN "tax_id";

-- CreateTable
CREATE TABLE "package_shipping_addresses" (
    "id" TEXT NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "package_shipping_addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_package_shipping_addresses_fkey" FOREIGN KEY ("package_shipping_addresses") REFERENCES "package_shipping_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
