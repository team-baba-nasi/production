import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type RegisterForm = {
    username: string;
    email: string;
    password: string;
};

type RegisterResponse = {
    message: string;
    user: { id: string; username: string; email: string; created_at: string };
};

type RegisterError = {
    error: string;
    details?: { field: string; message: string }[];
};

export function useRegister() {
    return useMutation<RegisterResponse, AxiosError<RegisterError>, RegisterForm>({
        mutationFn: async (form) => {
            const res = await axios.post("/auth/register", form);
            return res.data;
        },
    });
}
