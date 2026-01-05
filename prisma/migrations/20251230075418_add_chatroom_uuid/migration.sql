/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pin_id]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `ChatRoom` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_uuid_key" ON "ChatRoom"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_pin_id_key" ON "ChatRoom"("pin_id");
