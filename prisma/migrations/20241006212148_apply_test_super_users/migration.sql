/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "super_users" (
    "id" TEXT NOT NULL,

    CONSTRAINT "super_users_pkey" PRIMARY KEY ("id")
);
