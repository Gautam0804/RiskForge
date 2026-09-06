import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("riskforge_user");

        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("riskforge_token");

    useEffect(() => {
        async function restoreSession() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/auth/me");

                const currentUser = response.data.data.user;

                setUser(currentUser);
                localStorage.setItem(
                    "riskforge_user",
                    JSON.stringify(currentUser)
                );
            } catch {
                localStorage.removeItem("riskforge_token");
                localStorage.removeItem("riskforge_user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, [token]);

    async function login(email, password) {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const { user, token } = response.data.data;

        localStorage.setItem("riskforge_token", token);
        localStorage.setItem("riskforge_user", JSON.stringify(user));

        setUser(user);

        return user;
    }

    function logout() {
        localStorage.removeItem("riskforge_token");
        localStorage.removeItem("riskforge_user");

        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: Boolean(user),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}