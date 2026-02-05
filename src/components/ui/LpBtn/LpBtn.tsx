"use client";

import styles from "./LpBtn.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LpBtn() {
    const router = useRouter();

    const handleClick = async () => {
        try {
            // アクセストークン確認
            const accessToken = document.cookie
                .split("; ")
                .find((c) => c.startsWith("accessToken="))
                ?.split("=")[1];

            if (accessToken) {
                // アクセストークンあれば即リダイレクト
                router.push("/map");
                return;
            }

            // アクセストークンがなければ refresh 実行
            await api.post("/auth/refresh");

            router.push("/map");
        } catch (err) {
            console.error("ログイン/リフレッシュ失敗:", err);
            alert("ログイン情報の確認に失敗しました。再ログインしてください。");
            router.push("/auth/login");
        }
    };

    return (
        <>
            <div className={styles.appBtnWrap}>
                <button onClick={handleClick} className={styles.appBtn}>
                    <Image
                        src="/images/lp/character/nav_icon.svg"
                        alt="たべごろのキャラクター"
                        width={48}
                        height={48}
                        className={styles.appBtnIcon}
                    />
                    ログインして始める
                </button>
                <p>※Webアプリに移動します</p>
            </div>
        </>
    );
}
