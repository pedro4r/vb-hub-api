-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "packageId" TEXT;

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "has_battery" BOOLEAN NOT NULL,
    "tracking_number" TEXT NOT NULL,
    "is_shipped" BOOLEAN NOT NULL,
    "parcel_forwarding_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_parcel_forwarding_id_fkey" FOREIGN KEY ("parcel_forwarding_id") REFERENCES "parcel_forwarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
