import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { RemoveMemberError, RemoveMemberResponse } from "../types/group";

export function useRemoveGroupMember(groupId: number) {
    return useMutation<RemoveMemberResponse, AxiosError<RemoveMemberError>, number>({
        mutationFn: async (userId: number) => {
            const res = await axios.delete(`/groups/${groupId}`, {
                data: { user_id: userId },
            });
            return res.data;
        },
    });
}
