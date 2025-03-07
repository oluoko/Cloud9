/*
  Warnings:

  - You are about to drop the column `destinationCity` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `destinationAirport` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "destinationCity",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "destinationAirport" TEXT NOT NULL;
