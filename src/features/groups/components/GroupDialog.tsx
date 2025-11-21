import styles from "@/features/groups/styles/GroupDialog.module.scss";
import Image from "next/image";
import clsx from "clsx";

interface GroupDialogProps {
    img: string;
    type: "delete" | "leave" | "invite";
    name: string;
    onClick: () => void;
    onCancel: () => void;
}

const GroupDialog: React.FC<GroupDialogProps> = ({ img, type, name, onClick, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <Image
                    src={img}
                    alt="グループアイコン"
                    width={100}
                    height={100}
                    className="rounded-full"
                />
                <p className={styles.dialogText}>
                    <span>{name}</span>
                    {type === "delete" ? (
                        <>
                            を<br />
                            本当に削除しますか？
                        </>
                    ) : type === "leave" ? (
                        <>
                            から
                            <br />
                            本当に退会しますか？
                        </>
                    ) : (
                        <>
                            から
                            <br />
                            招待が来ています
                        </>
                    )}
                </p>
                <div className={styles.btnWrap}>
                    <button className={clsx(styles.cancelBtn, styles.btns)} onClick={onCancel}>
                        <p>キャンセル</p>
                    </button>
                    <button className={clsx(styles.submitBtn, styles.btns)} onClick={onClick}>
                        <p>{type === "delete" ? "削除" : type === "leave" ? "退会" : "参加"}</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupDialog;
