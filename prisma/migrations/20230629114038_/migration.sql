/*
  Warnings:

  - Added the required column `phoneNumber` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "phoneNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
