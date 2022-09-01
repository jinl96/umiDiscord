-- CreateTable
CREATE TABLE `UserSubscription` (
    `userId` INTEGER NOT NULL,
    `serverId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `serverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserSubscription` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserSubscription_AB_unique`(`A`, `B`),
    INDEX `_UserSubscription_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
