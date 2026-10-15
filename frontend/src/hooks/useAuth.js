import { useState, useEffect } from "react";
import apiService from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined" || token === "null") {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.getMe();

        // Backend returns: { success: true, data: { user } }
        const currentUser = response?.data?.user;

        if (currentUser) {
          setUser(currentUser);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await apiService.login(credentials);

    // Backend returns: { success: true, data: { user, token } }
    const { token, user: loggedInUser } = response?.data || {};

    if (!token || !loggedInUser) {
      throw new Error("Login response is missing the user or token.");
    }

    localStorage.setItem("token", token);
    setUser(loggedInUser);

    return { token, user: loggedInUser };
  };

  const register = async (userData) => {
    const response = await apiService.register(userData);

    const { token, user: registeredUser } = response?.data || {};

    if (!token || !registeredUser) {
      throw new Error("Registration response is missing the user or token.");
    }

    localStorage.setItem("token", token);
    setUser(registeredUser);

    return { token, user: registeredUser };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };
};