import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export type LoginForm = {
    email: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
};

export type LoginError = {
    error: string;
};

export function useLogin() {
    const router = useRouter();

    return useMutation<LoginResponse, AxiosError<LoginError>, LoginForm>({
        mutationFn: async (form) => {
            const res = await axios.post<LoginResponse>("/auth/login", form);
            return res.data;
        },
        onSuccess: () => {
            router.push("/");
        },
    });
}
