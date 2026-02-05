import Link from "next/link";
import Image from "next/image";
import styles from "@/features/chat/styles/ChatGroup.module.scss";
import clsx from "clsx";
import { ChatRoom, ChatMessage } from "../types/chat";

interface ChatGroupProos {
    room: ChatRoom;
    lastMessage: ChatMessage | null;
}

const ChatGroup = ({ room, lastMessage }: ChatGroupProos) => {
    return (
        <Link href={`/chat/${room.uuid}`} className={styles.wrap}>
            <Image
                src={"/images/groups/test_icon.webp"}
                alt="チャットグループアイコン"
                width={58}
                height={58}
            />
            <div>
                <div className={styles.info}>
                    <p className="text_normal bold">
                        みんな仲良しグループ({room.participants.length})
                    </p>
                    {lastMessage && (
                        <p className={clsx("text_sub", styles.info, styles.subtext)}>
                            {new Date(lastMessage.created_at).toLocaleTimeString("ja-JP", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    )}
                </div>
                <p className={clsx("text_sub", styles.subtext)}>
                    {" "}
                    {lastMessage ? lastMessage.content : ""}
                </p>
            </div>
        </Link>
    );
};
export default ChatGroup;
