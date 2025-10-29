"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/map.module.scss";
import Image from "next/image";

const GoogleMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current || mapInstanceRef.current) return;

            const center = { lat: 35.6812, lng: 139.7671 };

            const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
            const { PlacesService } = (await google.maps.importLibrary(
                "places"
            )) as google.maps.PlacesLibrary;
            // const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            //     "marker"
            // )) as google.maps.MarkerLibrary;

            const map = new Map(mapRef.current, {
                zoom: 13,
                center,
                mapId: "DEMO_MAP_ID",
            });

            const service = new PlacesService(map);

            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const latLng = e.latLng;
                if (!latLng || !mapRef.current) return;

                /* ピン追加処理

                // 新しいマーカーを作成
                const marker = new AdvancedMarkerElement({
                    position: e.latLng,
                    map,
                });

                markersRef.current.push(marker);
                */

                // 📍 クリックした地点の近くの飲食店を検索
                const request: google.maps.places.PlaceSearchRequest = {
                    location: latLng,
                    radius: 500, // 半径500m以内
                    type: "restaurant",
                    rankBy: undefined, // radius指定時はrankByは使わない
                };

                service.nearbySearch(request, (results, status) => {
                    if (status !== google.maps.places.PlacesServiceStatus.OK || !results) return;

                    // 最も近い店（results[0]）を取得
                    const nearest = results[0];
                    if (!nearest?.place_id) return;

                    // 📘 詳細情報を取得
                    service.getDetails(
                        {
                            placeId: nearest.place_id,
                            fields: [
                                "name",
                                "vicinity",
                                "rating",
                                "user_ratings_total",
                                "opening_hours",
                                "photos",
                                "reviews",
                            ],
                        },
                        (placeDetails, detailStatus) => {
                            if (
                                detailStatus === google.maps.places.PlacesServiceStatus.OK &&
                                placeDetails
                            ) {
                                setSelectedPlace(placeDetails);
                            }
                        }
                    );
                });
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

            {/* 店舗詳細表示エリア */}
            <div className={styles.shop}>
                {!selectedPlace ? (
                    <p className="text-gray-500 text-sm">
                        地図をクリックすると最寄りの飲食店が表示されます。
                    </p>
                ) : (
                    <div className={styles.content}>
                        <div className={styles.shop_header}>
                            <h3>{selectedPlace.name}</h3>
                            <div className={styles.header_buttons}>
                                <button className={styles.add_btn}>
                                    <span className={styles.addIcon}>○</span>追加
                                </button>
                                <button className={styles.close_btn}>×</button>
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
                                        {/* {selectedPlace.opening_hours.weekday_text.map((t, i) => (
                                            <li key={i}>{t}</li>
                                            ))} */}
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
                )}
            </div>
        </div>
    );
};

export default GoogleMap;
