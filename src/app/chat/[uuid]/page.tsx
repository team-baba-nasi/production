import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import styles from "@/features/chat/styles/pages/chat.module.scss";

type Message = {
    sender_id: number;
    content: string;
    created_at: string;
};

const Chat = () => {
    const messages: Message[] = [
        {
            sender_id: 1,
            content: "自分のメッセージ",
            created_at: "テスト",
        },
        {
            sender_id: 2,
            content: "相手のメッセージ",
            created_at: "テスト",
        },
        {
            sender_id: 1,
            content: "自分のメッセージ2",
            created_at: "テスト",
        },
        {
            sender_id: 2,
            content: "相手のメッセージ2",
            created_at: "テスト",
        },
        {
            sender_id: 2,
            content: "相手のメッセージ3",
            created_at: "テスト",
        },
        {
            sender_id: 3,
            content: "相手のメッセージ4",
            created_at: "テスト",
        },
    ];
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <Link href={"/chat"}>
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
                    <h2 className="text_normal bold">たなか</h2>
                </div>
                <div></div>
            </div>
            <div className={styles.shopInfoWrap}>
                <div className={styles.matching}>
                    <p className="text_normal bold">マッチングしました</p>
                </div>
                <div className={styles.shopInfo}>
                    <Image
                        src={"/images/groups/test_icon_4x.webp"}
                        alt="ショッププレビュー"
                        width={108}
                        height={108}
                    />
                    <div className={styles.shopTexts}>
                        <div>
                            <h3 className="text_normal">山根屋</h3>
                            <p className="text_sub">大阪府大阪市北区中崎西1丁目4−22</p>
                        </div>
                        <div>
                            <div className={styles.messageTime}>
                                <p>
                                    2025
                                    <span className="text_sub">/</span>
                                    12
                                    <span className="text_sub">/</span>
                                    12
                                </p>

                                <div className={styles.weekDayWrap}>
                                    <Image
                                        src={"/images/chat/eclipse.svg"}
                                        alt="曜日の背景の円"
                                        width={24}
                                        height={24}
                                    />
                                    <p className={clsx(styles.weekDay, "text_sub bold")}>金</p>
                                </div>
                            </div>
                            <p className="text_sub bold">17:00 ~ 19:00</p>
                        </div>
                    </div>
                </div>
                <Image
                    src={"/images/chat/cracker.png"}
                    alt="クラッカー"
                    width={64}
                    height={64}
                    className={styles.cracker}
                />
            </div>
            <div className={styles.messageDate}>
                <p className="text_sub gray">12/15(金)</p>
            </div>
            <div>
                {messages.map((message, index) => {
                    const prevSenderId = index > 0 ? messages[index - 1].sender_id : null;
                    const isContinuous = prevSenderId === message.sender_id;

                    return (
                        <div
                            key={`${message.sender_id}-${index}`}
                            className={clsx(
                                styles.content,
                                isContinuous ? styles.mt8 : styles.mt24
                            )}
                        >
                            {message.sender_id === 1 ? (
                                <>
                                    <div></div>
                                    <div className={styles.messageWrap}>
                                        <p className="text_sub_sub">{message.created_at}</p>
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
                                            src="/images/groups/test_icon.webp"
                                            alt="送信者アイコン"
                                            width={40}
                                            height={40}
                                        />
                                    )}
                                    <div className={clsx(styles.message, styles.otherMessage)}>
                                        <p className="text_chat">{message.content}</p>
                                    </div>
                                    <p className="text_sub_sub">{message.created_at}</p>
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
