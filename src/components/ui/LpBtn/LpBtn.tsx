import Link from "next/link";
import styles from "./LpBtn.module.scss";
import Image from "next/image";

export default function LpBtn() {
    return (
        <>
            <div className={styles.appBtnWrap}>
                <Link href="/auth/login" className={styles.appBtn}>
                    <Image
                        src="/images/lp/character/nav_icon.svg"
                        alt="たべごろのキャラクター"
                        width={48}
                        height={48}
                        className={styles.appBtnIcon}
                    />
                    ログインして始める
                </Link>
                <p>※Webアプリに移動します</p>
            </div>
        </>
    );
}
