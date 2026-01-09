"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { GetFavoriteError, GetFavoriteResponse } from "../types/map";

export function useFavorite() {
    return useQuery<GetFavoriteResponse, AxiosError<GetFavoriteError>>({
        queryKey: ["favorites"],
        queryFn: async () => {
            const res = await axios.get("/users/favorites");
            return res.data;
        },
    });
}
