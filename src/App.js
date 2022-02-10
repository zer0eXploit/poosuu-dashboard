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
const Artist = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/Artist"))
);
const ArtistCreate = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/ArtistCreate"))
);
const ArtistEdit = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/ArtistEdit"))
);
const ArtistAll = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/ArtistAll"))
);
const ArtistSongs = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/ArtistSongs"))
);
const Songs = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/Songs"))
);
const SongAll = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/SongAll"))
);
const Song = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/Song"))
);
const SongsIndex = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/SongsIndex"))
);
const SongCreate = withSuspense(
  React.lazy(() => import(/* webpackPreload: true */ "./pages/SongCreate"))
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
            <Route path="create" element={<ArtistCreate />} />
            <Route path="all" element={<ArtistAll />} />
            <Route path=":artistId" element={<Artist />}>
              <Route index path="edit" element={<ArtistEdit />} />
            </Route>
            <Route path=":artistId/songs" element={<ArtistSongs />} />
          </Route>
          <Route path="songs" element={<Songs />}>
            <Route index element={<SongsIndex />} />
            <Route path="create" element={<SongCreate />} />
            <Route path="all" element={<SongAll />} />
            <Route path=":songId" element={<Song />} />
          </Route>
        </Route>
        <Route path="/password-reset/:token" element={<PasswordReset />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
