import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { CreateReactionError, CreateReactionPayload, CreateReactionResponse } from "../types/map";

export function useCreateReaction() {
    return useMutation<
        CreateReactionResponse,
        AxiosError<CreateReactionError>,
        CreateReactionPayload
    >({
        mutationFn: async (form) => {
            const res = await axios.post("/maps/reactions", form);
            return res.data;
        },
    });
}
