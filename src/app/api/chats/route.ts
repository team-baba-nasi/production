import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const chatGroups = await prisma.chatParticipant.findMany({
            where: {
                user_id: user.id,
                chat_room: {
                    room_type: "group",
                },
            },
            select: {
                chat_room: {
                    select: {
                        id: true,
                        uuid: true,
                        room_type: true,
                        created_at: true,
                        updated_at: true,
                        participants: {
                            select: {
                                id: true,
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        profile_image_url: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            orderBy: {
                                created_at: "desc",
                            },
                            take: 1,
                            select: {
                                id: true,
                                content: true,
                                created_at: true,
                                sender: {
                                    select: {
                                        id: true,
                                        username: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                chat_room: {
                    updated_at: "desc",
                },
            },
        });

        return NextResponse.json({ chatGroups }, { status: 200 });
    } catch (error) {
        console.error("チャットグループ一覧取得エラー:", error);
        return NextResponse.json(
            { error: "チャットグループ一覧取得中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
