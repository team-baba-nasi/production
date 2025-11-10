import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

// 入力バリデーションスキーマ
const createGroupSchema = z.object({
    name: z
        .string()
        .min(2, "グループ名は2文字以上である必要があります")
        .max(30, "グループ名は30文字以下である必要があります")
        .regex(
            /^[a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/,
            "グループ名は英数字、アンダースコア、日本語のみ使用できます"
        ),
    description: z.string().optional(),
    is_private: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validation = createGroupSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "バリデーションエラー",
                    details: validation.error.issues.map((issue) => ({
                        field: issue.path[0],
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { name, description, is_private = false } = validation.data;

        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        // --- 新しいグループ作成 ---
        const newGroup = await prisma.group.create({
            data: {
                name,
                description,
                is_private,
                owner_id: user.id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                is_private: true,
                created_at: true,
                owner: {
                    select: { id: true, username: true },
                },
            },
        });

        // --- オーナーをGroupMemberとして登録 ---
        await prisma.groupMember.create({
            data: {
                group_id: newGroup.id,
                user_id: user.id,
                role: "owner",
            },
        });

        return NextResponse.json({ group: newGroup }, { status: 201 });
    } catch (error) {
        console.error("グループ作成エラー:", error);
        return NextResponse.json(
            { error: "グループ作成中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
