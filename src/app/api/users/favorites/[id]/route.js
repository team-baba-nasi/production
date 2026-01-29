import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

export async function DELETE(request, context) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const { id } = await context.params;
        const pinId = Number(id);

        if (!Number.isInteger(pinId)) {
            return NextResponse.json({ error: "不正なIDです" }, { status: 400 });
        }

        const favoritePin = await prisma.favoritePlace.findFirst({
            where: {
                id: pinId,
                user_id: user.id,
                is_active: true,
            },
            select: {
                id: true,
            },
        });

        if (!favoritePin) {
            return NextResponse.json({ error: "対象の Pin が見つかりません" }, { status: 404 });
        }

        await prisma.favoritePlace.update({
            where: {
                id: pinId,
            },
            data: {
                is_active: false,
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Favorite Pin 削除エラー:", error);
        return NextResponse.json({ error: "Pin 削除中にエラーが発生しました" }, { status: 500 });
    }
}
