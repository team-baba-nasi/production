/*
  Warnings:

  - You are about to drop the column `userId` on the `PushSubscription` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `PushSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PushSubscription_userId_idx";

-- AlterTable
ALTER TABLE "PushSubscription" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "PushSubscription_user_id_idx" ON "PushSubscription"("user_id");

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
