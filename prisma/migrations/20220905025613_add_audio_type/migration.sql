/*
  Warnings:

  - You are about to drop the column `blob` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Message` DROP COLUMN `blob`,
    ADD COLUMN `audio` LONGBLOB NULL;
