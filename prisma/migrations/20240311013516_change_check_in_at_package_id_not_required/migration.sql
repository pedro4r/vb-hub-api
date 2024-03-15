-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_package_id_fkey";

-- AlterTable
ALTER TABLE "check_ins" ALTER COLUMN "package_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
