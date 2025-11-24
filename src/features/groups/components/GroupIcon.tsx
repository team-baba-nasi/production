import Image from "next/image";
import Label from "@/components/ui/Label/Label";
import styles from "@/features/groups/styles/GroupIcon.module.scss";
interface GroupIconProps {
    img: string;
    edit?: boolean;
    label?: boolean;
    size: number;
}

const GroupIcon: React.FC<GroupIconProps> = ({ img, edit, label, size }) => {
    const imageSrc = img && img !== "undefined" ? img : "/images/groups/test_icon.webp";
    return (
        <div className={styles.contentWrap}>
            {label && <Label label="グループ画像" />}
            <div className={styles.iconWrap} style={{ width: size, height: size }}>
                <Image
                    src={imageSrc}
                    alt="グループアイコン"
                    width={size}
                    height={size}
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
