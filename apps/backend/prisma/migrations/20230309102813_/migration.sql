-- DropForeignKey
ALTER TABLE `RankedStats` DROP FOREIGN KEY `RankedStats_summonerId_fkey`;

-- AlterTable
ALTER TABLE `LastUpdated` MODIFY `summonerId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `RankedStats` MODIFY `summonerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `RankedStats` ADD CONSTRAINT `RankedStats_summonerId_fkey` FOREIGN KEY (`summonerId`) REFERENCES `Summoner`(`summonerId`) ON DELETE RESTRICT ON UPDATE CASCADE;
