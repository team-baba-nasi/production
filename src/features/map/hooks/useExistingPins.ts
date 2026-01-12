import { useEffect, useRef } from "react";
import type { GetPinsResponse, MarkerPinData } from "../types/map";

export const useExistingPins = (
    normalizedPins: GetPinsResponse | undefined,
    placesService: google.maps.places.PlacesService | null,
    isMapReady: boolean,
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
    const effectIdRef = useRef(0);

    useEffect(() => {
        if (!isMapReady || !normalizedPins?.pins || !placesService) {
            return;
        }

        effectIdRef.current += 1;
        const currentEffectId = effectIdRef.current;

        const load = async () => {
            clearMarkers();

            for (const pin of normalizedPins.pins) {
                if (effectIdRef.current !== currentEffectId) return;

                if (pin.latitude == null || pin.longitude == null) continue;

                const lat = Number(pin.latitude);
                const lng = Number(pin.longitude);
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

                const placeId = typeof pin.place_id === "string" ? pin.place_id : undefined;

                if (placeId) {
                    await new Promise<void>((resolve) => {
                        fetchPlaceDetails(
                            placesService,
                            placeId,
                            async (place) => {
                                if (effectIdRef.current !== currentEffectId) {
                                    resolve();
                                    return;
                                }

                                await addMarker(
                                    {
                                        lat,
                                        lng,
                                        comment: pin.comment ?? undefined,
                                        place: place,
                                        placeName: place.name,
                                        placeId,
                                    },
                                    () => onPinClick(placeId, place)
                                );
                                resolve();
                            },
                            async () => {
                                await addMarker(
                                    {
                                        lat,
                                        lng,
                                        comment: pin.comment ?? undefined,
                                        placeName: pin.place_name,
                                        placeId,
                                    },
                                    () => onPinClick(placeId)
                                );
                                resolve();
                            }
                        );
                    });
                } else {
                    await addMarker(
                        {
                            lat,
                            lng,
                            comment: pin.comment ?? undefined,
                            placeName: pin.place_name,
                        },
                        () => onPinClick(undefined)
                    );
                }
            }
        };

        load();

        return () => {
            effectIdRef.current += 1;
        };
    }, [
        isMapReady,
        normalizedPins,
        placesService,
        clearMarkers,
        addMarker,
        fetchPlaceDetails,
        onPinClick,
    ]);
};
