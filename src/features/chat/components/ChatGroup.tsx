import Link from "next/link";
import Image from "next/image";
import styles from "@/features/chat/styles/ChatGroup.module.scss";
import clsx from "clsx";

const ChatGroup = () => {
    return (
        <Link href={`/chat/`} className={styles.wrap}>
            <Image
                src={"/images/groups/test_icon.webp"}
                alt="チャットグループアイコン"
                width={58}
                height={58}
            />
            <div>
                <div className={styles.info}>
                    <p className="text_normal bold">みんな仲良しグループ(4)</p>
                    <p className={clsx("text_sub", styles.info, styles.subtext)}>11:21</p>
                </div>
                <p className={clsx("text_sub", styles.subtext)}>ありがとう</p>
            </div>
        </Link>
    );
};
export default ChatGroup;
