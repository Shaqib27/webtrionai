import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "@/api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        checkUserAuth();
    }, []);

    const checkUserAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoadingAuth(false);
            setIsAuthenticated(false);
            return;
        }

        try {
            const res = await api.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setAuthError("Authentication required");
        }

        setIsLoadingAuth(false);
    };

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });

            const token = res.data.access_token;
            localStorage.setItem("token", token);

            setUser(res.data.user);
            setIsAuthenticated(true);
            setAuthError(null);

            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError("Invalid credentials");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoadingAuth,
                authError,
                login,
                logout,
                checkUserAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};