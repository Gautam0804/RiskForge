import api from "./api";

export async function getDashboardOverview() {
    const response = await api.get("/dashboard");

    return response.data.data;
}