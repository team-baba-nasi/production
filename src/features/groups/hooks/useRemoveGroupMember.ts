import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { RemoveMemberError, RemoveMemberResponse } from "../types/group";

export function useRemoveGroupMember(groupId: number | undefined) {
    return useMutation<RemoveMemberResponse, AxiosError<RemoveMemberError>, number>({
        mutationFn: async (userId: number) => {
            if (!groupId) {
                throw new Error("グループIDが無効です");
            }

            const res = await axios.delete(`/groups/${groupId}/members`, {
                data: { user_id: userId },
            });

            return res.data;
        },
    });
}
