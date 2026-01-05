import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { SendMessageResponse, SendMessageError, SendMessageForm } from "../types/chat";

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation<SendMessageResponse, AxiosError<SendMessageError>, SendMessageForm>({
        mutationFn: async (form) => {
            const res = await axios.post(`/chats/${form.chatRoomUuid}`, form);
            return res.data;
        },
        onSuccess: (data, variables) => {
            // メッセージ一覧のキャッシュを無効化して再取得
            queryClient.invalidateQueries({
                queryKey: ["chatMessages", variables.chatRoomUuid],
            });
            // チャットグループ一覧のキャッシュも無効化
            queryClient.invalidateQueries({
                queryKey: ["chatGroups"],
            });
        },
    });
}
