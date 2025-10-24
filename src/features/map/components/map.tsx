"use client";
import { useEffect, useRef } from "react";

const GoogleMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current || mapInstanceRef.current) return;

            const center = { lat: 35.6812, lng: 139.7671 };

            const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
            const { AdvancedMarkerElement } = (await google.maps.importLibrary(
                "marker"
            )) as google.maps.MarkerLibrary;

            const map = new Map(mapRef.current, {
                zoom: 12,
                center,
                mapId: "DEMO_MAP_ID",
            });

            map.addListener("click", (e: google.maps.MapMouseEvent) => {
                if (!e.latLng) return;

                /* ピン追加処理

                // 新しいマーカーを作成
                const marker = new AdvancedMarkerElement({
                    position: e.latLng,
                    map,
                });

                markersRef.current.push(marker);
                */
            });

            mapInstanceRef.current = map;
        };

        const existingScript = document.getElementById("googleMapsScript");

        if (!existingScript) {
            const script = document.createElement("script");
            script.id = "googleMapsScript";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly`;
            script.async = true;
            script.defer = true;
            script.onload = () => initMap();
            document.head.appendChild(script);
        } else if (window.google?.maps) {
            initMap();
        }
    }, []);

    return <div ref={mapRef} className="w-full h-[500px] rounded-2xl shadow-md" />;
};

export default GoogleMap;
