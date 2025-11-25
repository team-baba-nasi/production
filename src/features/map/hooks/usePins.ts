import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { GetPinsError, GetPinsResponse } from "../types/map";

export function usePins() {
    return useQuery<GetPinsResponse, AxiosError<GetPinsError>>({
        queryKey: ["pins"],
        queryFn: async () => {
            const res = await axios.get("/maps/pins");
            return res.data;
        },
    });
}
