import styles from "@/features/map/styles/MapDialog.module.scss";
import Image from "next/image";

interface MapDialogProps {
    comment: string;
    icon: string;
    handleClose: () => void;
}

const MapDialog = ({ comment, icon, handleClose }: MapDialogProps) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={styles.commentWrap}>
                    <p className={styles.comment}>{comment}</p>
                </div>
                <Image src={icon} alt="アイコン" width={96} height={96} />
                <button className={styles.button} onClick={handleClose}>
                    ボタンです！！！
                </button>
            </div>
        </div>
    );
};

export default MapDialog;
