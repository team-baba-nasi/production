import styles from "../styles/Window.module.scss";
import { useState } from "react";
import ShopDetail from "./ShopDetail";
import CreatePin from "./CreatePin";
import { GetPinsResponse } from "../types/map";
import Image from "next/image";
type WindowProps = {
    place: google.maps.places.PlaceResult;
    isClosing: boolean;
    onClose: () => void;
    onCreatePin: (comment: string) => void;
    pinsData: GetPinsResponse | undefined;
};

const Window: React.FC<WindowProps> = ({ place, isClosing, onClose, onCreatePin, pinsData }) => {
    const [isCreatePin, setIsCreatePin] = useState<boolean>(false);

    // この店舗のピン一覧を取得
    const matchingPins = pinsData?.pins.filter((pin) => pin.place_id === place.place_id) || [];

    return (
        <>
            {/* ピン一覧 */}
            <div
                className={`${styles.window} ${isClosing ? styles.shopClosing : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {matchingPins.length > 0 && (
                    <div className={styles.pinsList}>
                        {matchingPins.map((pin) => (
                            <button key={pin.id} className={styles.pinItem}>
                                <Image
                                    src={pin.user.profile_image_url}
                                    alt="ユーザーアイコン"
                                    width={58}
                                    height={58}
                                    className="rounded-full"
                                />
                            </button>
                        ))}
                    </div>
                )}
                {/* ShopDetailまたはCreatePinを表示 */}
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
        </>
    );
};

export default Window;
