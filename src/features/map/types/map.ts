//////////////////////////////////////////////////////////
// User
//////////////////////////////////////////////////////////

export type PinUser = {
    id: number;
    username: string;
    profile_image_url: string;
};

//////////////////////////////////////////////////////////
// Group
//////////////////////////////////////////////////////////

export type PinGroup = {
    id: number;
    name: string;
};

export type PinGroupRelation = {
    group: PinGroup;
};

//////////////////////////////////////////////////////////
// Schedule
//////////////////////////////////////////////////////////

export type Schedule = {
    id: number;
    date: string; // YYYY-MM-DD
    start_at: string | null; // ISO
    end_at: string | null; // ISO
};

//////////////////////////////////////////////////////////
// Reaction
//////////////////////////////////////////////////////////

export type PinReaction = {
    id: number;
    reaction_type: string;
    user: PinUser;
};

//////////////////////////////////////////////////////////
// Status
//////////////////////////////////////////////////////////

export type PinStatus = "open" | "scheduled" | "closed" | "cancelled";

//////////////////////////////////////////////////////////
// Pin
//////////////////////////////////////////////////////////

export type Pin = {
    id: number;
    place_id: string | null;
    place_name: string;
    place_address: string | null;
    latitude: string | null;
    longitude: string | null;
    comment: string | null;
    status: PinStatus;
    created_at: string; // ISO 8601
    updated_at: string; // ISO 8601
    user: PinUser;
    pin_groups: PinGroupRelation[];
    reactions: PinReaction[];
    schedules: Schedule[];
};

//////////////////////////////////////////////////////////
// Map / Marker
//////////////////////////////////////////////////////////

export interface PinData {
    latitude: string | number | null;
    longitude: string | number | null;
    place_id?: string | null;
    place_name: string;
    comment?: string | null;
}

export interface MarkerPinData {
    lat: number;
    lng: number;
    comment?: string;
    place?: google.maps.places.PlaceResult;
    placeName?: string;
    placeId?: string;
}

//////////////////////////////////////////////////////////
// Get Pins
//////////////////////////////////////////////////////////

export interface GetPinsResponse {
    pins: Pin[];
}

export interface GetPinsError {
    error: string;
    details?: Array<{
        field: string | number;
        message: string;
    }>;
}

//////////////////////////////////////////////////////////
// Create Pin
//////////////////////////////////////////////////////////

export interface CreatePinPayload {
    group_ids: number[];
    place_id?: string;
    place_name: string;
    place_address?: string;
    latitude?: number;
    longitude?: number;
    comment?: string;
    schedule?: {
        date: string; // YYYY-MM-DD
        start_time?: string; // HH:mm
        end_time?: string; // HH:mm
    };
    status?: PinStatus;
}

export interface CreatePinResponse {
    pin: {
        id: number;
        place_name: string;
        place_address: string | null;
        latitude: number | null;
        longitude: number | null;
        comment: string | null;
        status: PinStatus;
        created_at: string;
        updated_at: string;
        user: {
            id: number;
            username: string;
        };
        pin_groups: {
            group: {
                id: number;
                name: string;
            };
        }[];
        schedules: Schedule[];
    };
}

export interface CreatePinError {
    error: string;
}

//////////////////////////////////////////////////////////
// Reaction
//////////////////////////////////////////////////////////

export interface CreateReactionPayload {
    pin_id: number;
}

export interface CreateReactionResponse {
    id: number;
    pin_id: number;
    user_id: number;
    reaction_type: string;
    created_at: string;
}

export interface CreateReactionError {
    error: string;
}

//////////////////////////////////////////////////////////
// ScheduleJoin
//////////////////////////////////////////////////////////

export type ResponseType = "going" | "maybe" | "not_going";

export interface JoinScheduleParams {
    schedule_id: number;
    response_type: ResponseType;
    available_dates?: string[];
    comment?: string;
}

export interface ScheduleResponse {
    id: number;
    schedule_id: number;
    user_id: number;
    response_type: string;
    available_dates: string[] | null;
    comment: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        username: string;
        profile_image_url: string | null;
    };
}

export interface JoinScheduleResponse {
    message: string;
    scheduleResponse: ScheduleResponse;
    chatRoom: {
        id: number;
        uuid: string;
    } | null;
}

export interface ScheduleResponsesData {
    responses: ScheduleResponse[];
}

export interface ScheduleJoinError {
    error: string;
    details?: Array<{
        field: string;
        message: string;
    }>;
}

//////////////////////////////////////////////////////////
// FavoritePlace
//////////////////////////////////////////////////////////
export interface FavoritePin {
    id: number;
    place_id: string | null;
    place_name: string;
    place_address: string | null;
    latitude: string | null;
    longitude: string | null;
    created_at: string;
    updated_at: string;
}

export interface AddFavoriteResponse {
    pin: FavoritePin;
}

export interface GetFavoriteResponse {
    pins: FavoritePin[];
}

export interface GetFavoriteError {
    error: string;
}

export type UnifiedPinResponse = GetPinsResponse | GetFavoriteResponse;

//////////////////////////////////////////////////////////
// Add Favorite
//////////////////////////////////////////////////////////

export interface AddFavoritePinPayload {
    place_id?: string;
    place_name: string;
    place_address?: string;
    latitude?: number;
    longitude?: number;
}

export interface AddFavoritePinResponse {
    pin: {
        id: number;
        place_name: string;
        place_address: string | null;
        latitude: string | null;
        longitude: string | null;
        created_at: string;
        updated_at: string;
    };
}

export interface AddFavoritePinError {
    error: string;
    details?: Array<{
        field: string;
        message: string;
    }>;
}

//////////////////////////////////////////////////////////
// Delete Favorite
//////////////////////////////////////////////////////////

export interface DeleteFavoritePinResponse {
    success: boolean;
}

export interface DeleteFavoritePinError {
    error: string;
}
