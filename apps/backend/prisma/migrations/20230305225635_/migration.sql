/*
  Warnings:

  - Added the required column `date` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `revisionDate` on the `Summoner` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Match` ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `matchId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Summoner` DROP COLUMN `revisionDate`,
    ADD COLUMN `revisionDate` DATETIME(3) NOT NULL;
