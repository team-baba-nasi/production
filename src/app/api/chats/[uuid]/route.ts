import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

type Params = {
    params: {
        uuid: string;
    };
};

export async function GET(request: NextRequest, { params }: Params) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const chatRoom = await prisma.chatRoom.findUnique({
            where: {
                uuid: params.uuid,
            },
            select: {
                id: true,
                uuid: true,
                room_type: true,
                participants: {
                    where: {
                        user_id: user.id, // 参加者チェック
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

        // ルームが存在しない
        if (!chatRoom) {
            return NextResponse.json({ error: "チャットルームが存在しません" }, { status: 404 });
        }

        // 参加していないルームへのアクセス防止
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
