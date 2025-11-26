import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { GetPinsError, GetPinsResponse } from "../types/map";

type UsePinsOptions = {
    scope?: "mine";
    groupId?: number;
};

export function usePins(options?: UsePinsOptions) {
    const params = new URLSearchParams();

    if (options?.scope) {
        params.append("scope", options.scope);
    }

    if (options?.groupId !== undefined) {
        params.append("group_id", options.groupId.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/maps/pins?${queryString}` : "/maps/pins";

    return useQuery<GetPinsResponse, AxiosError<GetPinsError>>({
        queryKey: ["pins", options?.scope, options?.groupId],
        queryFn: async () => {
            const res = await axios.get(url);
            return res.data;
        },
    });
}
