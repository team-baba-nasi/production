import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
        const payload = verifyRefreshToken(refreshToken);

        if (payload) {
            await prisma.user.update({
                where: { id: payload.id },
                data: {
                    tokenVersion: { increment: 1 },
                },
            });
        }
    }

    const res = NextResponse.json({ ok: true });

    // Cookie 全削除
    res.cookies.set("accessToken", "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
    });

    res.cookies.set("refreshToken", "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
    });

    return res;
}
