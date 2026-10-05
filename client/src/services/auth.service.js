import api from "./api";


export async function login(email, password) {
    const response = await api.post(
        "/auth/login",
        {
            email,
            password
        }
    );

    return response.data.data;
}


export async function getCurrentUser() {
    const response =
        await api.get("/auth/me");

    return response.data.data;
}


export function logout() {
    localStorage.removeItem(
        "riskforge_token"
    );

    window.location.href = "/login";
}