import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function GET(request: NextRequest, context: { params: Promise<{ uuid: string }> }) {
    try {
        const { uuid } = await context.params;

        if (!uuid) {
            return NextResponse.json({ error: "uuid が指定されていません" }, { status: 400 });
        }

        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const chatRoom = await prisma.chatRoom.findUnique({
            where: {
                uuid,
            },
            select: {
                id: true,
                uuid: true,
                room_type: true,
                participants: {
                    where: {
                        user_id: user.id,
                    },
                    select: {
                        id: true,
                    },
                },
                messages: {
                    orderBy: {
                        created_at: "asc",
                    },
                    select: {
                        id: true,
                        content: true,
                        created_at: true,
                        message_type: true,
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                profile_image_url: true,
                            },
                        },
                    },
                },
            },
        });

        if (!chatRoom) {
            return NextResponse.json({ error: "チャットルームが存在しません" }, { status: 404 });
        }

        if (chatRoom.participants.length === 0) {
            return NextResponse.json(
                { error: "このチャットルームへのアクセス権限がありません" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                chatRoom: {
                    uuid: chatRoom.uuid,
                    room_type: chatRoom.room_type,
                    messages: chatRoom.messages,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("チャット取得エラー:", error);
        return NextResponse.json(
            { error: "チャット取得中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
