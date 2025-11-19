import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { GroupsResponse, GroupsError } from "@/features/groups/types/group";

export function useGroups() {
    return useQuery<GroupsResponse, AxiosError<GroupsError>>({
        queryKey: ["groups"],
        queryFn: async () => {
            const res = await axios.get<GroupsResponse>("/groups");
            return res.data;
        },
    });
}
