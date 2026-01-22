import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import {
    CreateInviteTokenError,
    CreateInviteTokenForm,
    CreateInviteTokenResponse,
} from "../types/group";

export function useCreateInviteToken() {
    return useMutation<
        CreateInviteTokenResponse,
        AxiosError<CreateInviteTokenError>,
        CreateInviteTokenForm
    >({
        mutationFn: async ({ groupId }) => {
            const res = await axios.post(`/groups/${groupId}/invite`);
            return res.data;
        },
    });
}
