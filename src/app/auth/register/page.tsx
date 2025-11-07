"use client";

import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useRegister";

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const { mutate, isPending, isSuccess, isError, error, data } = useRegister();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutate(form);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">ユーザー登録</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ユーザー名 */}
                    <div>
                        <label className="block text-gray-700 mb-1">ユーザー名</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="例: jiro_t"
                        />
                    </div>

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
                            placeholder="8文字以上（英大文字・小文字・数字を含む）"
                        />
                    </div>

                    {/* エラー or 成功メッセージ */}
                    {isError && error?.response?.data && (
                        <p className="text-red-600 text-sm">
                            {error.response.data.details
                                ?.map((d) => `${d.field}: ${d.message}`)
                                .join("\n") || error.response.data.error}
                        </p>
                    )}
                    {isSuccess && data && <p className="text-green-600 text-sm">{data.message}</p>}

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
                        {isPending ? "登録中..." : "登録する"}
                    </button>
                </form>
            </div>
        </div>
    );
}
