import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, message, icon, url, user_id } = body as {
        title: string;
        message: string;
        icon?: string;
        url?: string;
        user_id?: number;
    };

    if (!title || !message) {
        return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const subscriptions = await prisma.pushSubscription.findMany({
        where: user_id ? { user_id } : {},
    });

    if (subscriptions.length === 0) {
        return NextResponse.json({ message: "No subscriptions found" }, { status: 404 });
    }

    const payload = JSON.stringify({
        title,
        body: message,
        icon: icon ?? "/icon-192x192.png",
        url: url ?? "/",
    });

    const results = await Promise.allSettled(
        subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.p256dh,
                            auth: sub.auth,
                        },
                    },
                    payload
                );

                // Notification モデルへ保存
                await prisma.notification.create({
                    data: {
                        user_id: sub.user_id,
                        type: "push",
                        reference_type: "push-notification",
                        reference_id: Number(sub.id),
                        title,
                        message,
                    },
                });

                return { success: true, id: sub.id };
            } catch (error) {
                const err = error as { statusCode?: number };
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await prisma.pushSubscription.delete({ where: { id: sub.id } });

                    return { success: false, id: sub.id, deleted: true };
                }

                return { success: false, id: sub.id };
            }
        })
    );

    const successCount = results.filter((r) => r.status === "fulfilled" && r.value.success).length;

    const deletedCount = results.filter((r) => r.status === "fulfilled" && r.value.deleted).length;

    return NextResponse.json({
        message: "Notification process completed",
        total: subscriptions.length,
        successful: successCount,
        deleted: deletedCount,
        results: results.map((r) => (r.status === "fulfilled" ? r.value : { success: false })),
    });
}
