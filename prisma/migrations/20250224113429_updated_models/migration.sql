/*
  Warnings:

  - You are about to drop the column `bannerId` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `flightId` on the `Flight` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_bannerId_fkey";

-- DropIndex
DROP INDEX "Flight_flightId_key";

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "bannerId",
DROP COLUMN "flightId";
