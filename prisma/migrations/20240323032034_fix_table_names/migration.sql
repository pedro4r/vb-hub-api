/*
  Warnings:

  - You are about to drop the `custom_declaraction_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `declaraction_model_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "custom_declaraction_items" DROP CONSTRAINT "custom_declaraction_items_package_id_fkey";

-- DropForeignKey
ALTER TABLE "declaraction_model_items" DROP CONSTRAINT "declaraction_model_items_declaration_model_id_fkey";

-- DropTable
DROP TABLE "custom_declaraction_items";

-- DropTable
DROP TABLE "declaraction_model_items";

-- CreateTable
CREATE TABLE "declaration_model_items" (
    "id" TEXT NOT NULL,
    "declaration_model_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "declaration_model_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_declaration_items" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "package_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "custom_declaration_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "declaration_model_items" ADD CONSTRAINT "declaration_model_items_declaration_model_id_fkey" FOREIGN KEY ("declaration_model_id") REFERENCES "declaration_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_declaration_items" ADD CONSTRAINT "custom_declaration_items_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
