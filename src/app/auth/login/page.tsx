"use client";

import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const { mutate, isPending, isError, error } = useLogin();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(form);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* メールアドレス */}
                    <div>
                        <label className="block text-gray-700 mb-1">メールアドレス</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="例: example@mail.com"
                        />
                    </div>

                    {/* パスワード */}
                    <div>
                        <label className="block text-gray-700 mb-1">パスワード</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="パスワードを入力"
                        />
                    </div>

                    {/* エラーメッセージ */}
                    {isError && error?.response?.data && (
                        <div className="text-red-600 text-sm space-y-1">
                            <p>{error.response.data.error}</p>
                        </div>
                    )}

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`w-full py-2 rounded-lg text-white font-semibold ${
                            isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 transition"
                        }`}
                    >
                        {isPending ? "ログイン中..." : "ログインする"}
                    </button>
                </form>
            </div>
        </div>
    );
}
