import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { UpdateAdminParams, UpdateAdminError, UpdateAdminResponse } from "../types/group";

export function useUpdateGroupAdmin() {
    return useMutation<UpdateAdminResponse, AxiosError<UpdateAdminError>, UpdateAdminParams>({
        mutationFn: async ({ groupId, adminUserIds }) => {
            const res = await axios.post<UpdateAdminResponse>(`/groups/${groupId}/members/role`, {
                adminUserIds,
            });
            return res.data;
        },
    });
}
