import { useEffect } from "react";
import type { PinsResponse, MarkerPinData } from "../types/map";

export const useExistingPins = (
    pinsData: PinsResponse | undefined,
    placesService: google.maps.places.PlacesService | null,
    clearMarkers: () => void,
    addMarker: (pin: MarkerPinData, onClick: () => void) => Promise<void>,
    fetchPlaceDetails: (
        service: google.maps.places.PlacesService,
        placeId: string,
        onSuccess: (place: google.maps.places.PlaceResult) => void,
        onError?: () => void
    ) => void,
    onPinClick: (
        placeId: string | undefined,
        fallbackPlace?: google.maps.places.PlaceResult
    ) => void
) => {
    useEffect(() => {
        const loadExistingPins = async () => {
            if (!pinsData?.pins || !placesService) return;

            clearMarkers();

            // 全てのピンを順番に処理
            for (const pin of pinsData.pins) {
                if (!pin.latitude || !pin.longitude) continue;

                if (pin.place_id) {
                    await new Promise<void>((resolve) => {
                        fetchPlaceDetails(
                            placesService,
                            pin.place_id!,
                            async (placeDetails) => {
                                await addMarker(
                                    {
                                        lat: Number(pin.latitude),
                                        lng: Number(pin.longitude),
                                        comment: pin.comment ?? undefined,
                                        place: placeDetails,
                                        placeName: placeDetails.name,
                                        placeId: pin.place_id ?? undefined,
                                    },
                                    () => onPinClick(pin.place_id ?? undefined, placeDetails)
                                );
                                resolve();
                            },
                            async () => {
                                await addMarker(
                                    {
                                        lat: Number(pin.latitude),
                                        lng: Number(pin.longitude),
                                        comment: pin.comment ?? undefined,
                                        placeName: pin.place_name,
                                        placeId: pin.place_id ?? undefined,
                                    },
                                    () => onPinClick(pin.place_id ?? undefined)
                                );
                                resolve();
                            }
                        );
                    });
                } else {
                    await addMarker(
                        {
                            lat: Number(pin.latitude),
                            lng: Number(pin.longitude),
                            comment: pin.comment ?? undefined,
                            placeName: pin.place_name,
                        },
                        () => onPinClick(undefined)
                    );
                }
            }
        };

        loadExistingPins();
    }, [pinsData, placesService, clearMarkers, addMarker, fetchPlaceDetails, onPinClick]);
};
