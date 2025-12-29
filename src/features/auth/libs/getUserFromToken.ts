import { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function getUserFromToken(request: NextRequest) {
    try {
        // Cookieからtokenを取得
        const token = request.cookies.get("token")?.value;
        if (!token) return null;

        // JWTの検証
        const decoded = verifyJwt(token);
        if (!decoded || !decoded.id) return null;

        // DBからユーザー情報を取得
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profile_image_url: true,
            },
        });

        return user;
    } catch (error) {
        console.error("getUserFromToken error:", error);
        return null;
    }
}
