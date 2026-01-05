//////////////////////////////////////////////////////////
// チャットグループ一覧
//////////////////////////////////////////////////////////

export type ChatGroupListResponse = {
    chatGroups: ChatGroupItem[];
};

export type ChatsError = {
    error: string;
};

export type ChatGroupItem = {
    chat_room: ChatRoom;
};

export type ChatRoomResponse = {
    chatRoom: {
        uuid: string;
        room_type: "pin" | "group" | "direct";
        messages: {
            id: number;
            content: string;
            created_at: string;
            message_type: "text";
            sender: {
                id: number;
                username: string;
                profile_image_url: string | null;
            };
        }[];
    };
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

//////////////////////////////////////////////////////////
// メッセージ
//////////////////////////////////////////////////////////

export type ChatMessage = {
    id: number;
    content: string;
    created_at: Date;
    sender: {
        id: number;
        username: string;
    };
};

export type SendMessageForm = {
    chatRoomUuid: string;
    content: string;
    messageType?: string;
    metadata?: Record<string, string | number | boolean | null> | null;
};

export type SendMessageResponse = {
    message: {
        id: number;
        chat_room_id: number;
        sender_id: number;
        content: string;
        message_type: string;
        metadata: Record<string, string | number | boolean | null> | null;
        is_deleted: boolean;
        created_at: string;
        updated_at: string;
        sender: {
            id: number;
            username: string;
            profile_image_url: string | null;
        };
    };
};

export type SendMessageError = {
    error: string;
};

//////////////////////////////////////////////////////////
// 店舗詳細
//////////////////////////////////////////////////////////
export type ConfirmedMeeting = {
    id: number;
    place_name: string;
    place_address: string;
    meeting_date: string;
    meeting_end: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export type ConfirmedMeetingResponse = {
    confirmedMeeting: ConfirmedMeeting;
};

export type ConfirmedMeetingError = {
    error: string;
};
