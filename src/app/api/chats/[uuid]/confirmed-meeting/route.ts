import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function GET(request: NextRequest, context: { params: { uuid: string } }) {
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
            where: { uuid },
            select: {
                id: true,
                participants: {
                    where: {
                        user_id: user.id,
                        is_active: true,
                    },
                    select: { id: true },
                },
                confirmed_meeting: {
                    select: {
                        id: true,
                        place_name: true,
                        place_address: true,
                        meeting_date: true,
                        meeting_end: true,
                        status: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            },
        });

        if (!chatRoom) {
            return NextResponse.json({ error: "チャットルームが見つかりません" }, { status: 404 });
        }

        if (chatRoom.participants.length === 0) {
            return NextResponse.json(
                { error: "このチャットルームへのアクセス権限がありません" },
                { status: 403 }
            );
        }

        if (chatRoom.confirmed_meeting === null) {
            return NextResponse.json(
                { error: "確定したスケジュールが見つかりません" },
                { status: 404 }
            );
        }

        return NextResponse.json({ confirmedMeeting: chatRoom.confirmed_meeting }, { status: 200 });
    } catch (error) {
        console.error("確定スケジュール取得エラー:", error);
        return NextResponse.json(
            { error: "確定スケジュール取得中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
