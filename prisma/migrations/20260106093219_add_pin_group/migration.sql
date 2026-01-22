/*
  Warnings:

  - You are about to drop the column `group_id` on the `Pin` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `final_date` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `proposed_date_end` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `proposed_date_start` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `date` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_chat_room_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatParticipant" DROP CONSTRAINT "ChatParticipant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_pin_id_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmedMeeting" DROP CONSTRAINT "ConfirmedMeeting_chat_room_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupInviteToken" DROP CONSTRAINT "GroupInviteToken_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chat_room_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Pin" DROP CONSTRAINT "Pin_group_id_fkey";

-- DropForeignKey
ALTER TABLE "PinReaction" DROP CONSTRAINT "PinReaction_pin_id_fkey";

-- DropForeignKey
ALTER TABLE "PinReaction" DROP CONSTRAINT "PinReaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PushSubscription" DROP CONSTRAINT "PushSubscription_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pin_id_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleResponse" DROP CONSTRAINT "ScheduleResponse_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleResponse" DROP CONSTRAINT "ScheduleResponse_user_id_fkey";

-- DropIndex
DROP INDEX "ConfirmedMeeting_chat_room_id_idx";

-- DropIndex
DROP INDEX "Pin_group_id_created_at_idx";

-- DropIndex
DROP INDEX "Pin_status_idx";

-- DropIndex
DROP INDEX "Pin_user_id_created_at_idx";

-- DropIndex
DROP INDEX "Schedule_organizer_id_idx";

-- DropIndex
DROP INDEX "Schedule_pin_id_idx";

-- AlterTable
ALTER TABLE "Pin" DROP COLUMN "group_id";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "created_at",
DROP COLUMN "description",
DROP COLUMN "final_date",
DROP COLUMN "proposed_date_end",
DROP COLUMN "proposed_date_start",
DROP COLUMN "status",
DROP COLUMN "updated_at",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "end_at" TIMESTAMP(3),
ADD COLUMN     "start_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PinGroup" (
    "id" SERIAL NOT NULL,
    "pin_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "PinGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PinGroup_pin_id_group_id_key" ON "PinGroup"("pin_id", "group_id");

-- AddForeignKey
ALTER TABLE "PinGroup" ADD CONSTRAINT "PinGroup_pin_id_fkey" FOREIGN KEY ("pin_id") REFERENCES "Pin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinGroup" ADD CONSTRAINT "PinGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinReaction" ADD CONSTRAINT "PinReaction_pin_id_fkey" FOREIGN KEY ("pin_id") REFERENCES "Pin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinReaction" ADD CONSTRAINT "PinReaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_pin_id_fkey" FOREIGN KEY ("pin_id") REFERENCES "Pin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleResponse" ADD CONSTRAINT "ScheduleResponse_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleResponse" ADD CONSTRAINT "ScheduleResponse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_pin_id_fkey" FOREIGN KEY ("pin_id") REFERENCES "Pin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmedMeeting" ADD CONSTRAINT "ConfirmedMeeting_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInviteToken" ADD CONSTRAINT "GroupInviteToken_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
