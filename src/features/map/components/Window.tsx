import styles from "../styles/Window.module.scss";
import { useState } from "react";
import ShopDetail from "./ShopDetail";
import CreatePin from "./CreatePin";
import { GetPinsResponse } from "../types/map";
import Image from "next/image";

import buildJapaneseAddress from "../utils/BuildJapaneseAddress";
import CreatePinButton from "./CreatePinBtn";

type WindowMode = "detail" | "createPin" | "pinList" | "home";

type CreatePinSubmitPayload = {
    comment: string;
    groupIds: number[];
    schedule?: {
        date: string;
        startTime?: string;
        endTime?: string;
    };
};

type WindowProps = {
    place: google.maps.places.PlaceResult;
    isClosing: boolean;
    onClose: () => void;
    onCreatePin: (payload: CreatePinSubmitPayload) => void;
    pinsData: GetPinsResponse | undefined;
};

const Window: React.FC<WindowProps> = ({ place, isClosing, onClose, onCreatePin, pinsData }) => {
    const [windowMode, setWindowMode] = useState<WindowMode>("home");
    const { postalCode, address } = buildJapaneseAddress(place);

    const matchingPins = pinsData?.pins.filter((pin) => pin.place_id === place.place_id) ?? [];

    return (
        <div className={styles.wrap}>
            <div
                className={`${styles.window} ${isClosing ? styles.shopClosing : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {windowMode === "home" && (
                    <div className={styles.windowHome}>
                        <div className={styles.shopPreview}>
                            <button className={styles.favoriteBtn}>
                                <Image
                                    src="/images/map/heart.svg"
                                    alt="ハートアイコン"
                                    width={33}
                                    height={33}
                                />
                            </button>
                            {place.photos && (
                                <button onClick={() => setWindowMode("detail")}>
                                    <Image
                                        src={place.photos[0].getUrl({ maxWidth: 400 })}
                                        alt={place.name ?? "restaurant photo"}
                                        width={400}
                                        height={250}
                                    />
                                </button>
                            )}
                            <div className={styles.shopTexts}>
                                <h3 className="text_title">{place.name}</h3>
                                <div className={styles.shopAddress}>
                                    {postalCode && (
                                        <p className="text_sub">
                                            〒{postalCode} {address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.windowChangeBtns}>
                            <button
                                className={styles.windowChangeBtn}
                                onClick={() => setWindowMode("detail")}
                            >
                                <p className="text_sub">お店の詳細を見る</p>
                            </button>
                            <button className={styles.windowChangeBtn}>
                                <p className="text_sub">友達の行きたいピンを見る</p>
                            </button>
                        </div>
                        <CreatePinButton onClick={() => setWindowMode("createPin")} />
                    </div>
                )}
                {windowMode === "pinList" && <ShopDetail place={place} onClose={onClose} />}

                {windowMode === "detail" && (
                    <ShopDetail place={place} onClose={() => setWindowMode("home")} />
                )}

                {windowMode === "createPin" && (
                    <CreatePin
                        onSubmit={(payload) => {
                            onCreatePin(payload);
                            setWindowMode("home");
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Window;
