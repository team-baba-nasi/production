import styles from "../styles/Window.module.scss";
import { useState } from "react";
import ShopDetail from "./ShopDetail";
import CreatePin from "./CreatePin";
import { GetPinsResponse } from "../types/map";
import Image from "next/image";
import MapDialog from "./MapDialog";

type WindowProps = {
    place: google.maps.places.PlaceResult;
    isClosing: boolean;
    onClose: () => void;
    onCreatePin: (comment: string) => void;
    pinsData: GetPinsResponse | undefined;
};

const Window: React.FC<WindowProps> = ({ place, isClosing, onClose, onCreatePin, pinsData }) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isCreatePin, setIsCreatePin] = useState<boolean>(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // この店舗のピン一覧を取得
    const matchingPins = pinsData?.pins.filter((pin) => pin.place_id === place.place_id) || [];

    return (
        <>
            {/* ピン一覧 */}
            <div className={styles.wrap}>
                {matchingPins.length > 0 && (
                    <div className={styles.pinsList}>
                        {matchingPins.map((pin) => (
                            <div key={pin.id}>
                                <button className={styles.pinItem} onClick={handleOpenDialog}>
                                    <Image
                                        src={pin.user.profile_image_url}
                                        alt="ユーザーアイコン"
                                        width={58}
                                        height={58}
                                        className="rounded-full"
                                    />
                                </button>
                                {openDialog && (
                                    <MapDialog pin={pin} handleClose={handleCloseDialog} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <div
                    className={`${styles.window} ${isClosing ? styles.shopClosing : ""}`}
                    onClick={(e) => e.stopPropagation()}
                >
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
            </div>
        </>
    );
};

export default Window;
