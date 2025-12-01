import axios, {isAxiosError} from "axios";
import {getAccessToken} from "@/helper/utils.ts";

export const axiosClient = axios.create({
    baseURL: "http://localhost:2345/api/v1",
    timeout: 15000,
});

// ===============================================
// REQUEST INTERCEPTOR
// ===============================================
axiosClient.interceptors.request.use(
    async (config) => {
        const headers = config.headers;

        // Default header
        headers.set("Accept-Language", "en");

        // Attach token unless No-Auth
        if (!headers.has("No-Auth")) {
            const accessToken = await getAccessToken();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ===============================================
// RESPONSE INTERCEPTOR
// ===============================================
axiosClient.interceptors.response.use(
    (response) => response.data.data,
    (error) => {
        if (isAxiosError(error)) {
            // Network down, offline, CORS, server unreachable
            if (error.code === "ERR_NETWORK") {
                return Promise.reject({
                    type: "NetworkError",
                    message: error.message,
                });
            }

            // Backend returned structured error
            if (error.response?.data) {
                return Promise.reject(error.response.data);
            }
        }

        return Promise.reject({
            type: "UnknownError",
            message: "An unknown error occurred",
        });
    }
);