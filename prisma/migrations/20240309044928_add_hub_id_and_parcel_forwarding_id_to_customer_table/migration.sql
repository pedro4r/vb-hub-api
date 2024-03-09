/*
  Warnings:

  - A unique constraint covering the columns `[hubId]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hubId` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcel_forwarding_id` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "hubId" TEXT NOT NULL,
ADD COLUMN     "parcel_forwarding_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_hubId_key" ON "customers"("hubId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_parcel_forwarding_id_fkey" FOREIGN KEY ("parcel_forwarding_id") REFERENCES "parcel_forwarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
