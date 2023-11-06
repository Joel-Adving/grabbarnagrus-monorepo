/*
  Warnings:

  - Changed the type of `date` on the `Match` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `revisionDate` on the `Summoner` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `Match` DROP COLUMN `date`,
    ADD COLUMN `date` TIME NOT NULL;

-- AlterTable
ALTER TABLE `Summoner` DROP COLUMN `revisionDate`,
    ADD COLUMN `revisionDate` TIME NOT NULL;
