/*
  Warnings:

  - You are about to drop the column `price` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seatNumber` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `paymentReference` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "price",
DROP COLUMN "seatNumber",
DROP COLUMN "status",
ADD COLUMN     "bookingStatus" TEXT NOT NULL DEFAULT 'confirmed',
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "passengerNames" TEXT[],
ADD COLUMN     "paymentReference" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "seatCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "specialRequests" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
