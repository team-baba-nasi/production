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
