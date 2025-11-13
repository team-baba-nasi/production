import styles from "@/features/groups/styles/header.module.scss";
import Image from "next/image";

interface headerProps {
    text: string;
    add?: boolean;
    back?: boolean;
    addToPage?: string;
    backToPage?: string;
}

const GroupHeader: React.FC<headerProps> = ({ text, add, back, addToPage, backToPage }) => {
    return (
        <div className={styles.headerWrap}>
            <div className={styles.iconBox}>
                {back && backToPage ? (
                    <a href={backToPage}>
                        <Image
                            src="/images/ui/arrow_back.svg"
                            alt="backToPageButton"
                            width={24}
                            height={24}
                        />
                    </a>
                ) : (
                    <div style={{ width: 24, height: 24 }} />
                )}
            </div>
            <h2>{text}</h2>
            <div className={styles.iconBox}>
                {add && addToPage ? (
                    <a href={addToPage}>
                        <Image
                            src="/images/ui/plus_btn.svg"
                            alt="createGroupButton"
                            width={24}
                            height={24}
                        />
                    </a>
                ) : (
                    <div style={{ width: 24, height: 24 }} />
                )}
            </div>
        </div>
    );
};

export default GroupHeader;
