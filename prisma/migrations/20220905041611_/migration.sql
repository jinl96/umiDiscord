/*
  Warnings:

  - You are about to alter the column `audio` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Message` MODIFY `audio` VARCHAR(191) NULL;
