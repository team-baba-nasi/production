import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { JoinGroupResponse, JoinGroupError } from "@/features/groups/types/group";

export function useJoinGroup() {
    return useMutation<JoinGroupResponse, AxiosError<JoinGroupError>, { token: string }>({
        mutationFn: async ({ token }) => {
            const res = await axios.post(`/groups/invite/${token}/join`);
            return res.data;
        },
    });
}
