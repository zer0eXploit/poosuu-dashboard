import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/auth-context";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { Nav, PrivateRoute } from "./components";

import withSuspense from "./hoc/withSuspense";

// Lazy Loading Pages
const Account = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/Account"))
);
const AccountIndex = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/AccountIndex"))
);
const AccountInfo = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/AccountInfo"))
);
const AccountSecurity = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/AccountSecurity"))
);

function App() {
  return (
    <AuthProvider>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="my-account" element={<Account />}>
            <Route index element={<AccountIndex />} />
            <Route path="account-security" element={<AccountSecurity />} />
            <Route path="update-account-info" element={<AccountInfo />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
