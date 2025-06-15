
import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance, { setAuthUpdateToken } from "../api/axiosInstance"; // Import setAuthUpdateToken

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State variables for authentication status, access token, and loading status
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true); // True initially, until check completes

    // Callback to update the token and authentication state
    const updateToken = useCallback((newToken) => {
        if (newToken) {
            localStorage.setItem("accessToken", newToken);
            setAccessToken(newToken);
            setIsAuthenticated(true);
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        } else {
            // Handle null token correctly: clear storage, state, and header
            localStorage.removeItem("accessToken");
            setAccessToken(null);
            setIsAuthenticated(false);
            delete axiosInstance.defaults.headers.common["Authorization"];
        }
    }, []);

    

    // Set the updateToken function in the axiosInstance for interceptor use
    useEffect(() => {
        setAuthUpdateToken(updateToken);
    }, [updateToken]);

    // Effect to perform initial authentication check when component mounts
    useEffect(() => {
        const checkAuthStatus = async () => {
            const storedToken = localStorage.getItem("accessToken");

            if (storedToken) {
                try {
                    // Attempt to validate the token using your /api/auth/validate endpoint
                    // axiosInstance interceptors will automatically add the Authorization header
                    // and handle refresh logic if configured.
                    await axiosInstance.get("/auth/validate");

                    // If the validation call succeeds, set authenticated state
                    setIsAuthenticated(true);
                    setAccessToken(storedToken); // Use the stored token
                } catch (error) {
                    // If validation fails (e.g., 401/403 from backend), token is invalid/expired
                    console.error( // Keeping console.error
                        "Stored token is invalid or expired via /api/auth/validate:",
                        error
                    );
                    localStorage.removeItem("accessToken"); // Remove invalid token
                    setIsAuthenticated(false);
                    setAccessToken(null);
                    // axiosInstance interceptor should handle clearing default header if token is invalid
                }
            }
            // Authentication check is complete, regardless of outcome
            setLoadingAuth(false);
        };

        checkAuthStatus();
    }, []); // Empty dependency array means this effect runs only once on mount

    // Function to handle user login
    const login = (token) => {
        // Extract token value if it comes with "Bearer " prefix
        const tokenValue = token.startsWith("Bearer ")
            ? token.split(" ")[1]
            : token;
        updateToken(tokenValue); // Use updateToken to set the new token
    };

   const logout = async () => { // <-- CORRECTED: 'aysnc' changed to 'async'
        try {
            await axiosInstance.post("/auth/logout");
            updateToken(null); // Use updateToken to clear the token and state
        } catch (error) {
            console.error("Logout error:", error); // Keeping console.error
            // IMPORTANT: Re-throw the error so Header component can catch it
            throw error;
        }
    };

   

    // Provide the state variables and functions to components consuming this context
    return (
        <AuthContext.Provider
            value={{ isAuthenticated, login, logout, accessToken, loadingAuth, updateToken }}
        >
            {/* Conditionally render children or a loading indicator based on loadingAuth state */}
            {loadingAuth ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        fontSize: "1.2em",
                    }}
                >
                    Loading application...
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
