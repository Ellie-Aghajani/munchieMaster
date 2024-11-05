import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import NavMenu from "./components/NavMenu";
// import LandingNavbar from "./components/LandingNavbar";
import Login from "./components/Login";
import Recipes from "./components/Recipes";
import AdminRecipeCreator from "./components/AdminRecipeCreator";
import { AuthProvider } from "./contexts/AuthContext";
import AdminRoute from "./components/AdminRoute";
import { ErrorProvider } from "./contexts/ErrorContext";
import UserProfile from "./components/UserProfile";
import LandingPage from "./components/LandingPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {!isLandingPage && <NavMenu />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route
          path="/admin/create-recipe"
          element={<AdminRoute component={AdminRecipeCreator} />}
        />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}

export default App;
