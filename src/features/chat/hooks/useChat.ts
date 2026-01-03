import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { ChatRoomResponse, ChatsError } from "../types/chat";

export const useChatMessages = (uuid: string) => {
    return useQuery<ChatRoomResponse, AxiosError<ChatsError>>({
        queryKey: ["chat-room", uuid],
        enabled: Boolean(uuid),
        queryFn: async () => {
            const res = await axios.get<ChatRoomResponse>(`/chat/${uuid}`);
            return res.data;
        },
    });
};
