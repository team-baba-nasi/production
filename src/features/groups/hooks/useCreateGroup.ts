import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import {
    CreateGroupForm,
    CreateGroupResponse,
    CreateGroupError,
} from "@/features/groups/types/group";

export function useCreateGroup() {
    return useMutation<CreateGroupResponse, AxiosError<CreateGroupError>, CreateGroupForm>({
        mutationFn: async (form) => {
            const res = await axios.post("/groups", form);
            return res.data;
        },
    });
}
