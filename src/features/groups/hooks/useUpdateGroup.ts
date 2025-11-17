import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { UpdateGroupForm, UpdateGroupResponse, UpdateGroupError } from "../types/group";

export function useUpdateGroup(groupId: number) {
    return useMutation<UpdateGroupResponse, AxiosError<UpdateGroupError>, UpdateGroupForm>({
        mutationFn: async (form: UpdateGroupForm) => {
            const res = await axios.put(`/groups/${groupId}`, form);
            return res.data;
        },
    });
}
