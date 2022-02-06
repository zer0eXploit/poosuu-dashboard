import React, { useState, createContext, useContext } from "react";

import CONSTANTS from "../utils/constants";

const AuthContext = createContext();

export function AuthProvider(props) {
  const [authData, setAuthData] = useState(() => {
    const admin = localStorage.getItem(CONSTANTS.POOSUU_ADMIN_DATA);
    const token = localStorage.getItem(CONSTANTS.POOSUU_ADMIN_ACCESS_TOKEN);

    if (admin && token) {
      return {
        admin: JSON.parse(admin),
        token: token,
      };
    }

    return null;
  });

  return <AuthContext.Provider value={{ authData, setAuthData }} {...props} />;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error(`useAuth must be used within AuthProvider Component`);

  return context;
}
