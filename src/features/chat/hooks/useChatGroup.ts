import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { ChatGroupListResponse, ChatsError } from "../types/chat";

export function useChatGroup() {
    return useQuery<ChatGroupListResponse, AxiosError<ChatsError>>({
        queryKey: ["chats"],
        queryFn: async () => {
            const res = await axios.get<ChatGroupListResponse>("/chats");
            return res.data;
        },
    });
}
