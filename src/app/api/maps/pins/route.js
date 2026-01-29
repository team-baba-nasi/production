import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

const createPinSchema = z.object({
    group_ids: z.array(z.number()).optional(),
    place_id: z.string().optional(),
    place_name: z
        .string()
        .min(1, "場所名は必須です")
        .max(100, "場所名は100文字以下である必要があります"),
    place_address: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    comment: z.string().optional(),
    status: z.enum(["open", "scheduled", "closed", "cancelled"]).optional(),
    schedule: z
        .object({
            date: z.string(),
            startTime: z.string().optional(),
            endTime: z.string().optional(),
        })
        .optional(),
});

export async function GET(request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const groupIdParam = searchParams.get("group_id");

        if (!groupIdParam) {
            return NextResponse.json({ error: "group_id は必須です" }, { status: 400 });
        }

        const groupId = Number(groupIdParam);
        if (Number.isNaN(groupId)) {
            return NextResponse.json(
                { error: "group_id は数値である必要があります" },
                { status: 400 }
            );
        }

        // グループ所属チェック
        const membership = await prisma.groupMember.findFirst({
            where: {
                group_id: groupId,
                user_id: user.id,
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "このグループにアクセスする権限がありません" },
                { status: 403 }
            );
        }

        const pins = await prisma.pin.findMany({
            where: {
                status: "open",
                pin_groups: {
                    some: {
                        group_id: groupId,
                    },
                },
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
                    select: {
                        id: true,
                        username: true,
                        profile_image_url: true,
                    },
                },
                pin_groups: {
                    select: {
                        group: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                reactions: {
                    select: {
                        id: true,
                        reaction_type: true,
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
                schedules: {
                    select: {
                        id: true,
                        date: true,
                        start_at: true,
                        end_at: true,
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

export async function POST(request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const body = await request.json();
        const validation = createPinSchema.safeParse(body);

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

        const pin = await prisma.pin.create({
            data: {
                user_id: user.id,
                place_id: data.place_id,
                place_name: data.place_name,
                place_address: data.place_address,
                latitude: data.latitude,
                longitude: data.longitude,
                comment: data.comment,
                status: data.status ?? "open",
                pin_groups: data.group_ids
                    ? {
                          createMany: {
                              data: data.group_ids.map((groupId) => ({
                                  group_id: groupId,
                              })),
                          },
                      }
                    : undefined,
                schedules: data.schedule
                    ? {
                          create: [
                              {
                                  organizer: {
                                      connect: { id: user.id },
                                  },
                                  date: new Date(data.schedule.date),
                                  start_at: data.schedule.startTime
                                      ? new Date(`${data.schedule.date}T${data.schedule.startTime}`)
                                      : null,
                                  end_at: data.schedule.endTime
                                      ? new Date(`${data.schedule.date}T${data.schedule.endTime}`)
                                      : null,
                              },
                          ],
                      }
                    : undefined,
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
                pin_groups: {
                    select: {
                        group: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ pin }, { status: 201 });
    } catch (error) {
        console.error("Pin 作成エラー:", error);
        return NextResponse.json({ error: "Pin 作成中にエラーが発生しました" }, { status: 500 });
    }
}
