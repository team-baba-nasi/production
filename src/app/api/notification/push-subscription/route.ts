import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/features/auth/libs/getUserFromToken";

interface SubscriptionPayload {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    user_id: number;
}

export async function POST(request: NextRequest) {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as SubscriptionPayload;

    if (!body.endpoint || !body.keys) {
        return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 });
    }

    const saved = await prisma.pushSubscription.upsert({
        where: { endpoint: body.endpoint },
        update: {
            p256dh: body.keys.p256dh,
            auth: body.keys.auth,
            updatedAt: new Date(),
        },
        create: {
            endpoint: body.endpoint,
            p256dh: body.keys.p256dh,
            auth: body.keys.auth,
            user_id: user.id,
        },
    });

    return NextResponse.json(
        {
            message: "Subscription saved successfully",
            id: saved.id,
        },
        { status: 201 }
    );
}

export async function GET() {
    const subscriptions = await prisma.pushSubscription.findMany({
        select: {
            id: true,
            endpoint: true,
            user_id: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
        count: subscriptions.length,
        subscriptions,
    });
}

interface DeletePayload {
    endpoint: string;
}

export async function DELETE(request: NextRequest) {
    const body = (await request.json()) as DeletePayload;

    await prisma.pushSubscription.delete({
        where: { endpoint: body.endpoint },
    });

    return NextResponse.json({ message: "Subscription deleted" });
}
