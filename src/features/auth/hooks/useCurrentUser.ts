import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { CurrentUserResponse, CurrentUserError } from "@/features/auth/types/user";

export function useCurrentUser() {
    return useQuery<CurrentUserResponse, AxiosError<CurrentUserError>>({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const res = await axios.get<CurrentUserResponse>("/auth/me");
            return res.data;
        },
    });
}
