import { useEffect, useRef } from "react";

export const useMapInitialization = (
    onMapClick: (placeId: string, service: google.maps.places.PlacesService) => void,
    onBackgroundClick: () => void
) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

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
            placesServiceRef.current = service;

            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                const placeId = (e as google.maps.MapMouseEvent & { placeId?: string }).placeId;
                if (!placeId) {
                    onBackgroundClick();
                    return;
                }

                e.stop();
                onMapClick(placeId, service);
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

    return { mapRef, mapInstanceRef, placesServiceRef };
};
