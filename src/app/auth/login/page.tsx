"use client";

import { useState } from "react";
import { useLogin } from "@/features/auth/hooks/useLogin";
import Image from "next/image";
import styles from "@/features/auth/styles/Login.module.scss";

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
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.logoSection}>
                    <Image
                        src="/images/logo.svg"
                        alt="たべごろのロゴ"
                        width={120}
                        height={159}
                        className={styles.logo}
                    />
                    <h1 className={styles.title}>ログイン</h1>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* メールアドレス */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="例: example@mail.com"
                        />
                    </div>

                    {/* パスワード */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            パスワード
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="パスワードを入力"
                        />
                    </div>

                    {/* エラーメッセージ */}
                    {isError && error?.response?.data && (
                        <div className={styles.errorMessage}>
                            <p>{error.response.data.error}</p>
                        </div>
                    )}

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`${styles.submitButton} ${isPending ? styles.disabled : ""}`}
                    >
                        {isPending ? "ログイン中..." : "ログインする"}
                    </button>
                </form>
                <div className={styles.linkSection}>
                    <p className={styles.linkText}>アカウントをお持ちでない方</p>
                    <a href="/auth/register" className={styles.link}>
                        新規登録はこちら
                    </a>
                </div>
            </div>
        </div>
    );
}
