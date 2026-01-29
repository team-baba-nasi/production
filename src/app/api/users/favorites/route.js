import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

const createFavoriteSchema = z.object({
    place_id: z.string().optional(),
    place_name: z
        .string()
        .min(1, "場所名は必須です")
        .max(100, "場所名は100文字以下である必要があります"),
    place_address: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export async function POST(request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const body = await request.json();
        const validation = createFavoriteSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "バリデーションエラー",
                    details: validation.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        const pin = await prisma.favoritePlace.create({
            data: {
                user_id: user.id,
                place_id: data.place_id,
                place_name: data.place_name,
                place_address: data.place_address,
                latitude: data.latitude,
                longitude: data.longitude,
            },
            select: {
                id: true,
                place_name: true,
                place_address: true,
                latitude: true,
                longitude: true,
                created_at: true,
                updated_at: true,
            },
        });

        return NextResponse.json({ pin }, { status: 201 });
    } catch (error) {
        console.error("お気に入り追加エラー:", error);
        return NextResponse.json(
            { error: "お気に入り追加中にエラーが発生しました" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const pins = await prisma.favoritePlace.findMany({
            where: {
                user_id: user.id,
                is_active: true,
            },
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                place_id: true,
                place_name: true,
                place_address: true,
                latitude: true,
                longitude: true,
                created_at: true,
                updated_at: true,
            },
        });

        return NextResponse.json({ pins }, { status: 200 });
    } catch (error) {
        console.error("Pin 取得エラー:", error);
        return NextResponse.json({ error: "Pin 取得中にエラーが発生しました" }, { status: 500 });
    }
}
