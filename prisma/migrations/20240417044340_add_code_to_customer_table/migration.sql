/*
  Warnings:

  - You are about to drop the column `hub_id` on the `customers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customers_hub_id_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "hub_id",
ADD COLUMN     "code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_code_key" ON "customers"("code");
