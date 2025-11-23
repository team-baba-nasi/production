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
            id: m.user.id,
            username: m.user.username,
            profile_image_url: m.user.profile_image_url,
        }));

        const myMembership = members.find((m) => m.user.username === user.username);
        const myRole = myMembership?.role ?? null;
        const myName = myMembership?.user.username ?? null;

        return NextResponse.json(
            {
                group_name: group.name,
                group_icon: group.icon_image_url,
                members: groupMembers,
                myRole,
                myName,
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const groupId = parseInt(params.id, 10);

        if (isNaN(groupId)) {
            return NextResponse.json({ error: "不正なグループIDです" }, { status: 400 });
        }

        // 管理者権限チェック -------------------------------------------------------
        const myMembership = await prisma.groupMember.findUnique({
            where: {
                group_id_user_id: {
                    group_id: groupId,
                    user_id: user.id,
                },
            },
        });

        if (!myMembership || myMembership.role !== "admin") {
            return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
        }
        // -------------------------------------------------------------------------

        const body = await request.json();
        const userIds: number[] = body.user_ids;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: "user_ids は空ではいけません" }, { status: 400 });
        }

        await prisma.groupMember.updateMany({
            where: {
                group_id: groupId,
                user_id: { in: userIds },
            },
            data: {
                role: "admin",
            },
        });

        return NextResponse.json(
            { message: "メンバーの権限を admin に更新しました" },
            { status: 200 }
        );
    } catch (error) {
        console.error("ホスト権限付与エラー:", error);
        return NextResponse.json({ error: "権限更新中にエラーが発生しました" }, { status: 500 });
    }
}

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

        // 管理者権限チェック -------------------------------------------------------
        const myMembership = await prisma.groupMember.findUnique({
            where: {
                group_id_user_id: {
                    group_id: groupId,
                    user_id: user.id,
                },
            },
        });

        if (!myMembership || myMembership.role !== "admin") {
            return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
        }
        // -------------------------------------------------------------------------

        const body = await request.json();
        const targetUserId = body.user_id;

        if (!targetUserId || typeof targetUserId !== "number") {
            return NextResponse.json({ error: "user_id が必要です" }, { status: 400 });
        }

        // 自分自身を削除しようとした場合
        if (targetUserId === user.id) {
            return NextResponse.json(
                { error: "自分自身を削除することはできません" },
                { status: 400 }
            );
        }

        // 対象メンバーが存在するか確認
        const member = await prisma.groupMember.findUnique({
            where: {
                group_id_user_id: {
                    group_id: groupId,
                    user_id: targetUserId,
                },
            },
        });

        if (!member) {
            return NextResponse.json({ error: "対象メンバーが存在しません" }, { status: 404 });
        }

        // 削除実行
        await prisma.groupMember.delete({
            where: {
                group_id_user_id: {
                    group_id: groupId,
                    user_id: targetUserId,
                },
            },
        });

        return NextResponse.json({ message: "メンバーを削除しました" }, { status: 200 });
    } catch (error) {
        console.error("メンバー削除エラー:", error);
        return NextResponse.json(
            { error: "メンバー削除中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
