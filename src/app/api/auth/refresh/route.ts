import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
        return NextResponse.json({ error: "Token revoked" }, { status: 401 });
    }

    const newAccessToken = signAccessToken({
        id: user.id,
        email: user.email,
    });

    const res = NextResponse.json({ ok: true });

    res.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 15,
    });

    return res;
}
