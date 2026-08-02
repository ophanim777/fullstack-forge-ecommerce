import { createContext, useContext, useState, useEffect, } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(data) {
    const response = await authService.login(data);

    setUser(response.user);

    return response;
  }

  async function logout() {
    await authService.logout();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}