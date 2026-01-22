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
import { useConfirmedMeeting } from "@/features/chat/hooks/useConfirmedMeeting";
import { ConfirmedMeeting } from "@/features/chat/types/chat";

const Chat = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [message, setMessage] = useState<string>("");

    const sendMessageMutation = useSendMessage();

    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
    const { data, isLoading, error } = useChatMessages(uuid);
    const {
        data: meetingData,
        isLoading: isMeetingLoading,
        error: meetingError,
    } = useConfirmedMeeting(uuid);

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

    if (isLoading || isUserLoading || isMeetingLoading) {
        return <div className={styles.wrap}>Loading...</div>;
    }

    if (error || !data || !currentUser || meetingError) {
        return <div className={styles.wrap}>エラーが発生しました</div>;
    }

    const formatMeetingInfo = (meeting: ConfirmedMeeting) => {
        const startDate = new Date(meeting.meeting_date);
        const endDate = new Date(meeting.meeting_end);

        return {
            name: meeting.place_name,
            address: meeting.place_address,
            date: {
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                day: startDate.getDate(),
                weekday: ["日", "月", "火", "水", "木", "金", "土"][startDate.getDay()],
            },
            time: `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")} ~ ${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`,
        };
    };

    const confirmedMeeting = meetingData?.confirmedMeeting;
    const shopInfo = confirmedMeeting ? formatMeetingInfo(confirmedMeeting) : null;

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

                {shopInfo && (
                    <div className={styles.shopInfoWrap}>
                        <div className={styles.matching}>
                            <p className="text_normal bold">マッチングしました</p>
                        </div>

                        <div className={styles.shopInfo}>
                            <Image
                                src="/images/chat/demo_img.JPG"
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
                )}

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
