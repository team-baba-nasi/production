import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";
import { prisma } from "@/lib/prisma";

type RouteParams = {
    params: Promise<{ id: string }>;
};

type GroupMemberRow = {
    role: string;
    user: {
        id: number;
        username: string;
        profile_image_url: string | null;
    };
};

type PatchBody = {
    user_ids: number[];
};

type DeleteBody = {
    user_id: number;
};

export async function GET(request: NextRequest, context: RouteParams) {
    try {
        const { id } = await context.params;
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const groupId = Number(id);
        if (Number.isNaN(groupId)) {
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

        const members: GroupMemberRow[] = await prisma.groupMember.findMany({
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

        const myMembership = members.find((m) => m.user.id === user.id);

        return NextResponse.json(
            {
                group_name: group.name,
                group_icon: group.icon_image_url,
                members: groupMembers,
                myRole: myMembership?.role ?? null,
                myName: myMembership?.user.username ?? null,
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

export async function PATCH(request: NextRequest, context: RouteParams) {
    try {
        const { id } = await context.params;
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const groupId = Number(id);
        if (Number.isNaN(groupId)) {
            return NextResponse.json({ error: "不正なグループIDです" }, { status: 400 });
        }

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

        const body: PatchBody = await request.json();

        if (!Array.isArray(body.user_ids) || body.user_ids.length === 0) {
            return NextResponse.json({ error: "user_ids は空ではいけません" }, { status: 400 });
        }

        await prisma.groupMember.updateMany({
            where: {
                group_id: groupId,
                user_id: { in: body.user_ids },
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

export async function DELETE(request: NextRequest, context: RouteParams) {
    try {
        const { id } = await context.params;
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const groupId = Number(id);
        if (Number.isNaN(groupId)) {
            return NextResponse.json({ error: "不正なグループIDです" }, { status: 400 });
        }

        const body: DeleteBody = await request.json();
        const targetUserId = body.user_id;

        if (typeof targetUserId !== "number") {
            return NextResponse.json({ error: "user_id が必要です" }, { status: 400 });
        }

        // 自分が抜ける場合
        if (targetUserId === user.id) {
            const myMembership = await prisma.groupMember.findUnique({
                where: {
                    group_id_user_id: {
                        group_id: groupId,
                        user_id: user.id,
                    },
                },
            });

            if (!myMembership) {
                return NextResponse.json({ error: "メンバーではありません" }, { status: 400 });
            }

            const adminCount = await prisma.groupMember.count({
                where: {
                    group_id: groupId,
                    role: "admin",
                },
            });

            if (myMembership.role === "admin" && adminCount === 1) {
                return NextResponse.json(
                    {
                        error: "最後の管理者は退会できません。他の管理者を追加してください。",
                    },
                    { status: 400 }
                );
            }

            await prisma.groupMember.delete({
                where: {
                    group_id_user_id: {
                        group_id: groupId,
                        user_id: user.id,
                    },
                },
            });

            return NextResponse.json({ message: "グループを退会しました" }, { status: 200 });
        }

        // 管理者チェック
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
