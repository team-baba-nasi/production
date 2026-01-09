import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

type Params = {
    params: {
        id: string;
    };
};

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const pinId = Number(params.id);
        if (Number.isNaN(pinId)) {
            return NextResponse.json({ error: "不正なIDです" }, { status: 400 });
        }

        const pin = await prisma.favoritePlace.findFirst({
            where: {
                id: pinId,
                user_id: user.id,
                is_active: true,
            },
            select: { id: true },
        });

        if (!pin) {
            return NextResponse.json({ error: "対象の Pin が見つかりません" }, { status: 404 });
        }

        await prisma.favoritePlace.update({
            where: { id: pinId },
            data: { is_active: false },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Pin 削除エラー:", error);
        return NextResponse.json({ error: "Pin 削除中にエラーが発生しました" }, { status: 500 });
    }
}
