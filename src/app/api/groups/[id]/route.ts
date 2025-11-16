import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
        });

        if (!group) {
            return NextResponse.json({ error: "グループが見つかりません" }, { status: 404 });
        }

        // オーナーのみアーカイブ可能
        if (group.owner_id !== user.id) {
            return NextResponse.json(
                { error: "このグループを削除する権限がありません" },
                { status: 403 }
            );
        }

        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: { status: "archived" },
            select: {
                id: true,
                name: true,
                status: true,
                updated_at: true,
            },
        });

        return NextResponse.json(
            { message: "グループをアーカイブしました", group: updatedGroup },
            { status: 200 }
        );
    } catch (error) {
        console.error("グループ削除エラー:", error);
        return NextResponse.json(
            { error: "グループ削除中にエラーが発生しました" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const groupId = parseInt(params.id, 10);
        if (isNaN(groupId)) {
            return NextResponse.json({ error: "不正なグループIDです" }, { status: 400 });
        }

        const body = await request.json();
        const { name, description, icon_image_url } = body;

        const group = await prisma.group.findUnique({
            where: { id: groupId },
        });

        if (!group) {
            return NextResponse.json({ error: "グループが見つかりません" }, { status: 404 });
        }

        // オーナーのみ更新可能
        if (group.owner_id !== user.id) {
            return NextResponse.json(
                { error: "このグループを更新する権限がありません" },
                { status: 403 }
            );
        }

        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: {
                name: name ?? group.name,
                description: description ?? group.description,
                icon_image_url: icon_image_url ?? group.icon_image_url,
            },
            select: {
                id: true,
                name: true,
                description: true,
                icon_image_url: true,
                updated_at: true,
            },
        });

        return NextResponse.json(
            { message: "グループ情報を更新しました", group: updatedGroup },
            { status: 200 }
        );
    } catch (error) {
        console.error("グループ更新エラー:", error);
        return NextResponse.json(
            { error: "グループ更新中にエラーが発生しました" },
            { status: 500 }
        );
    }
}

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
                description: true,
                icon_image_url: true,
                owner_id: true,
                members: {
                    select: {
                        user_id: true,
                        role: true,
                        user: {
                            select: {
                                profile_image_url: true,
                            },
                        },
                    },
                    orderBy: {
                        joined_at: "asc",
                    },
                },
            },
        });
        if (!group) {
            return NextResponse.json({ error: "グループが見つかりません" }, { status: 404 });
        }
        const myMembership = group.members.find((member) => member.user_id === user.id);
        const myRole = myMembership?.role || null;

        return NextResponse.json(
            {
                group,
                myRole,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("グループ取得エラー:", error);
        return NextResponse.json(
            { error: "グループ取得中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
