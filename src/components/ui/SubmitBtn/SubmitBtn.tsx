import styles from "@/components/ui/SubmitBtn/SubmitBtn.module.scss";
import clsx from "clsx";
interface SubmitBtnWrap {
    text: string;
    onClick: () => void;
}

const SubmitBtn: React.FC<SubmitBtnWrap> = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className={clsx(styles.btn_wrap, "text_xl")}>
            {text}
        </button>
    );
};

export default SubmitBtn;
