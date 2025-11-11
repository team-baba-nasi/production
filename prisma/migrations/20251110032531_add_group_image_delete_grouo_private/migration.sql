/*
  Warnings:

  - You are about to drop the column `is_private` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "is_private",
ADD COLUMN     "icon_image_url" TEXT;
