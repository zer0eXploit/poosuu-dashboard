import React from "react";

import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "../context/auth-context";

export function PrivateRoute() {
  const { authData } = useAuth();

  if (authData) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}
