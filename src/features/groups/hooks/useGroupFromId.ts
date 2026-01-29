import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { GroupResponse, GroupsError } from "@/features/groups/types/group";

export function useGroupFromId(groupId: number) {
    return useQuery<GroupResponse, AxiosError<GroupsError>>({
        queryKey: ["group", groupId],
        queryFn: async () => {
            const res = await axios.get<GroupResponse>(`/groups/${groupId}`);
            return res.data;
        },
    });
}
