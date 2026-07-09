/*
  Warnings:

  - You are about to drop the column `transmission` on the `Car` table. All the data in the column will be lost.
  - Added the required column `gearbox` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Made the column `body` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "transmission",
ADD COLUMN     "gearbox" TEXT NOT NULL,
ALTER COLUMN "body" SET NOT NULL;
