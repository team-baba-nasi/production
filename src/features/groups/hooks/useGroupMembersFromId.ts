import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { GroupMembersError, GroupMembersResponse } from "@/features/groups/types/group";

export function useGroupMembersFromId(groupId: number) {
    return useQuery<GroupMembersResponse, AxiosError<GroupMembersError>>({
        queryKey: ["groupMembers", groupId],
        queryFn: async () => {
            const res = await axios.get<GroupMembersResponse>(`/groups/${groupId}/members`);
            return res.data;
        },
    });
}
