"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/map.module.scss";
import Window from "./Window";
import "@/features/map/styles/customPin.scss";
import { createCustomPin } from "@/features/map/utils/CreateCustomPin";

const GoogleMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    // ピンをマーカーとして地図に表示する関数
    const displayPinOnMap = async (pin: {
        lat: number;
        lng: number;
        comment?: string;
        place?: google.maps.places.PlaceResult;
    }) => {
        if (!mapInstanceRef.current) return;

        const name = pin.place?.name || "不明な店舗";
        const photoUrl =
            pin.place?.photos?.[0]?.getUrl?.({ maxWidth: 100, maxHeight: 100 }) ||
            "/images/map/default.jpg";

        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            "marker"
        )) as google.maps.MarkerLibrary;

        const pinContent = createCustomPin(photoUrl, name);

        const marker = new AdvancedMarkerElement({
            position: { lat: pin.lat, lng: pin.lng },
            map: mapInstanceRef.current,
            content: pinContent,
        });

        // ピンをクリックしたら店舗詳細を表示
        marker.addListener("click", () => {
            if (pin.place) {
                setSelectedPlace(pin.place);
                setIsClosing(false);
            }
        });

        markersRef.current.push(marker);
    };

    const handleCreatePin = (comment: string) => {
        if (!selectedPlace?.geometry?.location) {
            console.error("selectedPlaceにgeometry情報がありません");
            return;
        }

        const lat = selectedPlace.geometry.location.lat();
        const lng = selectedPlace.geometry.location.lng();

        const newPin = {
            lat,
            lng,
            comment,
            place: selectedPlace,
        };

        displayPinOnMap(newPin);

        handleClose();
    };

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

            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const placeId = (e as google.maps.MapMouseEvent & { placeId?: string }).placeId;
                if (!placeId) {
                    if (selectedPlace) handleClose();
                    return;
                }

                e.stop();

                service.getDetails(
                    {
                        placeId,
                        fields: [
                            "name",
                            "vicinity",
                            "rating",
                            "user_ratings_total",
                            "opening_hours",
                            "photos",
                            "reviews",
                            "types",
                            "geometry",
                        ],
                    },
                    (placeDetails, detailStatus) => {
                        if (
                            detailStatus === google.maps.places.PlacesServiceStatus.OK &&
                            placeDetails
                        ) {
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
                            } else if (selectedPlace) {
                                handleClose();
                            }
                        }
                    }
                );
            });

            mapInstanceRef.current = map;
        };

        if (!document.getElementById("googleMapsScript")) {
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
            <div ref={mapRef} className={styles.map} />

            {selectedPlace && (
                <>
                    <Window
                        place={selectedPlace}
                        isClosing={isClosing}
                        onClose={handleClose}
                        onCreatePin={handleCreatePin}
                    />
                </>
            )}
        </div>
    );
};

export default GoogleMap;
