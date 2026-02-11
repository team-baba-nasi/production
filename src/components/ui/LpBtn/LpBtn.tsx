"use client";

import styles from "./LpBtn.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const getCookie = (name: string): string | undefined => {
    return document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${name}=`))
        ?.split("=")[1];
};

export default function LpBtn() {
    const router = useRouter();

    const handleClick = async () => {
        try {
            const accessToken = getCookie("accessToken");

            if (accessToken) {
                router.push("/map");
                return;
            }

            await api.post("/auth/refresh");

            router.push("/map");
        } catch {
            router.push("/auth/login");
        }
    };


    return (
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
    );
}
