import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const invite = await prisma.groupInviteToken.findUnique({
        where: { token: params.token },
    });

    if (!invite) {
        return NextResponse.json({ error: "Invalid invite link" }, { status: 400 });
    }

    if (invite.expires_at < new Date()) {
        return NextResponse.json({ error: "Invite link expired" }, { status: 400 });
    }

    // すでにメンバーか確認
    const exists = await prisma.groupMember.findUnique({
        where: {
            group_id_user_id: {
                group_id: invite.group_id,
                user_id: user.id,
            },
        },
    });

    if (!exists) {
        await prisma.groupMember.create({
            data: {
                group_id: invite.group_id,
                user_id: user.id,
            },
        });
    }

    return NextResponse.json({
        message: "Joined",
        groupId: invite.group_id,
    });
}
