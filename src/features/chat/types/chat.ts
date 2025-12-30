export type ChatGroupListResponse = {
    chatGroups: ChatGroupItem[];
};

export type ChatsError = {
    error: string;
};

export type ChatGroupItem = {
    chat_room: ChatRoom;
};

export type ChatRoom = {
    id: number;
    uuid: string;
    room_type: string;
    created_at: Date;
    updated_at: Date;
    participants: ChatParticipant[];
    messages: ChatMessage[];
};

export type ChatParticipant = {
    id: number;
    user: {
        id: number;
        username: string;
        profile_image_url: string | null;
    };
};

export type ChatMessage = {
    id: number;
    content: string;
    created_at: Date;
    sender: {
        id: number;
        username: string;
    };
};
