import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Tabs,
  Tab,
} from "@mui/material";

const inputSx = { "& .MuiInputBase-root": { backgroundColor: "common.white" } };

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigate("/recipes");
        } else {
          setError(t("login.loginFailed"));
        }
      } else {
        const success = await register(name, email, password);
        if (success) {
          navigate("/recipes");
        } else {
          setError(t("login.registerFailed"));
        }
      }
    } catch (error) {
      setError(t("login.error"));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/recipes");
    }
  }, [navigate]);

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 4, md: 8 } }}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          color: "primary.main",
          backgroundColor: "tiles.cream",
          boxShadow: (theme) => theme.customShadows.raised,
        }}
      >
        <Typography
          component="h1"
          sx={{ fontSize: "1.75rem", textAlign: "center", mb: 1 }}
        >
          {t("brand")}
        </Typography>
        <Tabs
          value={isLogin ? 0 : 1}
          onChange={(e, newValue) => setIsLogin(newValue === 0)}
          variant="fullWidth"
          sx={{
            mb: 1,
            "& .MuiTab-root": { textTransform: "none", fontSize: "1rem" },
            "& .MuiTabs-indicator": { backgroundColor: "accent.main" },
          }}
        >
          <Tab label={t("login.loginTab")} />
          <Tab label={t("login.registerTab")} />
        </Tabs>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {!isLogin && (
            <TextField
              margin="normal"
              sx={inputSx}
              required
              fullWidth
              id="name"
              label={t("login.fullName")}
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            margin="normal"
            sx={inputSx}
            required
            fullWidth
            id="email"
            label={t("login.email")}
            name="email"
            autoComplete="email"
            autoFocus={isLogin}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            sx={inputSx}
            required
            fullWidth
            name="password"
            label={t("login.password")}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              py: 1.25,
              borderRadius: 999,
              textTransform: "none",
              fontSize: "1.05rem",
              color: "accent.contrastText",
              backgroundColor: "accent.main",
              "&:hover": { backgroundColor: "accent.dark" },
            }}
          >
            {isLogin ? t("login.submitLogin") : t("login.submitRegister")}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
