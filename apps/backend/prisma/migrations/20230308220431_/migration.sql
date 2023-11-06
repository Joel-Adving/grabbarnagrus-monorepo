/*
  Warnings:

  - A unique constraint covering the columns `[summonerId]` on the table `Summoner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `summonerId` to the `Summoner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Summoner` ADD COLUMN `summonerId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Summoner_summonerId_key` ON `Summoner`(`summonerId`);
