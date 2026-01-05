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
                    room_type: "pin",
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

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const body = await request.json();
        const { chatRoomUuid, content, messageType = "text", metadata } = body;

        // バリデーション
        if (!chatRoomUuid) {
            return NextResponse.json({ error: "チャットルームIDは必須です" }, { status: 400 });
        }

        if (!content || content.trim() === "") {
            return NextResponse.json({ error: "メッセージ内容は必須です" }, { status: 400 });
        }

        // チャットルームの存在確認とユーザーの参加確認
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { uuid: chatRoomUuid },
            include: {
                participants: {
                    where: {
                        user_id: user.id,
                        is_active: true,
                    },
                },
            },
        });

        if (!chatRoom) {
            return NextResponse.json({ error: "チャットルームが見つかりません" }, { status: 404 });
        }

        if (chatRoom.participants.length === 0) {
            return NextResponse.json(
                { error: "このチャットルームに参加していません" },
                { status: 403 }
            );
        }

        // メッセージを作成
        const message = await prisma.message.create({
            data: {
                chat_room_id: chatRoom.id,
                sender_id: user.id,
                content: content.trim(),
                message_type: messageType,
                metadata: metadata || null,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        profile_image_url: true,
                    },
                },
            },
        });

        // チャットルームの更新日時を更新
        await prisma.chatRoom.update({
            where: { id: chatRoom.id },
            data: { updated_at: new Date() },
        });

        return NextResponse.json({ message }, { status: 201 });
    } catch (error) {
        console.error("メッセージ送信エラー:", error);
        return NextResponse.json(
            { error: "メッセージ送信中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
