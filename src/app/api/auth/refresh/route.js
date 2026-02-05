import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const refreshToken = request.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: "リフレッシュトークンがありません" },
                { status: 401 }
            );
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return NextResponse.json({ error: "無効なトークンです" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, tokenVersion: true },
        });

        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return NextResponse.json({ error: "トークンが無効化されています" }, { status: 401 });
        }

        const newAccessToken = signAccessToken({
            id: user.id,
            email: user.email,
        });

        const response = NextResponse.json({ message: "トークンをリフレッシュしました" });

        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 15,
        });

        return response;
    } catch (err) {
        console.error("Refresh error:", err);
        return NextResponse.json(
            { error: "トークンのリフレッシュに失敗しました" },
            { status: 401 }
        );
    }
}
