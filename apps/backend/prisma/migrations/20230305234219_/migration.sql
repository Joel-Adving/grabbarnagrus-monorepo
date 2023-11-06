/*
  Warnings:

  - You are about to alter the column `date` on the `Match` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `Timestamp`.
  - You are about to alter the column `revisionDate` on the `Summoner` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `Match` MODIFY `date` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Summoner` MODIFY `revisionDate` TIMESTAMP NOT NULL;
