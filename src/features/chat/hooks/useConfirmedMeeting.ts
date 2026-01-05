import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { ConfirmedMeetingError, ConfirmedMeetingResponse } from "../types/chat";

export function useConfirmedMeeting(chatRoomUuid: string) {
    return useQuery<ConfirmedMeetingResponse, AxiosError<ConfirmedMeetingError>>({
        queryKey: ["confirmedMeeting", chatRoomUuid],
        queryFn: async () => {
            const res = await axios.get(`/chats/${chatRoomUuid}/confirmed-meeting`);
            return res.data;
        },
        enabled: !!chatRoomUuid,
    });
}
