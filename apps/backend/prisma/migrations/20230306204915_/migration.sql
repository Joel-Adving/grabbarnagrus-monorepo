/*
  Warnings:

  - You are about to drop the column `summonerId` on the `Match` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_summonerId_fkey`;

-- AlterTable
ALTER TABLE `Match` DROP COLUMN `summonerId`;

-- CreateTable
CREATE TABLE `_MatchToSummoner` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MatchToSummoner_AB_unique`(`A`, `B`),
    INDEX `_MatchToSummoner_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MatchToSummoner` ADD CONSTRAINT `_MatchToSummoner_A_fkey` FOREIGN KEY (`A`) REFERENCES `Match`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MatchToSummoner` ADD CONSTRAINT `_MatchToSummoner_B_fkey` FOREIGN KEY (`B`) REFERENCES `Summoner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
