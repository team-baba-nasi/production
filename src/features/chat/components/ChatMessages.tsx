import clsx from "clsx";
import Image from "next/image";
import styles from "@/features/chat/styles/ChatMessages.module.scss";
import { ChatRoomResponse } from "@/features/chat/types/chat";
import { formatTime } from "@/utils/formatTime";
import formatMessageDate from "../util/formatMessageDate";

type Props = {
    chatRoom: ChatRoomResponse["chatRoom"];
    myUserId: number | undefined;
};

const ChatMessages = ({ chatRoom, myUserId }: Props) => {
    const messages = chatRoom.messages;

    return (
        <div>
            {messages.map((message, index) => {
                const prevMessage = index > 0 ? messages[index - 1] : null;

                const currentDate = message.created_at.slice(0, 10);
                const prevDate = prevMessage?.created_at.slice(0, 10);

                const shouldShowDate = currentDate !== prevDate;

                const isMine = message.sender.id === myUserId;
                const isContinuous =
                    prevMessage?.sender.id === message.sender.id && !shouldShowDate;

                return (
                    <div key={message.id}>
                        {shouldShowDate && (
                            <div className={styles.messageDate}>
                                <p className="text_sub gray">
                                    {formatMessageDate(message.created_at)}
                                </p>
                            </div>
                        )}

                        <div
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
                                            className={styles.senderIcon}
                                        />
                                    )}

                                    <div className={clsx(styles.message, styles.otherMessage)}>
                                        <p className="text_chat">{message.content}</p>
                                    </div>

                                    <p className="text_sub_sub">{formatTime(message.created_at)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatMessages;
