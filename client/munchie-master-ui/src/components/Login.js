import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/api/auth" : "/api/users";
      const data = isLogin ? { email, password } : { name, email, password };
      const response = await axios.post(endpoint, data, {
        headers: {
          "Content-Type": "application/json",
        },
        baseURL: "http://localhost:3001",
      });
      const token = response.data;
      localStorage.setItem("token", token);
      window.location = "/recipes";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setError(ex.response.data);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          MunchieMaster
        </Typography>
        <Tabs
          value={isLogin ? 0 : 1}
          onChange={(e, newValue) => setIsLogin(newValue === 0)}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {!isLogin && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus={isLogin}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
