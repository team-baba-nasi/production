import styles from "../styles/Window.module.scss";
import { useState } from "react";
import ShopDetail from "./ShopDetail";
import CreatePin from "./CreatePin";
import { GetPinsResponse } from "../types/map";
import Image from "next/image";
import buildJapaneseAddress from "../utils/BuildJapaneseAddress";
import CreatePinButton from "./CreatePinBtn";
import PinList from "./PinList";
import { useAddFavoritePin } from "../hooks/useAddFavoritePin";
import { useDeleteFavoritePin } from "../hooks/useDeleteFavoritePin";
import { useQueryClient } from "@tanstack/react-query";
import { FaHeart } from "react-icons/fa";
import clsx from "clsx";

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
    normalizedPin: GetPinsResponse | undefined;
};

const Window: React.FC<WindowProps> = ({ place, isClosing, onCreatePin, normalizedPin }) => {
    const [windowMode, setWindowMode] = useState<WindowMode>("home");
    const { postalCode, address } = buildJapaneseAddress(place);

    const queryClient = useQueryClient();
    const { mutate: addFavorite } = useAddFavoritePin();
    const { mutate: deleteFavorite } = useDeleteFavoritePin();

    const matchingPins = normalizedPin?.pins.filter((pin) => pin.place_id === place.place_id) ?? [];

    // このお店が既にお気に入りかチェック
    const isFavorite = matchingPins.length > 0;
    const favoritePin = matchingPins[0];

    const handleFavoriteToggle = () => {
        if (isFavorite && favoritePin) {
            deleteFavorite(favoritePin.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["favorites"] });
                },
                onError: (error) => {
                    console.error("お気に入り削除エラー:", error);
                    alert("お気に入りの削除に失敗しました");
                },
            });
        } else {
            addFavorite(
                {
                    place_id: place.place_id,
                    place_name: place.name || "不明な店舗",
                    place_address: place.vicinity,
                    latitude: place.geometry?.location?.lat(),
                    longitude: place.geometry?.location?.lng(),
                },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["favorites"] });
                    },
                    onError: (error) => {
                        console.error("お気に入り追加エラー:", error);
                        alert("お気に入りの追加に失敗しました");
                    },
                }
            );
        }
    };

    return (
        <div className={styles.wrap}>
            <div
                className={`${styles.window} ${isClosing ? styles.shopClosing : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {windowMode === "home" && (
                    <div className={styles.windowHome}>
                        <div className={styles.shopPreview}>
                            <button
                                className={clsx(styles.favoriteBtn, isFavorite && styles.selected)}
                                onClick={handleFavoriteToggle}
                            >
                                <FaHeart
                                    color={isFavorite ? "red" : "gray"}
                                    size={26}
                                    className={styles.heart}
                                />
                            </button>
                            {place.photos && (
                                <button onClick={() => setWindowMode("detail")}>
                                    <Image
                                        src={place.photos[0].getUrl({ maxWidth: 400 })}
                                        alt={place.name ?? "restaurant photo"}
                                        width={400}
                                        height={250}
                                        className={styles.restaurantPhoto}
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
                            <button
                                className={styles.windowChangeBtn}
                                onClick={() => setWindowMode("pinList")}
                            >
                                <p className="text_sub">友達の行きたいピンを見る</p>
                            </button>
                        </div>
                        <CreatePinButton onClick={() => setWindowMode("createPin")} />
                    </div>
                )}
                {windowMode === "pinList" && (
                    <PinList onClose={() => setWindowMode("home")} pins={matchingPins} />
                )}

                {windowMode === "detail" && (
                    <ShopDetail place={place} onClose={() => setWindowMode("home")} />
                )}

                {windowMode === "createPin" && (
                    <CreatePin
                        onSubmit={(payload) => {
                            onCreatePin(payload);
                            setWindowMode("home");
                        }}
                        onClose={() => setWindowMode("home")}
                    />
                )}
            </div>
        </div>
    );
};

export default Window;
