"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { DeleteFavoritePinResponse, DeleteFavoritePinError } from "../types/map";

export function useDeleteFavoritePin() {
    return useMutation<DeleteFavoritePinResponse, AxiosError<DeleteFavoritePinError>, number>({
        mutationFn: async (pinId) => {
            const res = await axios.delete(`/users/favorites/${pinId}`);
            return res.data;
        },
    });
}
