"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { GetPinsError, GetPinsResponse } from "../types/map";

type UsePinsOptions = {
    groupId: number;
};

export function usePins({ groupId }: UsePinsOptions) {
    return useQuery<GetPinsResponse, AxiosError<GetPinsError>>({
        queryKey: ["pins", groupId],
        queryFn: async () => {
            const res = await axios.get("/maps/pins", {
                params: {
                    group_id: groupId,
                },
            });
            return res.data;
        },
        enabled: Number.isFinite(groupId),
    });
}
