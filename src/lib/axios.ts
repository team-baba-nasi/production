import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

type FailedRequest = {
    resolve: (value: AxiosResponse | Promise<AxiosResponse>) => void;
    reject: (reason?: unknown) => void;
    config: AxiosRequestConfig;
};

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, tokenRefreshed: boolean) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error || !tokenRefreshed) {
            reject(error);
        } else {
            resolve(api(config));
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // 401以外 or configなし → そのまま返す
        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // refresh自身は interceptor対象外（無限ループ防止）
        if (originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        // refresh中ならキューに積む
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                    config: originalRequest,
                });
            });
        }

        isRefreshing = true;

        try {
            // refresh 実行
            await api.post("/auth/refresh");

            processQueue(null, true);

            // 元のリクエストを再実行
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError, false);

            // refresh失敗 → logout
            try {
                await api.post("/auth/logout");
            } catch {
                // noop
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
