type PinUser = {
    id: number;
    username: string;
    profile_image_url: string;
};

export interface PinData {
    latitude: string | number | null;
    longitude: string | number | null;
    place_id?: string | null;
    place_name: string;
    comment?: string | null;
}

export interface PinsResponse {
    pins: PinData[];
}

export interface MarkerPinData {
    lat: number;
    lng: number;
    comment?: string;
    place?: google.maps.places.PlaceResult;
    placeName?: string;
    placeId?: string;
}

type PinGroup = {
    id: number;
    name: string;
};

type PinReaction = {
    id: number;
    reaction_type: string;
    user: PinUser;
};

type Pin = {
    id: number;
    place_id: string;
    place_name: string;
    place_address: string | null;
    latitude: string | null;
    longitude: string | null;
    comment: string | null;
    status: string;
    created_at: string; // ISO 8601 形式の日時文字列
    updated_at: string; // ISO 8601 形式の日時文字列
    user: PinUser;
    group: PinGroup | null;
    reactions: PinReaction[];
};

//////////////////////////////////////////////////////////
// ピン作成
//////////////////////////////////////////////////////////

export interface CreatePinPayload {
    group_id?: number;
    place_id?: string;
    place_name: string;
    place_address?: string;
    latitude?: number;
    longitude?: number;
    comment?: string;
    status?: "open" | "scheduled" | "closed" | "cancelled";
}

export interface CreatePinResponse {
    pin: {
        id: number;
        place_name: string;
        place_address?: string | null;
        latitude?: number | null;
        longitude?: number | null;
        comment?: string | null;
        status: string;
        created_at: string;
        updated_at: string;
        user: { id: number; username: string };
        group?: { id: number; name: string } | null;
    };
}
export interface CreatePinError {
    error: string;
}

//////////////////////////////////////////////////////////
// 取得
//////////////////////////////////////////////////////////

// GET /api/pins のレスポンス型
export interface GetPinsResponse {
    pins: Pin[];
}

// エラーレスポンス型
export interface GetPinsError {
    error: string;
    details?: Array<{
        field: string | number;
        message: string;
    }>;
}
