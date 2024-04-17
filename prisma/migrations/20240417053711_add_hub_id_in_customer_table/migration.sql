/*
  Warnings:

  - You are about to drop the column `code` on the `customers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hub_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hub_id` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customers_code_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "code",
ADD COLUMN     "hub_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_hub_id_key" ON "customers"("hub_id");
