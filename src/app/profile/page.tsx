"use client";

import { useState } from "react";
import Navigation from "@/components/ui/Navigation/Navigation";
import styles from "@/features/profile/page/profile.module.scss";
import LoadingDialog from "@/components/ui/LoadingDialog/LoadingDialog";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import clsx from "clsx";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type TabType = "visited" | "saved";

// ダミーデータ
const visitedShops = [
    {
        id: 1,
        name: "炭火イタリアン CARBO",
        address: "〒530-0027 大阪府大阪市北区堂島1-6-16 1-2 中通りレジャービル",
        date: "11月21日16:00～",
        groupName: "仲良し",
        members: ["じろー", "すなちゃん", "ひなた"],
        image: "/images/shop-sample.jpg",
    },
    {
        id: 2,
        name: "黒毛和牛タンとハラミ焼肉ごりちゃん梅田本店",
        address: "〒530-0027 大阪府大阪市北区堂島町8-2-1 石本ビルB1",
        date: "11月21日16:00～",
        groupName: "パパ抜きパパ無し",
        members: ["じろー", "すなちゃん", "ひなた"],
        image: "/images/shop-sample.jpg",
    },
];

const savedShops = [
    {
        id: 1,
        name: "黒毛和牛タンとハラミ焼肉ごりちゃん梅田本店",
        address: "〒530-0027 大阪府大阪市北区堂島町8-2-1 石本ビルB1",
        image: "/images/shop-sample.jpg",
    },
    {
        id: 2,
        name: "黒毛和牛タンとハラミ焼肉ごりちゃん梅田本店",
        address: "〒530-0027 大阪府大阪市北区堂島町8-2-1 石本ビルB1",
        image: "/images/shop-sample.jpg",
    },
    {
        id: 3,
        name: "黒毛和牛タンとハラミ焼肉ごりちゃん梅田本店",
        address: "〒530-0027 大阪府大阪市北区堂島町8-2-1 石本ビルB1",
        image: "/images/shop-sample.jpg",
    },
];

export default function ProfilePage() {
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const [activeTab, setActiveTab] = useState<TabType>("visited");
    const [expandedShopId, setExpandedShopId] = useState<number | null>(null);

    if (isUserLoading) {
        return <LoadingDialog isOpen={isUserLoading} />;
    }

    if (!currentUser) {
        return <div className={styles.wrap}>エラーが発生しました</div>;
    }

    const user = currentUser.user;
    const displayShops = activeTab === "visited" ? visitedShops : savedShops;

    const handleShopClick = (shopId: number) => {
        if (activeTab === "visited") {
            setExpandedShopId(expandedShopId === shopId ? null : shopId);
        }
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <Image
                        src={"/images/profile/PROFILE.svg"}
                        alt="profile"
                        width={145}
                        height={53}
                    />
                    <button className={styles.editButton}>編集</button>
                </div>

                <div className={styles.profileInfo}>
                    <Image
                        src={user?.profile_image_url || "/images/default-avatar.png"}
                        alt="プロフィール画像"
                        width={100}
                        height={100}
                        className={styles.profileImage}
                    />
                    <div className={styles.profileText}>
                        <h3 className={styles.username}>{user?.username || "田中 太郎"}</h3>
                        <p className={styles.userId}>
                            @{user?.email?.split("@")[0] || "tanaka_taro"}
                        </p>
                    </div>
                </div>

                <div className={clsx(styles.stats, "text_normal bold")}>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>今まで行ったお店</p>
                        <p className={styles.statValue}>32</p>
                    </div>
                    <div className={styles.statItem}>
                        <p className={styles.statLabel}>保存したお店</p>
                        <p className={styles.statValue}>152</p>
                    </div>
                </div>
            </div>

            <div className={styles.groupCard}>
                <div className={styles.groupIcon}>
                    <Image
                        src={"/images/profile/group.svg"}
                        alt="グループアイコン"
                        width={33}
                        height={25}
                    />
                </div>
                <div className={styles.groupInfo}>
                    <h4 className={styles.groupTitle}>グループ</h4>
                    <p className={styles.groupList}>仲良し(3), 飯適当に行きて～(6), WD...</p>
                </div>
                <div className={styles.groupCount}>
                    6
                    <IoIosArrowForward width={7} height={14} />
                </div>
            </div>

            <div className={styles.tabSection}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === "visited" ? styles.active : ""}`}
                        onClick={() => setActiveTab("visited")}
                    >
                        行ったことある店
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "saved" ? styles.active : ""}`}
                        onClick={() => setActiveTab("saved")}
                    >
                        保存したお店
                    </button>
                </div>

                <div className={styles.shopList}>
                    {displayShops.map((shop) => (
                        <div key={shop.id} className={styles.shopCard}>
                            <div
                                className={styles.shopCardMain}
                                onClick={() => handleShopClick(shop.id)}
                            >
                                <div className={styles.shopImageWrapper}>
                                    <Image
                                        src={shop.image}
                                        alt={shop.name}
                                        width={400}
                                        height={300}
                                        className={styles.shopImage}
                                    />
                                </div>
                                <div className={styles.shopInfo}>
                                    <h5 className={styles.shopName}>{shop.name}</h5>
                                    <p className={styles.shopAddress}>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            className={styles.locationIcon}
                                        >
                                            <path
                                                d="M8 0C5.24 0 3 2.24 3 5C3 8.5 8 14 8 14C8 14 13 8.5 13 5C13 2.24 10.76 0 8 0ZM8 7C6.9 7 6 6.1 6 5C6 3.9 6.9 3 8 3C9.1 3 10 3.9 10 5C10 6.1 9.1 7 8 7Z"
                                                fill="#999"
                                            />
                                        </svg>
                                        {shop.address}
                                    </p>
                                </div>
                            </div>

                            {activeTab === "visited" &&
                                expandedShopId === shop.id &&
                                "date" in shop && (
                                    <div className={styles.shopDetails}>
                                        <p className={styles.visitDate}>
                                            黒毛和牛タンとハラミ焼肉ごりちゃん梅田本店
                                        </p>
                                        <div className={styles.visitInfo}>
                                            <p className={styles.groupNameText}>
                                                「仲良し」グループの
                                            </p>
                                            <div className={styles.membersRow}>
                                                <div className={styles.memberAvatars}>
                                                    {/* {shop.members.map((member, index) => ( */}
                                                    <div className={styles.memberAvatar}>
                                                        <Image
                                                            src="/images/default-avatar.png"
                                                            alt={"メンバーアイコン"}
                                                            width={32}
                                                            height={32}
                                                        />
                                                    </div>
                                                    {/* ))} */}
                                                </div>
                                                <p className={styles.visitText}>
                                                    {/* {shop.members.join("、")} と行きました。 */}
                                                    太郎といきました。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>

            <Navigation />
        </div>
    );
}
