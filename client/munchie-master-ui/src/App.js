import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link as RouterLink,
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import NavMenu from "./components/NavMenu";
import Login from "./components/Login";
import Recipes from "./components/Recipes";
import AdminRecipeCreator from "./components/AdminRecipeCreator";
import { AuthProvider } from "./contexts/AuthContext";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavMenu />
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route
              path="/admin/create-recipe"
              element={<AdminRoute component={AdminRecipeCreator} />}
            />
            <Route path="/" element={<Navigate replace to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
