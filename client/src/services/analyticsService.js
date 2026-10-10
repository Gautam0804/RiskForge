import api from "./api";

export const getAnalytics = async () => {
    const response = await api.get("/analytics/summary");
    return response.data;
};