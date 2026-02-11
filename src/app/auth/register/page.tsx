"use client";

import { useState } from "react";
import { useRegister } from "@/features/auth/hooks/useRegister";
import Image from "next/image";
import styles from "@/features/auth/styles/Register.module.scss";

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
        <div className={styles.container}>
            <div className={styles.registerCard}>
                <div className={styles.logoSection}>
                    <Image
                        src="/images/logo.svg"
                        alt="たべごろのロゴ"
                        width={120}
                        height={159}
                        className={styles.logo}
                    />
                    <h1 className={styles.title}>新規登録</h1>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* ユーザー名 */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            ユーザー名
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="例: jiro_t"
                        />
                    </div>

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
                            placeholder="8文字以上（英大文字・小文字・数字を含む）"
                        />
                    </div>

                    {/* エラーメッセージ */}
                    {isError && error?.response?.data && (
                        <div className={styles.errorMessage}>
                            {error.response.data.details ? (
                                error.response.data.details.map((d, index) => (
                                    <p key={index}>
                                        {d.field}: {d.message}
                                    </p>
                                ))
                            ) : (
                                <p>{error.response.data.error}</p>
                            )}
                        </div>
                    )}

                    {/* 成功メッセージ */}
                    {isSuccess && data && (
                        <div className={styles.successMessage}>
                            <p>{data.message}</p>
                        </div>
                    )}

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`${styles.submitButton} ${isPending ? styles.disabled : ""}`}
                    >
                        {isPending ? "登録中..." : "登録する"}
                    </button>
                </form>
                <div className={styles.linkSection}>
                    <p className={styles.linkText}>すでにアカウントをお持ちの方</p>
                    <a href="/auth/login" className={styles.link}>
                        ログインはこちら
                    </a>
                </div>
            </div>
        </div>
    );
}
