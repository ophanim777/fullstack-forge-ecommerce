import { createContext, useContext, useState, useEffect, } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(data) {
  const response = await authService.login(data);

  localStorage.setItem(
    "accessToken",
    response.accessToken
  );

  localStorage.setItem(
    "refreshToken",
    response.refreshToken
  );

  setUser(response.user);
  setLoading(false);

  return response;
}

  async function loadUser() {
  try {
    const response = await authService.getMe();

    setUser(response.user);
  } catch (error) {
    setUser(null);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadUser();
  }, []);

  async function logout() {
    await authService.logout();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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