/*
  Warnings:

  - Added the required column `pickupLocation` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnLocation` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "pickupLocation" TEXT NOT NULL,
ADD COLUMN     "returnLocation" TEXT NOT NULL;
