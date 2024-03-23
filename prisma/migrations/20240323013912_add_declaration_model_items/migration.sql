/*
  Warnings:

  - You are about to drop the column `hubId` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `package_shipping_addresses` on the `packages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hub_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hub_id` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `package_shipping_addresses_id` to the `packages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_package_shipping_addresses_fkey";

-- DropIndex
DROP INDEX "customers_hubId_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "hubId",
ADD COLUMN     "hub_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "package_shipping_addresses",
ADD COLUMN     "package_shipping_addresses_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "declaration_models" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "declaration_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declaraction_model_items" (
    "id" TEXT NOT NULL,
    "declaration_model_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "declaraction_model_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_hub_id_key" ON "customers"("hub_id");

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_package_shipping_addresses_id_fkey" FOREIGN KEY ("package_shipping_addresses_id") REFERENCES "package_shipping_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declaration_models" ADD CONSTRAINT "declaration_models_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declaraction_model_items" ADD CONSTRAINT "declaraction_model_items_declaration_model_id_fkey" FOREIGN KEY ("declaration_model_id") REFERENCES "declaration_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
