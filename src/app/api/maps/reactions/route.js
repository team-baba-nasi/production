import { NextResponse } from "next/server";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.pin_id) {
            return NextResponse.json({ error: "pin_id が必要です" }, { status: 400 });
        }

        // 認証チェック
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        // 既にgoing済みのリアクションがある場合はスキップ or 上書き（要件に応じて）
        const existing = await prisma.pinReaction.findFirst({
            where: {
                pin_id: body.pin_id,
                user_id: user.id,
                reaction_type: "going",
            },
        });

        if (existing) {
            return NextResponse.json(
                { reaction: existing, message: "既にリアクション済みです" },
                { status: 200 }
            );
        }

        const newReaction = await prisma.pinReaction.create({
            data: {
                pin_id: body.pin_id,
                user_id: user.id,
                reaction_type: "going",
            },
            select: {
                id: true,
                pin_id: true,
                user_id: true,
                reaction_type: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        return NextResponse.json({ reaction: newReaction }, { status: 201 });
    } catch (error) {
        console.error("Pin Reaction 作成エラー:", error);

        return NextResponse.json(
            { error: "Pin Reaction 作成中にエラーが発生しました" },
            { status: 500 }
        );
    }
}
