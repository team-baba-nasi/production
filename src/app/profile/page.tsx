"use client";

import Navigation from "@/components/ui/Navigation/Navigation";
import styles from "@/features/profile/page/profile.module.scss";
import Image from "next/image";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function Home() {
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

    if (isUserLoading) {
        return <div className={styles.wrap}>Loading...</div>;
    }

    if (!currentUser) {
        return <div className={styles.wrap}>エラーが発生しました</div>;
    }
    const user = currentUser.user;

    return (
        <div className={styles.wrap}>
            <div className={styles.profile}>
                <h2>PROFILE</h2>
                <Image src={`${user?.profile_image_url}`} alt="アイコン" width={80} height={80} />
                <p className="text_normal">{user?.username}</p>
            </div>
            <Navigation />
        </div>
    );
}
