import Image from "next/image";
import Label from "@/components/ui/Label/Label";
import styles from "@/features/groups/styles/GroupIcon.module.scss";

interface GroupIconProps {
    img: string;
    edit?: boolean;
    label?: boolean;
}

const GroupIcon: React.FC<GroupIconProps> = ({ img, edit, label }) => {
    return (
        <div className={styles.contentWrap}>
            {label && <Label label="グループ画像" />}
            <div className={styles.iconWrap}>
                <Image
                    src={img}
                    alt="グループアイコン"
                    width={80}
                    height={80}
                    className={styles.groupIcon}
                />
                {edit && (
                    <Image
                        src="/images/groups/camera.svg"
                        alt="カメラアイコン"
                        width={24}
                        height={24}
                        className={styles.cameraIcon}
                    />
                )}
            </div>
        </div>
    );
};

export default GroupIcon;
