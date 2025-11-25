import { useRef, useCallback } from "react";
import { createCustomPin } from "@/features/map/utils/CreateCustomPin";

export const useMarkerManager = (
    mapInstanceRef: React.MutableRefObject<google.maps.Map | null>
) => {
    const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

    const clearMarkers = useCallback(() => {
        markersRef.current.forEach((marker) => {
            marker.map = null;
        });
        markersRef.current = [];
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
            if (!mapInstanceRef.current) return;

            const name = pin.place?.name || pin.placeName || "不明な店舗";
            const photoUrl =
                pin.place?.photos?.[0]?.getUrl?.({ maxWidth: 100, maxHeight: 100 }) ||
                "https://picsum.photos/100/100";

            const { AdvancedMarkerElement } = (await google.maps.importLibrary(
                "marker"
            )) as google.maps.MarkerLibrary;

            const pinContent = createCustomPin(photoUrl, name);

            const marker = new AdvancedMarkerElement({
                position: { lat: pin.lat, lng: pin.lng },
                map: mapInstanceRef.current,
                content: pinContent,
            });

            marker.addListener("click", onClick);
            markersRef.current.push(marker);
        },
        [mapInstanceRef]
    );

    return { clearMarkers, addMarker };
};
