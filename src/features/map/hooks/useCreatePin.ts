import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "axios";
import { CreatePinError, CreatePinPayload, CreatePinResponse } from "../types/map";

export function useCreatePin() {
    return useMutation<CreatePinResponse, AxiosError<CreatePinError>, CreatePinPayload>({
        mutationFn: async (form) => {
            const res = await axios.post("/maps/pins", form);
            return res.data;
        },
    });
}
