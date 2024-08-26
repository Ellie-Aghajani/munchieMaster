import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = "http://localhost:3001";

const defaultMunchieMaster = {
  currentUser: {},
  login: async () => false,
  logout: () => {},
  register: async () => false,
  loading: false,
  checkAuthStatus: async () => {},
  setLoading: () => {},
};

const AuthContext = createContext(defaultMunchieMaster);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/api/users/me");
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser({});
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth", { email, password });
      const { token } = response.data;
      const user = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["x-auth-token"] = token;
      await checkAuthStatus();
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/api/users", {
        name,
        email,
        password,
      });
      const { token } = response.data;
      const user = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["x-auth-token"] = token;
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["x-auth-token"];
    setCurrentUser({});
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
    checkAuthStatus,
    setLoading: (loading) => setLoading(loading),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
