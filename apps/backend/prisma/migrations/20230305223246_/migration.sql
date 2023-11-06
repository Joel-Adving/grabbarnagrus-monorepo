/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Summoner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Summoner` MODIFY `revisionDate` BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Summoner_accountId_key` ON `Summoner`(`accountId`);
