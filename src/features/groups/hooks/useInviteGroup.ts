import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { InviteGroupResponse, InviteGroupError } from "@/features/groups/types/group";

export function useInviteGroup(token: string | undefined) {
    return useQuery<InviteGroupResponse, AxiosError<InviteGroupError>>({
        queryKey: ["invite-group", token],
        enabled: !!token, // token がある時だけ実行
        queryFn: async () => {
            const res = await axios.get<InviteGroupResponse>(`/invite/${token}`);
            return res.data;
        },
    });
}
