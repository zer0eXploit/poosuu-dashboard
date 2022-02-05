import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/auth-context";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { Nav, PrivateRoute } from "./components";

function App() {
  return (
    <React.Fragment>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
