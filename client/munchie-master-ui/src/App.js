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
import RecipeDetail from "./components/RecipeDetail";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import isEmpty from "lodash/isEmpty";
import RecipeCreator from "./components/RecipeCreator";
import CoinNotifier from "./components/CoinNotifier";
import { ErrorProvider } from "./contexts/ErrorContext";
import UserProfile from "./components/UserProfile";
import LandingPage from "./components/LandingPage";
import { ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import theme from "./theme";
import Dashboard from "./components/Dashboard";
import "@fontsource/roboto";
import "./global.css";

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const { currentUser } = useAuth();
  const isLoggedIn = !isEmpty(currentUser);

  return (
    <>
      <CoinNotifier />
      {!isLandingPage && <NavMenu />}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate replace to="/dashboard" /> : <LandingPage />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/new" element={<RecipeCreator />} />
        <Route path="/recipes/:id/edit" element={<RecipeCreator />} />
        <Route
          path="/admin/create-recipe"
          element={<Navigate replace to="/recipes/new" />}
        />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={(theme) => ({
          body: { backgroundColor: theme.palette.background.default },
        })}
      />
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
