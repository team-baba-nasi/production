import { useCallback } from "react";

const PLACE_FIELDS = [
    "name",
    "vicinity",
    "rating",
    "user_ratings_total",
    "opening_hours",
    "photos",
    "reviews",
    "types",
    "geometry",
    "place_id",
    "address_components",
] as const;

export const usePlaceDetails = () => {
    const fetchPlaceDetails = useCallback(
        (
            service: google.maps.places.PlacesService,
            placeId: string,
            onSuccess: (place: google.maps.places.PlaceResult) => void,
            onError?: () => void
        ) => {
            service.getDetails(
                {
                    placeId,
                    fields: [...PLACE_FIELDS],
                },
                (placeDetails, detailStatus) => {
                    if (
                        detailStatus === google.maps.places.PlacesServiceStatus.OK &&
                        placeDetails
                    ) {
                        onSuccess(placeDetails);
                    } else {
                        console.warn(`Place Details取得失敗 (${placeId})`);
                        onError?.();
                    }
                }
            );
        },
        []
    );

    const isRestaurant = useCallback((place: google.maps.places.PlaceResult) => {
        return place.types?.some((type) =>
            ["restaurant", "cafe", "food", "bar", "meal_takeaway", "meal_delivery"].includes(type)
        );
    }, []);

    return { fetchPlaceDetails, isRestaurant };
};
