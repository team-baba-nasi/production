import styles from "@/components/ui/InputField/InputField.module.scss";
import Image from "next/image";

type InputFieldProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    search?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    search = false,
}) => {
    return (
        <div className={styles.wrap}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.fieldWrap}>
                {search && (
                    <Image src="/images/ui/search.svg" alt="search" width={18} height={18} />
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export default InputField;
