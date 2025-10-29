"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/map.module.scss";
import Image from "next/image";

const GoogleMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedPlace(null);
            setIsClosing(false);
        }, 300);
    };
    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current || mapInstanceRef.current) return;

            const center = { lat: 35.6812, lng: 139.7671 };

            const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
            const { PlacesService } = (await google.maps.importLibrary(
                "places"
            )) as google.maps.PlacesLibrary;

            const map = new Map(mapRef.current, {
                zoom: 13,
                center,
                mapId: "DEMO_MAP_ID",
            });

            const service = new PlacesService(map);

            // 地図上のクリックイベント（店舗をクリックした時）
            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const placeId = e.placeId;

                if (!placeId) {
                    if (selectedPlace) {
                        handleClose();
                    }
                    return;
                }

                e.stop();

                // クリックした店舗の詳細情報を取得
                service.getDetails(
                    {
                        placeId: placeId,
                        fields: [
                            "name",
                            "vicinity",
                            "rating",
                            "user_ratings_total",
                            "opening_hours",
                            "photos",
                            "reviews",
                            "types",
                        ],
                    },
                    (placeDetails, detailStatus) => {
                        if (
                            detailStatus === google.maps.places.PlacesServiceStatus.OK &&
                            placeDetails
                        ) {
                            // 飲食店かどうかをチェック
                            const isRestaurant = placeDetails.types?.some((type) =>
                                [
                                    "restaurant",
                                    "cafe",
                                    "food",
                                    "bar",
                                    "meal_takeaway",
                                    "meal_delivery",
                                ].includes(type)
                            );

                            if (isRestaurant) {
                                setSelectedPlace(placeDetails);
                                setIsClosing(false);
                            } else {
                                // 飲食店以外の場合は表示しない
                                if (selectedPlace) {
                                    handleClose();
                                }
                            }
                        }
                    }
                );
            });

            mapInstanceRef.current = map;
        };

        const existingScript = document.getElementById("googleMapsScript");

        if (!existingScript) {
            const script = document.createElement("script");
            script.id = "googleMapsScript";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
            script.async = true;
            script.defer = true;
            script.onload = () => initMap();
            document.head.appendChild(script);
        } else if (window.google?.maps) {
            initMap();
        }
    }, []);

    return (
        <div className={styles.wrap}>
            {/* 地図 */}
            <div ref={mapRef} className={styles.map} />

            {/* オーバーレイ - 店舗詳細ウィンドウ外をクリックで閉じる */}
            {selectedPlace && (
                <div
                    className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
                    onClick={handleClose}
                />
            )}

            {/* 店舗詳細表示エリア - 下からスライドイン */}
            {selectedPlace && (
                <div
                    className={`${styles.shop} ${isClosing ? styles.shopClosing : ""}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.content}>
                        <div className={styles.shop_header}>
                            <h3>{selectedPlace.name}</h3>
                            <div className={styles.header_buttons}>
                                <button className={styles.add_btn}>
                                    <span className={styles.addIcon}>○</span>追加
                                </button>
                                <button
                                    className={styles.close_btn}
                                    onClick={() => setSelectedPlace(null)}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className={styles.info}>
                            {selectedPlace.rating && (
                                <p className={styles.rating}>
                                    ★{selectedPlace.rating}（{selectedPlace.user_ratings_total}）
                                </p>
                            )}

                            {selectedPlace.opening_hours?.weekday_text && (
                                <div className={styles.hours}>
                                    <ul>
                                        <li>
                                            営業時間：{selectedPlace.opening_hours.weekday_text[0]}
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {selectedPlace.vicinity && (
                                <p className={styles.vicinity}>{selectedPlace.vicinity}</p>
                            )}
                        </div>

                        {selectedPlace.photos && (
                            <Image
                                src={selectedPlace.photos[0].getUrl({ maxWidth: 400 })}
                                alt={selectedPlace.name ?? "restaurant photo"}
                                width={400}
                                height={250}
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                            />
                        )}
                        {selectedPlace.rating && (
                            <p className={styles.rating_wrap}>
                                口コミ {selectedPlace.user_ratings_total}件
                                <span className={styles.rating_star}>★</span>
                            </p>
                        )}
                        {selectedPlace.reviews?.map((review) => {
                            return (
                                <div key={review.author_name} className={styles.review}>
                                    <div>
                                        <div className="flex gap-2">
                                            <Image
                                                src={review.profile_photo_url}
                                                alt={review.author_name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <p>
                                                {review.author_name}{" "}
                                                <span className="ml-2">
                                                    {review.relative_time_description}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoogleMap;
