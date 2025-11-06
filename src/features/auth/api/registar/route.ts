import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
    username: z
        .string()
        .min(3, "ユーザー名は3文字以上である必要があります")
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // バリデーション
        const validationResult = registerSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "バリデーションエラー",
                    details: validationResult.error.issues.map((issue) => ({
                        field: issue.path[0],
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }

        const { username, email, password } = validationResult.data;

        // ユーザー名の重複チェック
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: "このユーザー名は既に使用されています" },
                { status: 409 }
            );
        }

        // メールアドレスの重複チェック
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingEmail) {
            return NextResponse.json(
                { error: "このメールアドレスは既に登録されています" },
                { status: 409 }
            );
        }

        // パスワードのハッシュ化
        const hashedPassword = await hash(password, 12);

        // ユーザーの作成（NextAuth互換）
        const user = await prisma.user.create({
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
                role: true,
                created_at: true,
            },
        });

        return NextResponse.json(
            {
                message: "ユーザー登録が完了しました",
                user,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
    }
}
