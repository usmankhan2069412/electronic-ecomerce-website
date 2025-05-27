import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Define the API base URL
const API_URL = "http://localhost:5000/api";

// Define the Auth context types
interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Set default auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // Check authentication status
          const response = await axios.get(`${API_URL}/auth/check-auth`);
          setUser(response.data.user);
        } catch (error) {
          console.error("Authentication check failed:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { token: newToken, user: userData } = response.data;
      
      // Save token to localStorage
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      
      // Set default auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, userData);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Context value
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Axios interceptor for handling token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
