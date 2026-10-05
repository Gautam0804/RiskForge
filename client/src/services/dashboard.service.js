import api from "./api";

export async function getDashboardOverview() {
    const response = await api.get("/dashboard/overview");

    console.log("DASHBOARD API RESPONSE:", response.data);

    return response.data.data;
}