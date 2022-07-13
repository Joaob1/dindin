import axios from "axios";

import { getToken } from "../utils/token";

const api = axios.create({
    baseURL: "http://localhost:4000",
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        const token = getToken();
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
