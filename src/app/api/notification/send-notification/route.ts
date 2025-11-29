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
                    .then(() => ({ success: true, user_id: sub.user_id }))
                    .catch((err) => {
                        console.error("Failed to send:", err);
                        return { success: false, user_id: sub.user_id };
                    })
            )
        );

        // DBに履歴保存
        await Promise.all(
            results
                .filter(
                    (
                        r
                    ): r is {
                        status: "fulfilled";
                        value: { success: true; user_id: number | null };
                    } => r.status === "fulfilled" && r.value.success && r.value.user_id
                )
                .map((r) =>
                    prisma.notification.create({
                        data: {
                            user_id: r.value.user_id!,
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
            success: results.filter((r) => r.status === "fulfilled" && r.value.success).length,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}
