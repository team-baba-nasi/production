export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    profile_image_url: string | null;
}

export interface CurrentUserResponse {
    user: User | null;
}

export interface CurrentUserError {
    error: string;
}
