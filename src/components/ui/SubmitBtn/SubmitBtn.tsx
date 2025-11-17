import styles from "@/components/ui/SubmitBtn/SubmitBtn.module.scss";
import clsx from "clsx";
import Image from "next/image";
interface SubmitBtnWrap {
    text: string;
    link?: boolean;
    onClick: () => void;
}

const SubmitBtn: React.FC<SubmitBtnWrap> = ({ text, link, onClick }) => {
    return (
        <button onClick={onClick} className={clsx(styles.btn_wrap, "text_normal bold")}>
            {link && (
                <Image
                    src="/images/ui/link.svg"
                    alt="リンクアイコン"
                    width={26.67}
                    height={13.33}
                />
            )}
            {text}
        </button>
    );
};

export default SubmitBtn;
