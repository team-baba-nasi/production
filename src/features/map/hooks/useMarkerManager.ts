import React from "react";
import { useRef, useCallback } from "react";
import { createCustomPin } from "@/features/map/utils/CreateCustomPin";

export const useMarkerManager = (
    mapInstanceRef: React.MutableRefObject<google.maps.Map | null>,
    selectedPlaceId: string | null
) => {
    const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

    const clearMarkers = useCallback(() => {
        markersRef.current.forEach((marker) => {
            marker.map = null;
        });
        markersRef.current.clear();
    }, []);

    const addMarker = useCallback(
        async (
            pin: {
                lat: number;
                lng: number;
                comment?: string;
                place?: google.maps.places.PlaceResult;
                placeName?: string;
                placeId?: string;
            },
            onClick: () => void
        ) => {
            if (!mapInstanceRef.current || !pin.placeId) return;

            const name = pin.place?.name || pin.placeName || "不明な店舗";
            const photoUrl =
                pin.place?.photos?.[0]?.getUrl?.({ maxWidth: 100, maxHeight: 100 }) ||
                "https://picsum.photos/100/100";

            const isSelected = selectedPlaceId === pin.placeId;

            const { AdvancedMarkerElement } = (await google.maps.importLibrary(
                "marker"
            )) as google.maps.MarkerLibrary;

            const pinContent = createCustomPin(photoUrl, name, pin.placeId, isSelected);

            const marker = new AdvancedMarkerElement({
                position: { lat: pin.lat, lng: pin.lng },
                map: mapInstanceRef.current,
                content: pinContent,
            });

            marker.addListener("click", onClick);
            markersRef.current.set(pin.placeId, marker);
        },
        [mapInstanceRef, selectedPlaceId]
    );

    // selectedPlaceIdが変更されたら、すべてのピンのラベル状態を更新
    const updatePinLabels = useCallback(() => {
        markersRef.current.forEach((marker, placeId) => {
            const content = marker.content as HTMLElement;
            const label = content.querySelector(".pin-label") as HTMLElement;

            if (placeId === selectedPlaceId) {
                content.classList.add("open");
                if (label) {
                    label.style.maxWidth = "max-content";
                    label.style.opacity = "1";
                }
            } else {
                content.classList.remove("open");
                if (label) {
                    label.style.maxWidth = "0";
                    label.style.opacity = "0";
                }
            }
        });
    }, [selectedPlaceId]);

    // selectedPlaceIdが変わったらラベルを更新
    React.useEffect(() => {
        updatePinLabels();
    }, [selectedPlaceId, updatePinLabels]);

    return { clearMarkers, addMarker };
};
