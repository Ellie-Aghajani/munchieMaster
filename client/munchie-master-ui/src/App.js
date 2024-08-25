import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link as RouterLink,
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Login from "./components/Login";
import Recipes from "./components/Recipes";

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MunchieMaster
            </Typography>
            <Button color="inherit" component={RouterLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/recipes">
              Recipes
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route
              path="/"
              element={
                <Typography variant="h2" component="h1" gutterBottom>
                  Welcome to MunchieMaster
                </Typography>
              }
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
