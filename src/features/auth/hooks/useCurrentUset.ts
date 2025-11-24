import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCurrentUser() {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const res = await axios.get("/api/auth/me");
            return res.data.user;
        },
    });
}
