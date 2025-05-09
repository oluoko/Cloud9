/*
  Warnings:

  - You are about to drop the column `contactEmail` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `passengerNames` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `specialRequests` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "passengerNames",
DROP COLUMN "specialRequests",
ADD COLUMN     "paymentMethod" TEXT NOT NULL;
