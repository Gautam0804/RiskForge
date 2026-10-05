import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    login as loginRequest,
    getCurrentUser,
    logout as authLogout
} from "../services/auth.service";


export const AuthContext =
    createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    /* ========================================= */
    /* LOAD CURRENT USER */
    /* ========================================= */

    useEffect(() => {

        async function loadUser() {

            const token =
                localStorage.getItem(
                    "riskforge_token"
                );


            if (!token) {
                setLoading(false);
                return;
            }


            try {

                const data =
                    await getCurrentUser();

                setUser(data.user);

            } catch (error) {

                console.error(
                    "Failed to load current user:",
                    error
                );

                localStorage.removeItem(
                    "riskforge_token"
                );

                setUser(null);

            } finally {

                setLoading(false);

            }
        }


        loadUser();

    }, []);


    /* ========================================= */
    /* LOGIN */
    /* ========================================= */

    async function login(email, password) {

        const data =
            await loginRequest(
                email,
                password
            );


        if (!data?.token) {
            throw new Error(
                "Login response did not contain a token."
            );
        }


        localStorage.setItem(
            "riskforge_token",
            data.token
        );


        setUser(data.user);


        return data;

    }


    /* ========================================= */
    /* LOGOUT */
    /* ========================================= */

    function logout() {

        authLogout();

        setUser(null);

    }


    /* ========================================= */
    /* CONTEXT VALUE */
    /* ========================================= */

    const value = {

        user,

        setUser,

        loading,

        isAuthenticated:
            Boolean(user),

        login,

        logout

    };


    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}