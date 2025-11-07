import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";

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

        return NextResponse.json({
            message: "ログイン成功",
            user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
    }
}
