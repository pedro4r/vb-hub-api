-- AlterTable
ALTER TABLE "package_shipping_addresses" ADD COLUMN     "email" TEXT,
ADD COLUMN     "tax_id" TEXT,
ALTER COLUMN "phone_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shipping_addresses" ADD COLUMN     "email" TEXT,
ADD COLUMN     "tax_id" TEXT;
