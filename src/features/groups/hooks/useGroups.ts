import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

export type Group = {
    id: number;
    name: string;
    description?: string | null;
    icon_image_url?: string | null;
    created_at: string;
    owner: {
        id: number;
        username: string;
    };
    role: string;
};

export type GroupsResponse = {
    groups: {
        role: string;
        group: Group;
    }[];
};

export type GroupsError = {
    error: string;
};

export function useGroups() {
    return useQuery<GroupsResponse, AxiosError<GroupsError>>({
        queryKey: ["groups"],
        queryFn: async () => {
            const res = await axios.get<GroupsResponse>("/groups");
            return res.data;
        },
    });
}
