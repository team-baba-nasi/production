import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function POST(request, context) {
    try {
        const { id } = await context.params;
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const groupId = Number(id);

        if (isNaN(groupId)) {
            return NextResponse.json({ error: "無効なグループIDです" }, { status: 400 });
        }

        // トークン生成（適当なUUID）
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7日間有効

        const invite = await prisma.groupInviteToken.create({
            data: {
                token,
                group_id: groupId,
                expires_at: expiresAt,
            },
            select: {
                token: true,
                expires_at: true,
            },
        });

        const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}`;

        return NextResponse.json(
            {
                inviteUrl,
                token: invite.token,
                expires_at: invite.expires_at,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("招待作成エラー:", error);
        return NextResponse.json({ error: "招待作成中にエラーが発生しました" }, { status: 500 });
    }
}
