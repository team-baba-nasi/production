import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const groupId = parseInt(params.id, 10);
        if (isNaN(groupId)) {
            return NextResponse.json({ error: "不正なグループIDです" }, { status: 400 });
        }
        const members = await prisma.groupMember.findMany({
            where: { group_id: groupId },
            select: {
                role: true,
                user: {
                    select: {
                        username: true,
                        profile_image_url: true,
                    },
                },
            },
        });

        const groupMembers = members.map((m) => ({
            role: m.role,
            username: m.user.username,
            profile_image_url: m.user.profile_image_url,
        }));

        return NextResponse.json({ groupMembers }, { status: 200 });
    } catch (error) {
        console.error("メンバー取得エラー:", error);
        return NextResponse.json(
            { error: "グループ取得中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
