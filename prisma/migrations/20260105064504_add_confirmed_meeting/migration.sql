-- CreateTable
CREATE TABLE "ConfirmedMeeting" (
    "id" SERIAL NOT NULL,
    "chat_room_id" INTEGER NOT NULL,
    "place_name" TEXT NOT NULL,
    "place_address" TEXT NOT NULL,
    "meeting_date" TIMESTAMP(3) NOT NULL,
    "meeting_end" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfirmedMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmedMeeting_chat_room_id_key" ON "ConfirmedMeeting"("chat_room_id");

-- CreateIndex
CREATE INDEX "ConfirmedMeeting_chat_room_id_idx" ON "ConfirmedMeeting"("chat_room_id");

-- CreateIndex
CREATE INDEX "ConfirmedMeeting_meeting_date_idx" ON "ConfirmedMeeting"("meeting_date");

-- AddForeignKey
ALTER TABLE "ConfirmedMeeting" ADD CONSTRAINT "ConfirmedMeeting_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
