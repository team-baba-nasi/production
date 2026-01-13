import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "パスワードが間違っています" }, { status: 401 });
        }

        const accessToken = signAccessToken({
            id: user.id,
            email: user.email,
        });

        const refreshToken = signRefreshToken({
            id: user.id,
            tokenVersion: user.tokenVersion,
        });

        const response = NextResponse.json({
            message: "ログイン成功",
            user: { id: user.id, username: user.username, email: user.email },
        });

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 15, // 15分
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
    }
}
