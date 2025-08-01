import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user session is still valid on app load
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const lastLoginTime = localStorage.getItem("lastLoginTime");
        
        if (storedUser && lastLoginTime) {
          const userData = JSON.parse(storedUser);
          const timeSinceLogin = Date.now() - parseInt(lastLoginTime);
          const thirtyMinutes = 30 * 60 * 1000; // 30 minutes
          
          if (timeSinceLogin < thirtyMinutes) {
            setUser(userData);
          } else {
            clearAuthData();
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error("Error checking session:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("lastLoginTime");
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("lastLoginTime", Date.now().toString());
    
    // Store role and token separately for admin routing
    if (userData.role) {
      localStorage.setItem("role", userData.role);
      if (userData.role === "admin") {
        localStorage.setItem("isAdmin", "true");
      }
    }
    if (userData.role === "admin" && userData.token) {
      localStorage.setItem("adminToken", userData.token);
    }
  };

  const logout = () => {
    clearAuthData();
  };

  // For immediate logout without clearing localStorage issues
  const forceLogout = () => {
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forceLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
