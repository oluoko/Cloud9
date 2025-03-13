/*
  Warnings:

  - Made the column `flightTime` on table `Flight` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "flightTime" SET NOT NULL;
