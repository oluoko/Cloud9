/*
  Warnings:

  - You are about to drop the column `arrival` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `departure` on the `Flight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "arrival",
DROP COLUMN "departure";
