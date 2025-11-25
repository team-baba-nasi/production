import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

const createPinSchema = z.object({
    group_id: z.number().optional(),
    place_id: z.string().optional(),
    place_name: z
        .string()
        .min(1, "場所名は必須です")
        .max(100, "場所名は100文字以下である必要があります"),
    place_address: z.string().optional(),
    latitude: z.number().min(-90, "緯度が不正です").max(90, "緯度が不正です").optional(),
    longitude: z.number().min(-180, "経度が不正です").max(180, "経度が不正です").optional(),
    comment: z.string().optional(),
    status: z.enum(["open", "scheduled", "closed", "cancelled"]).optional(),
});

export async function GET(request: NextRequest) {
    try {
        // 認証チェック
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        // 自分のピンと所属グループのピンを取得
        const pins = await prisma.pin.findMany({
            where: {
                OR: [
                    {
                        // 自分のuser_idと同じでgroup_idがないピン
                        user_id: user.id,
                        group_id: null,
                    },
                    {
                        // 自分の所属しているグループのピン
                        group: {
                            members: {
                                some: {
                                    user_id: user.id,
                                },
                            },
                        },
                    },
                ],
            },
            select: {
                id: true,
                place_id: true,
                place_name: true,
                place_address: true,
                latitude: true,
                longitude: true,
                comment: true,
                status: true,
                created_at: true,
                updated_at: true,
                user: {
                    select: { id: true, username: true },
                },
                group: {
                    select: { id: true, name: true },
                },
                reactions: {
                    select: {
                        id: true,
                        reaction_type: true,
                        user: {
                            select: { id: true, username: true },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        return NextResponse.json({ pins }, { status: 200 });
    } catch (error) {
        console.error("Pin 取得エラー:", error);
        return NextResponse.json({ error: "Pin 取得中にエラーが発生しました" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // バリデーション
        const validation = createPinSchema.safeParse(body);
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

        const data = validation.data;

        // 認証チェック
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        // Pin 作成
        const newPin = await prisma.pin.create({
            data: {
                user_id: user.id,
                group_id: data.group_id ?? null,
                place_id: data.place_id,
                place_name: data.place_name,
                place_address: data.place_address,
                latitude: data.latitude,
                longitude: data.longitude,
                comment: data.comment,
                status: data.status ?? "open",
            },
            select: {
                id: true,
                place_name: true,
                place_address: true,
                latitude: true,
                longitude: true,
                comment: true,
                status: true,
                created_at: true,
                updated_at: true,
                user: {
                    select: { id: true, username: true },
                },
                group: {
                    select: { id: true, name: true },
                },
            },
        });

        return NextResponse.json({ pin: newPin }, { status: 201 });
    } catch (error) {
        console.error("Pin 作成エラー:", error);
        return NextResponse.json({ error: "Pin 作成中にエラーが発生しました" }, { status: 500 });
    }
}
