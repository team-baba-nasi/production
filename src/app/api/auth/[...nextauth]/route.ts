import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("メールアドレスとパスワードを入力してください");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.email) {
                    throw new Error("ユーザーが見つかりません");
                }

                // パスワードの検証
                if (!user.password) {
                    throw new Error("パスワードが設定されていません");
                }

                const isPasswordValid = await compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error("パスワードが正しくありません");
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.username,
                    image: user.profile_image_url,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30日
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // 初回ログイン時
            if (user) {
                token.id = user.id;
                token.role = user.role || "user";
            }

            // プロバイダー情報を保存
            if (account) {
                token.provider = account.provider;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async signIn({ user, account }) {
            // Google認証の場合、ユーザー情報を更新または作成
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (!existingUser) {
                    // 新規ユーザーの場合、usernameを設定
                    await prisma.user.create({
                        data: {
                            email: user.email!,
                            username: user.email!.split("@")[0] + "_" + Date.now(),
                            profile_image_url: user.image,
                            role: "user",
                        },
                    });
                } else {
                    // 既存ユーザーの場合、プロフィール画像を更新
                    if (user.image && existingUser.profile_image_url !== user.image) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { profile_image_url: user.image },
                        });
                    }
                }
            }

            return true;
        },
    },
    events: {
        async signIn({ user }) {
            console.log(`User signed in: ${user.email}`);
        },
        async signOut({ token }) {
            console.log(`User signed out: ${token.email}`);
        },
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
