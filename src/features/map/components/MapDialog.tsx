import styles from "@/features/map/styles/MapDialog.module.scss";
import Image from "next/image";
import { Pin } from "../types/map";
import { useCreateReaction } from "../hooks/useCreateReaction";
import { CreateReactionPayload } from "../types/map";

interface MapDialogProps {
    pin: Pin;
    handleClose: () => void;
}

const MapDialog = ({ pin, handleClose }: MapDialogProps) => {
    const { mutate } = useCreateReaction();
    const handleClick = () => {
        const payload: CreateReactionPayload = {
            pin_id: pin.id,
        };

        mutate(payload);

        handleClose();
    };
    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={styles.commentWrap}>
                    <p className={styles.comment}>{pin.comment}</p>
                </div>
                <Image src={pin.user.profile_image_url} alt="アイコン" width={96} height={96} />
                <button className={styles.button} onClick={handleClick}>
                    ボタンです！！！
                </button>
            </div>
        </div>
    );
};

export default MapDialog;
