"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import styles from "@/features/chat/styles/pages/chat.module.scss";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import ChatMessages from "@/features/chat/components/ChatMessages";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";

type ShopInfo = {
    name: string;
    address: string;
    date: {
        year: number;
        month: number;
        day: number;
        weekday: string;
    };
    time: string;
};

const Chat = () => {
    const [message, setMessage] = useState<string>("");
    const { uuid } = useParams<{ uuid: string }>();

    const sendMessageMutation = useSendMessage();

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) return;

        try {
            await sendMessageMutation.mutateAsync({
                chatRoomUuid: uuid,
                content: message,
            });
            setMessage("");
        } catch (error) {
            console.error("メッセージ送信エラー:", error);
        }
    };

    const shopInfo: ShopInfo = {
        name: "山根屋",
        address: "大阪府大阪市北区中崎西1丁目4−22",
        date: {
            year: 2025,
            month: 12,
            day: 12,
            weekday: "金",
        },
        time: "17:00 ~ 19:00",
    };

    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

    const { data, isLoading, error } = useChatMessages(uuid);

    if (isLoading || isUserLoading) {
        return <div className={styles.wrap}>Loading...</div>;
    }

    if (error || !data || !currentUser) {
        return <div className={styles.wrap}>エラーが発生しました</div>;
    }

    return (
        <>
            <div className={styles.wrap}>
                {/* header */}
                <div className={styles.header}>
                    <Link href="/chat">
                        <Image
                            src="/images/ui/arrow_back.svg"
                            alt="backToPageButton"
                            width={24}
                            height={24}
                        />
                    </Link>

                    <div className={styles.groupInfo}>
                        <Image
                            src="/images/groups/test_icon.webp"
                            alt="グループアイコン"
                            width={32}
                            height={32}
                        />
                        <h2 className="text_normal bold">チャット</h2>
                    </div>
                    <div />
                </div>

                <div className={styles.shopInfoWrap}>
                    <div className={styles.matching}>
                        <p className="text_normal bold">マッチングしました</p>
                    </div>

                    <div className={styles.shopInfo}>
                        <Image
                            src="/images/groups/test_icon_4x.webp"
                            alt="ショッププレビュー"
                            width={108}
                            height={108}
                        />

                        <div className={styles.shopTexts}>
                            <div>
                                <h3 className="text_normal">{shopInfo.name}</h3>
                                <p className="text_sub">{shopInfo.address}</p>
                            </div>

                            <div>
                                <div className={styles.messageTime}>
                                    <p>
                                        {shopInfo.date.year}
                                        <span className="text_sub">/</span>
                                        {shopInfo.date.month}
                                        <span className="text_sub">/</span>
                                        {shopInfo.date.day}
                                    </p>

                                    <div className={styles.weekDayWrap}>
                                        <Image
                                            src="/images/chat/eclipse.svg"
                                            alt="曜日の背景の円"
                                            width={24}
                                            height={24}
                                        />
                                        <p className={clsx(styles.weekDay, "text_sub bold")}>
                                            {shopInfo.date.weekday}
                                        </p>
                                    </div>
                                </div>

                                <p className="text_sub bold">{shopInfo.time}</p>
                            </div>
                        </div>
                    </div>

                    <Image
                        src="/images/chat/cracker.png"
                        alt="クラッカー"
                        width={64}
                        height={64}
                        className={styles.cracker}
                    />
                </div>

                <ChatMessages chatRoom={data.chatRoom} myUserId={currentUser.user?.id} />
            </div>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="text_normal"
                    placeholder="メッセージを入力"
                />
                <div className={styles.submitBtn} onClick={handleSendMessage}>
                    <Image
                        src="/images/chat/send.svg"
                        alt="メッセージ送信ボタン"
                        width={24}
                        height={24}
                    />
                </div>
            </div>
        </>
    );
};

export default Chat;
