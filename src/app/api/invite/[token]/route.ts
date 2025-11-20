import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const token = params.token;

        const invite = await prisma.groupInviteToken.findUnique({
            where: { token },
            select: {
                id: true,
                token: true,
                group_id: true,
                created_at: true,
                expires_at: true,
                group: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        icon_image_url: true,
                        owner: {
                            select: { id: true, username: true },
                        },
                    },
                },
            },
        });

        if (!invite) {
            return NextResponse.json({ error: "無効な招待リンクです" }, { status: 404 });
        }

        if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
            return NextResponse.json({ error: "この招待リンクは期限切れです" }, { status: 410 });
        }

        // すでにグループに参加しているか確認
        const alreadyMember = await prisma.groupMember.findFirst({
            where: {
                group_id: invite.group_id,
                user_id: user.id,
            },
        });

        return NextResponse.json(
            {
                invite,
                alreadyMember: !!alreadyMember,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("招待リンク検証エラー:", error);
        return NextResponse.json(
            { error: "招待リンク確認中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
