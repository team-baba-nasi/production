import styles from "@/features/groups/styles/GroupDialog.module.scss";
import Image from "next/image";

interface GroupDialogProps {
    img: string;
    type: "delete" | "leave";
    name: string;
    onClick: () => void;
    onCancel: () => void; // ← 追加
}

const GroupDialog: React.FC<GroupDialogProps> = ({ img, type, name, onClick, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <Image src={img} alt="グループアイコン" width={100} height={100} />
                <p className={styles.dialogText}>
                    <span>{name}</span>
                    {type === "delete" ? (
                        <>
                            を<br />
                            本当に削除しますか？
                        </>
                    ) : (
                        <>
                            から
                            <br />
                            本当に退会しますか？
                        </>
                    )}
                </p>
                <div className={styles.btnWrap}>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        <p>キャンセル</p>
                    </button>
                    <button className={styles.submitBtn} onClick={onClick}>
                        <p>{type === "delete" ? "削除" : "退会"}</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupDialog;
