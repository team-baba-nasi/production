import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Number(searchParams.get("limit") ?? "10");
        const offset = Number(searchParams.get("offset") ?? "0");

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                take: limit,
                skip: offset,
                orderBy: {
                    created_at: "desc",
                },
                include: {
                    user: {
                        select: { id: true, username: true },
                    },
                },
            }),
            prisma.notification.count(),
        ]);

        return NextResponse.json({
            notifications,
            total,
            limit,
            offset,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}
