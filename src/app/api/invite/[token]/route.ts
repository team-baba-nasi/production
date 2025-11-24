import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
    const invite = await prisma.groupInviteToken.findUnique({
        where: { token: params.token },
        include: {
            group: true,
        },
    });

    if (!invite) {
        return NextResponse.json({ error: "Invalid invite link" }, { status: 400 });
    }

    if (invite.expires_at < new Date()) {
        return NextResponse.json({ error: "Invite link expired" }, { status: 400 });
    }

    return NextResponse.json({
        id: invite.group.id,
        name: invite.group.name,
        icon: invite.group.icon_image_url,
        description: invite.group.description,
    });
}
