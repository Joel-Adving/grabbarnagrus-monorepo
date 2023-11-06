-- CreateTable
CREATE TABLE `Summoner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `profileIconId` INTEGER NOT NULL,
    `puuid` VARCHAR(191) NOT NULL,
    `revisionDate` INTEGER NOT NULL,
    `summonerLevel` INTEGER NOT NULL,

    UNIQUE INDEX `Summoner_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RankedStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `freshBlood` BOOLEAN NOT NULL,
    `hotStreak` BOOLEAN NOT NULL,
    `inactive` BOOLEAN NOT NULL,
    `leagueId` VARCHAR(191) NOT NULL,
    `leaguePoints` INTEGER NOT NULL,
    `losses` INTEGER NOT NULL,
    `queueType` VARCHAR(191) NOT NULL,
    `rank` VARCHAR(191) NOT NULL,
    `summonerName` VARCHAR(191) NOT NULL,
    `tier` VARCHAR(191) NOT NULL,
    `veteran` BOOLEAN NOT NULL,
    `wins` INTEGER NOT NULL,
    `summonerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `info` JSON NOT NULL,
    `metaData` JSON NOT NULL,
    `summonerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RankedStats` ADD CONSTRAINT `RankedStats_summonerId_fkey` FOREIGN KEY (`summonerId`) REFERENCES `Summoner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_summonerId_fkey` FOREIGN KEY (`summonerId`) REFERENCES `Summoner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
