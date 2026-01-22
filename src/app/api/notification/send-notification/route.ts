import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";

// VAPID設定
webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { title, body, icon, url } = await request.json();

        if (!title || !body) {
            return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
        }

        // DBから全購読者取得
        const subscriptions = await prisma.pushSubscription.findMany();

        const payload = JSON.stringify({
            title,
            body,
            icon: icon || "/icon-192x192.png",
            url: url || "/",
        });

        // 通知送信
        const results = await Promise.allSettled(
            subscriptions.map((sub) =>
                webpush
                    .sendNotification(
                        {
                            endpoint: sub.endpoint,
                            keys: { p256dh: sub.p256dh, auth: sub.auth },
                        },
                        payload
                    )
                    .then(() => ({ success: true as const, user_id: sub.user_id }))
                    .catch((err) => {
                        console.error("Failed to send:", err);
                        return { success: false as const, user_id: sub.user_id };
                    })
            )
        );

        // DBに履歴保存
        const successfulUserIds: number[] = [];

        for (const result of results) {
            if (result.status === "fulfilled" && result.value.success && result.value.user_id) {
                successfulUserIds.push(result.value.user_id);
            }
        }

        await Promise.all(
            successfulUserIds.map((user_id) =>
                prisma.notification.create({
                    data: {
                        user_id,
                        type: "push",
                        title,
                        message: body,
                    },
                })
            )
        );

        return NextResponse.json({
            message: "Notification sent",
            total: subscriptions.length,
            success: successfulUserIds.length,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}
