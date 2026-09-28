import React, { useMemo } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useTranslation } from "react-i18next";
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
import VerifyEmail from "./components/VerifyEmail";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import isEmpty from "lodash/isEmpty";
import RecipeCreator from "./components/RecipeCreator";
import CoinNotifier from "./components/CoinNotifier";
import { ErrorProvider } from "./contexts/ErrorContext";
import UserProfile from "./components/UserProfile";
import LandingPage from "./components/LandingPage";
import { ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { createAppTheme } from "./theme";
import { ColorModeProvider, useColorMode } from "./contexts/ColorModeContext";
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
        <Route path="/verify-email" element={<VerifyEmail />} />
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

// Separate style caches so right-to-left CSS (flipped margins, left/right)
// is generated only for Persian
const styleCaches = {
  ltr: createCache({ key: "mui" }),
  rtl: createCache({ key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] }),
};

function ThemedApp() {
  const { mode } = useColorMode();
  const { i18n } = useTranslation();
  const language = i18n.language;
  const theme = useMemo(() => createAppTheme(mode, language), [mode, language]);

  return (
    <CacheProvider value={styleCaches[theme.direction]}>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={(theme) => ({
            body: {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.page.text,
              transition: "background-color 0.3s",
            },
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
    </CacheProvider>
  );
}

function App() {
  return (
    <ColorModeProvider>
      <ThemedApp />
    </ColorModeProvider>
  );
}

export default App;
