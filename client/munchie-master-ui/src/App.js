import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NavMenu from "./components/NavMenu";
import Login from "./components/Login";
import Recipes from "./components/Recipes";
import AdminRecipeCreator from "./components/AdminRecipeCreator";
import { AuthProvider } from "./contexts/AuthContext";
import AdminRoute from "./components/AdminRoute";
import { ErrorProvider } from './contexts/ErrorContext';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <ErrorProvider>
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
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/" element={<Navigate replace to="/login" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;