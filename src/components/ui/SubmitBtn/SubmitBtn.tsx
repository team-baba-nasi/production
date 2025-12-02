import styles from "@/components/ui/SubmitBtn/SubmitBtn.module.scss";
import clsx from "clsx";
import { MdLink } from "react-icons/md";
interface SubmitBtnWrap {
    text: string;
    link?: boolean;
    submit?: boolean;
    onClick: () => void;
}

const SubmitBtn: React.FC<SubmitBtnWrap> = ({ text, link, submit, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "text_normal bold shadow_8",
                styles.btn_wrap,
                submit && styles.submit,
                link && styles.link
            )}
        >
            {link && <MdLink color="#2db2ff" size={30} className="link_icon" />}
            {text}
        </button>
    );
};

export default SubmitBtn;
