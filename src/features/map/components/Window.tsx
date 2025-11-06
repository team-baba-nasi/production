import styles from "../styles/map.module.scss";
import { useState } from "react";
import ShopDetail from "./ShopDetail";
import CreatePin from "./CreatePin";

type WindowProps = {
    place: google.maps.places.PlaceResult;
    isClosing: boolean;
    onClose: () => void;
    onCreatePin: (comment: string) => void;
};

const Window: React.FC<WindowProps> = ({ place, isClosing, onClose, onCreatePin }) => {
    const [isCreatePin, setIsCreatePin] = useState<boolean>(false);

    return (
        <div
            className={`${styles.window} ${isClosing ? styles.shopClosing : ""}`}
            onClick={(e) => e.stopPropagation()}
        >
            {isCreatePin ? (
                <CreatePin
                    onSubmit={(comment) => {
                        onCreatePin(comment);
                        setIsCreatePin(false);
                    }}
                />
            ) : (
                <ShopDetail
                    place={place}
                    onClose={onClose}
                    isCreatePin={() => setIsCreatePin(true)}
                />
            )}
        </div>
    );
};

export default Window;
