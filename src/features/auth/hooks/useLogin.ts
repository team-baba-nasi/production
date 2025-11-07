import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

export type LoginForm = {
    email: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    user: { id: string; username: string; email: string };
};

export type LoginError = {
    error: string;
};

export function useLogin() {
    return useMutation<LoginResponse, AxiosError<LoginError>, LoginForm>({
        mutationFn: async (form) => {
            const res = await axios.post<LoginResponse>("/auth/login", form);
            return res.data;
        },
    });
}
