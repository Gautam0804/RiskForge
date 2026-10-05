import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json"
    }
});


/* ================================================= */
/* REQUEST INTERCEPTOR */
/* ================================================= */

api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem(
                "riskforge_token"
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/* ================================================= */
/* RESPONSE INTERCEPTOR */
/* ================================================= */

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status =
            error?.response?.status;

        if (status === 401) {

            // Remove invalid/expired JWT
            localStorage.removeItem(
                "riskforge_token"
            );

            // Avoid redirecting repeatedly
            const currentPath =
                window.location.pathname;

            if (
                currentPath !== "/login"
            ) {
                window.location.href =
                    "/login";
            }
        }

        return Promise.reject(error);
    }
);


export default api;