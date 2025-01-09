/*
  Warnings:

  - Added the required column `last4` to the `PaymentOptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentOptions" ADD COLUMN     "last4" TEXT NOT NULL,
ALTER COLUMN "cvv" DROP NOT NULL;
