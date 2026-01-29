import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

const joinScheduleSchema = z.object({
    schedule_id: z.number(),
    response_type: z.enum(["going", "maybe", "not_going"]),
    available_dates: z.array(z.string()).optional(),
    comment: z.string().optional(),
});

type ChatRoomWithParticipants = Prisma.ChatRoomGetPayload<{
    include: { participants: true };
}>;

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const body = await request.json();
        const validation = joinScheduleSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "バリデーションエラー",
                    details: validation.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { schedule_id, response_type, available_dates, comment } = validation.data;

        const schedule = await prisma.schedule.findUnique({
            where: { id: schedule_id },
            include: {
                pin: {
                    include: {
                        pin_groups: {
                            include: {
                                group: {
                                    include: { members: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!schedule) {
            return NextResponse.json({ error: "スケジュールが見つかりません" }, { status: 404 });
        }

        const isGroupMember = schedule.pin.pin_groups.some((pg) =>
            pg.group.members.some((m) => m.user_id === user.id)
        );

        if (!isGroupMember) {
            return NextResponse.json(
                { error: "このスケジュールに参加する権限がありません" },
                { status: 403 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            if (!schedule.start_at || !schedule.end_at) {
                throw new Error("MEETING_DATETIME_NOT_SET");
            }

            if (!schedule.pin.place_name || !schedule.pin.place_address) {
                throw new Error("MEETING_PLACE_NOT_SET");
            }

            const scheduleResponse = await tx.scheduleResponse.upsert({
                where: {
                    schedule_id_user_id: {
                        schedule_id,
                        user_id: user.id,
                    },
                },
                update: {
                    response_type,
                    available_dates,
                    comment,
                    updated_at: new Date(),
                },
                create: {
                    schedule_id,
                    user_id: user.id,
                    response_type,
                    available_dates,
                    comment,
                },
            });

            let chatRoom: ChatRoomWithParticipants | null = null;

            if (response_type === "going" || response_type === "maybe") {
                chatRoom = await tx.chatRoom.findUnique({
                    where: { pin_id: schedule.pin_id },
                    include: { participants: true },
                });

                if (!chatRoom) {
                    chatRoom = await tx.chatRoom.create({
                        data: {
                            pin_id: schedule.pin_id,
                            room_type: "pin",
                            participants: {
                                createMany: {
                                    data: [
                                        {
                                            user_id: schedule.pin.user_id,
                                            is_active: true,
                                        },
                                        {
                                            user_id: user.id,
                                            is_active: true,
                                        },
                                    ],
                                },
                            },
                        },
                        include: { participants: true },
                    });
                }

                // 🔒 ここから下は chatRoom が必ず存在
                const participant = chatRoom.participants.find((p) => p.user_id === user.id);

                if (!participant) {
                    await tx.chatParticipant.create({
                        data: {
                            chat_room_id: chatRoom.id,
                            user_id: user.id,
                            is_active: true,
                        },
                    });
                } else if (!participant.is_active) {
                    await tx.chatParticipant.update({
                        where: { id: participant.id },
                        data: {
                            is_active: true,
                            left_at: null,
                        },
                    });
                }

                await tx.confirmedMeeting.upsert({
                    where: { chat_room_id: chatRoom.id },
                    update: {
                        meeting_date: schedule.start_at,
                        meeting_end: schedule.end_at,
                        status: "confirmed",
                        updated_at: new Date(),
                    },
                    create: {
                        chat_room_id: chatRoom.id,
                        place_name: schedule.pin.place_name,
                        place_address: schedule.pin.place_address,
                        meeting_date: schedule.start_at,
                        meeting_end: schedule.end_at,
                        status: "confirmed",
                    },
                });
            }

            return { scheduleResponse, chatRoom };
        });

        return NextResponse.json(
            {
                message: "スケジュールに参加しました",
                scheduleResponse: result.scheduleResponse,
                chatRoom: result.chatRoom
                    ? {
                          id: result.chatRoom.id,
                          uuid: result.chatRoom.uuid,
                      }
                    : null,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("スケジュール参加エラー:", error);
        return NextResponse.json(
            { error: "スケジュール参加中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
