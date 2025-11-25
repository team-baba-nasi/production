"use client";
import { useState } from "react";
import styles from "../styles/map.module.scss";
import Window from "./Window";
import "@/features/map/styles/customPin.scss";
import { useCreatePin } from "@/features/map/hooks/useCreatePin";
import { usePins } from "../hooks/usePins";
import { useQueryClient } from "@tanstack/react-query";
import { useMapInitialization } from "../hooks/useMapInitialization";
import { useMarkerManager } from "../hooks/useMarkerManager";
import { usePlaceDetails } from "../hooks/usePlaceDetails";
import { useExistingPins } from "../hooks/useExistingPins";

const GoogleMap = () => {
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const queryClient = useQueryClient();
    const { mutate: createPinMutation } = useCreatePin();
    const { data: pinsData } = usePins();
    const { fetchPlaceDetails, isRestaurant } = usePlaceDetails();

    const handleMapClick = (placeId: string, service: google.maps.places.PlacesService) => {
        fetchPlaceDetails(service, placeId, (placeDetails) => {
            if (isRestaurant(placeDetails)) {
                setSelectedPlace(placeDetails);
                setIsClosing(false);
            } else if (selectedPlace) {
                handleClose();
            }
        });
    };

    const handleBackgroundClick = () => {
        if (selectedPlace) handleClose();
    };

    const { mapRef, mapInstanceRef, placesServiceRef } = useMapInitialization(
        handleMapClick,
        handleBackgroundClick
    );

    const { clearMarkers, addMarker } = useMarkerManager(mapInstanceRef);

    const handlePinClick = (
        placeId: string | undefined,
        fallbackPlace?: google.maps.places.PlaceResult
    ) => {
        if (placeId && placesServiceRef.current) {
            fetchPlaceDetails(
                placesServiceRef.current,
                placeId,
                (placeDetails) => {
                    setSelectedPlace(placeDetails);
                    setIsClosing(false);
                },
                () => {
                    if (fallbackPlace) {
                        setSelectedPlace(fallbackPlace);
                        setIsClosing(false);
                    }
                }
            );
        } else if (fallbackPlace) {
            setSelectedPlace(fallbackPlace);
            setIsClosing(false);
        }
    };

    useExistingPins(
        pinsData,
        placesServiceRef.current,
        clearMarkers,
        addMarker,
        fetchPlaceDetails,
        handlePinClick
    );

    const handleCreatePin = (comment: string) => {
        if (!selectedPlace?.geometry?.location) {
            console.error("selectedPlaceにgeometry情報がありません");
            return;
        }

        const lat = selectedPlace.geometry.location.lat();
        const lng = selectedPlace.geometry.location.lng();

        createPinMutation(
            {
                place_name: selectedPlace.name || "不明な店舗",
                place_address: selectedPlace.vicinity,
                latitude: lat,
                longitude: lng,
                comment: comment || undefined,
                place_id: selectedPlace.place_id,
                status: "open",
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["pins"] });
                    handleClose();
                },
                onError: (error) => {
                    console.error("ピン作成エラー:", error);
                    alert("ピンの作成に失敗しました");
                },
            }
        );
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedPlace(null);
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className={styles.wrap}>
            <div ref={mapRef} className={styles.map} />

            {selectedPlace && (
                <Window
                    place={selectedPlace}
                    isClosing={isClosing}
                    onClose={handleClose}
                    onCreatePin={handleCreatePin}
                />
            )}
        </div>
    );
};

export default GoogleMap;
