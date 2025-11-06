import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const message = error.response?.data?.error || "サーバーエラー";
        alert(message);
        return Promise.reject(error);
    }
);

export default api;
