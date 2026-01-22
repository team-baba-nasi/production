import styles from "@/components/ui/Label/Label.module.scss";

type LabelProps = {
    label: string;
};

const Label: React.FC<LabelProps> = ({ label }) => {
    return (
        <>
            <label className={styles.label}>{label}</label>
        </>
    );
};

export default Label;
