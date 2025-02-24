/*
  Warnings:

  - You are about to drop the column `flightPrice` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfPassengers` on the `Flight` table. All the data in the column will be lost.
  - Added the required column `businessPrice` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessSeats` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `economyPrice` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `economySeats` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstClassPrice` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstClassSeats` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "flightPrice",
DROP COLUMN "numberOfPassengers",
ADD COLUMN     "businessPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "businessSeats" INTEGER NOT NULL,
ADD COLUMN     "economyPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "economySeats" INTEGER NOT NULL,
ADD COLUMN     "firstClassPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "firstClassSeats" INTEGER NOT NULL;
