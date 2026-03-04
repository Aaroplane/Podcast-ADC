import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setLogoutHandler } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      if (response.status === 200) {
        const { token, refreshToken, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to sign in. Please try again.",
      };
    }
  };

  const isAuthenticated = !!user;

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      // Logout API call failed — still clear local state
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("script");
      setUser(null);
      navigate("/");
    }
  };

  // Register the logout handler with the Axios interceptor so it can
  // trigger a proper logout when a refresh token fails.
  useEffect(() => {
    setLogoutHandler(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("script");
      setUser(null);
      navigate("/login");
    });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, setUser, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
