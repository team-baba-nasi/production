"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { AddFavoritePinPayload, AddFavoritePinResponse, AddFavoritePinError } from "../types/map";

export function useAddFavoritePin() {
    return useMutation<
        AddFavoritePinResponse,
        AxiosError<AddFavoritePinError>,
        AddFavoritePinPayload
    >({
        mutationFn: async (form) => {
            const res = await axios.post("/users/favorites", form);
            return res.data;
        },
    });
}
