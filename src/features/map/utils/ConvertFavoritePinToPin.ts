import { FavoritePin, Pin, PinStatus } from "../types/map";

export function convertFavoritePinToPin(favoritePin: FavoritePin): Pin {
    return {
        ...favoritePin,
        place_id: favoritePin.place_id,
        comment: null,
        status: "open" as PinStatus,
        user: {
            id: 0,
            username: "自分",
            profile_image_url: "",
        },
        pin_groups: [],
        reactions: [],
        schedules: [],
    };
}
