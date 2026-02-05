import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// バリデーションスキーマ
const registerSchema = z.object({
    username: z
        .string()
        .min(2, "ユーザー名は2文字以上である必要があります")
        .max(20, "ユーザー名は20文字以下である必要があります")
        .regex(
            /^[a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/,
            "ユーザー名は英数字、アンダースコア、日本語のみ使用できます"
        ),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
        .string()
        .min(8, "パスワードは8文字以上である必要があります")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "パスワードは大文字、小文字、数字を含む必要があります"
        ),
});

export async function POST(request) {
    try {
        const body = await request.json();

        // 入力バリデーション
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "バリデーションエラー",
                    details: validation.error.issues.map((issue) => ({
                        field: issue.path[0],
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { username, email, password } = validation.data;

        // 既存ユーザー確認
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "既に同じユーザー名またはメールアドレスが存在します" },
                { status: 409 }
            );
        }

        // パスワードハッシュ化
        const hashedPassword = await hash(password, 12);

        // ユーザー作成
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: "user",
            },
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
            },
        });

        return NextResponse.json(
            {
                message: "登録が完了しました",
                user: newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
