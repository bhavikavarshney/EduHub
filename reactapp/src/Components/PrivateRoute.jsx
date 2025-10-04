import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = currentUser?.token;
  const role = currentUser?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    
    return <Navigate to="/error" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
