import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const groupId = parseInt(params.id, 10);
        if (isNaN(groupId)) {
            return NextResponse.json({ error: "不正なグループIDです" }, { status: 400 });
        }
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            select: {
                name: true,
                icon_image_url: true,
            },
        });

        if (!group) {
            return NextResponse.json({ error: "不正なグループIDです" }, { status: 400 });
        }

        const members = await prisma.groupMember.findMany({
            where: { group_id: groupId },
            select: {
                role: true,
                user: {
                    select: {
                        id: true,
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

        const myMembership = members.find((m) => m.user.username === user.username);
        const myRole = myMembership?.role ?? null;

        return NextResponse.json(
            {
                group_name: group.name,
                group_icon: group.icon_image_url,
                members: groupMembers,
                myRole,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("メンバー取得エラー:", error);
        return NextResponse.json(
            { error: "グループ取得中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
