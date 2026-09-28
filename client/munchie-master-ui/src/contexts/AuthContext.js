import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
console.log("Base URL:", process.env.REACT_APP_SERVER_URL);

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

  // Save a login token and load the user
  const startSession = async (token) => {
    const user = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    axios.defaults.headers.common["x-auth-token"] = token;
    await checkAuthStatus();
  };

  // Returns { ok } or { ok: false, code, email } (code "EMAIL_NOT_VERIFIED"
  // when the account exists but its email isn't confirmed yet)
  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth", { email, password });
      await startSession(response.data.token);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        code: error.response?.data?.code,
        email: error.response?.data?.email,
      };
    }
  };

  // Creates the account and emails a confirmation link; does not log in
  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/api/users", {
        name,
        email,
        password,
      });
      return { ok: true, ...response.data };
    } catch (error) {
      const message = error.response?.data;
      return {
        ok: false,
        code:
          typeof message === "string" && /already registered/i.test(message)
            ? "ALREADY_REGISTERED"
            : undefined,
      };
    }
  };

  // Confirms the email from the link's token and logs the user in
  const verifyEmail = async (token) => {
    try {
      const response = await axios.post("/api/users/verify-email", { token });
      await startSession(response.data.token);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        code: error.response?.data?.code,
        email: error.response?.data?.email,
      };
    }
  };

  const resendVerification = async (email) => {
    try {
      await axios.post("/api/users/resend-verification", { email });
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["x-auth-token"];
    setCurrentUser({});
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    register,
    verifyEmail,
    resendVerification,
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
