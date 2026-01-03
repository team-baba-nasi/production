"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import styles from "@/features/chat/styles/pages/chat.module.scss";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { formatTime } from "@/utils/formatTime";

const Chat = () => {
    const { uuid } = useParams<{ uuid: string }>();

    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

    const { data, isLoading, error } = useChatMessages(uuid);

    if (isLoading || isUserLoading) {
        return <div className={styles.wrap}>Loading...</div>;
    }

    if (error || !data || !currentUser) {
        return <div className={styles.wrap}>エラーが発生しました</div>;
    }

    const messages = data.chatRoom.messages;
    const myUserId = currentUser.user?.id;

    return (
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

            {/* messages */}
            <div>
                {messages.map((message, index) => {
                    const prevSenderId = index > 0 ? messages[index - 1].sender.id : null;

                    const isContinuous = prevSenderId === message.sender.id;
                    const isMine = message.sender.id === myUserId;

                    return (
                        <div
                            key={message.id}
                            className={clsx(
                                styles.content,
                                isContinuous ? styles.mt8 : styles.mt24
                            )}
                        >
                            {isMine ? (
                                <>
                                    <div />
                                    <div className={styles.messageWrap}>
                                        <p className="text_sub_sub">
                                            {formatTime(message.created_at)}
                                        </p>
                                        <div className={styles.message}>
                                            <p className="text_chat">{message.content}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.messageWrap}>
                                    {isContinuous ? (
                                        <div className={styles.avatarSpacer} />
                                    ) : (
                                        <Image
                                            src={
                                                message.sender.profile_image_url ??
                                                "/images/groups/test_icon.webp"
                                            }
                                            alt="送信者アイコン"
                                            width={40}
                                            height={40}
                                        />
                                    )}

                                    <div className={clsx(styles.message, styles.otherMessage)}>
                                        <p className="text_chat">{message.content}</p>
                                    </div>

                                    <p className="text_sub_sub">{formatTime(message.created_at)}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Chat;
