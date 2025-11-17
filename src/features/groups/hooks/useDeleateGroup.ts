import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { ArchiveGroupResponse, ArchiveGroupError } from "../types/group";

export function useArchiveGroup(groupId: number) {
    return useMutation<ArchiveGroupResponse, AxiosError<ArchiveGroupError>>({
        mutationFn: async () => {
            const res = await axios.delete(`/groups/${groupId}`);
            return res.data;
        },
    });
}
