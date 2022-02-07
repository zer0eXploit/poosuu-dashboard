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
const PasswordReset = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/PasswordReset"))
);
const ManageAdmins = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/ManageAdmins"))
);
const ManageAPIKeys = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/ManageAPIKeys"))
);
const Artists = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/Artists"))
);
const ArtistsIndex = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/ArtistsIndex"))
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
            <Route path="manage-admins" element={<ManageAdmins />} />
            <Route path="manage-api-keys" element={<ManageAPIKeys />} />
          </Route>
          <Route path="artists" element={<Artists />}>
            <Route index element={<ArtistsIndex />} />
          </Route>
        </Route>
        <Route path="/password-reset/:token" element={<PasswordReset />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
