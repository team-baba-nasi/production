import { BiSolidMap } from "react-icons/bi";
import styles from "../styles/Window.module.scss";

type CreatePinButtonProps = {
    onClick: () => void;
};

const CreatePinButton: React.FC<CreatePinButtonProps> = ({ onClick }) => {
    return (
        <button className={styles.createPinBtn} onClick={onClick}>
            <BiSolidMap color="white" size={30} />
            <p>いきたいピンを指す</p>
        </button>
    );
};

export default CreatePinButton;
