import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = ({ component: Component }) => {
  const { currentUser = {} } = useAuth() || {};

  return currentUser && currentUser?.isAdmin ? (
    <Component />
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoute;
