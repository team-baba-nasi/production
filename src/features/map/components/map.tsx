"use client";
import { useState, useCallback } from "react";
import styles from "../styles/map.module.scss";
import Window from "./Window";
import "@/features/map/styles/CustomPin.scss";
import { useCreatePin } from "@/features/map/hooks/useCreatePin";
import { useQueryClient } from "@tanstack/react-query";
import { useMapInitialization } from "../hooks/useMapInitialization";
import { useMarkerManager } from "../hooks/useMarkerManager";
import { usePlaceDetails } from "../hooks/usePlaceDetails";
import { useExistingPins } from "../hooks/useExistingPins";
import { GetPinsResponse } from "../types/map";
import { useGroupId } from "@/features/groups/hooks/useGroupId";

type GoogleMapProps = {
    pinsData: GetPinsResponse | undefined;
};

const GoogleMap = ({ pinsData }: GoogleMapProps) => {
    const groupId = useGroupId();
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isClosing, setIsClosing] = useState(false);

    const queryClient = useQueryClient();
    const { mutate: createPinMutation } = useCreatePin();
    const { fetchPlaceDetails, isRestaurant } = usePlaceDetails();

    const handleMapClick = (placeId: string, service: google.maps.places.PlacesService) => {
        fetchPlaceDetails(service, placeId, (placeDetails) => {
            if (isRestaurant(placeDetails)) {
                setSelectedPlaceId(placeId);
                setSelectedPlace(placeDetails);
                setIsClosing(false);
            } else if (selectedPlaceId) {
                handleClose();
            }
        });
    };

    const handleBackgroundClick = () => {
        if (selectedPlaceId) handleClose();
    };

    const { mapRef, mapInstanceRef, placesServiceRef } = useMapInitialization(
        handleMapClick,
        handleBackgroundClick
    );

    const { clearMarkers, addMarker } = useMarkerManager(mapInstanceRef, selectedPlaceId);

    const handlePinClick = useCallback(
        (placeId: string | undefined, fallbackPlace?: google.maps.places.PlaceResult) => {
            if (placeId === selectedPlaceId) {
                handleClose();
                return;
            }

            if (placeId && placesServiceRef.current) {
                fetchPlaceDetails(
                    placesServiceRef.current,
                    placeId,
                    (placeDetails) => {
                        setSelectedPlaceId(placeId);
                        setSelectedPlace(placeDetails);
                        setIsClosing(false);

                        if (placeDetails?.geometry?.location && mapInstanceRef.current) {
                            const position = placeDetails.geometry.location;
                            mapInstanceRef.current.panTo(position);

                            window.setTimeout(() => {
                                mapInstanceRef.current?.setZoom(17);
                            }, 200);
                        }
                    },
                    () => {
                        if (fallbackPlace) {
                            setSelectedPlaceId(placeId);
                            setSelectedPlace(fallbackPlace);
                            setIsClosing(false);

                            if (fallbackPlace.geometry?.location && mapInstanceRef.current) {
                                const position = fallbackPlace.geometry.location;
                                mapInstanceRef.current.panTo(position);
                                window.setTimeout(() => {
                                    mapInstanceRef.current?.setZoom(17);
                                }, 200);
                            }
                        }
                    }
                );
            } else if (fallbackPlace && placeId) {
                setSelectedPlaceId(placeId);
                setSelectedPlace(fallbackPlace);
                setIsClosing(false);

                if (fallbackPlace.geometry?.location && mapInstanceRef.current) {
                    const position = fallbackPlace.geometry.location;
                    mapInstanceRef.current.panTo(position);
                    window.setTimeout(() => {
                        mapInstanceRef.current?.setZoom(17);
                    }, 200);
                }
            }
        },
        [selectedPlaceId, placesServiceRef, mapInstanceRef, fetchPlaceDetails]
    );

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
                group_id: groupId,
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
                    queryClient.invalidateQueries({ queryKey: ["pins"], exact: false });
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
            setSelectedPlaceId(null);
            setSelectedPlace(null);
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className={styles.wrap}>
            <div ref={mapRef} className={styles.map} />

            {selectedPlace && selectedPlaceId && (
                <Window
                    place={selectedPlace}
                    isClosing={isClosing}
                    onClose={handleClose}
                    onCreatePin={handleCreatePin}
                    pinsData={pinsData}
                />
            )}
        </div>
    );
};

export default GoogleMap;
