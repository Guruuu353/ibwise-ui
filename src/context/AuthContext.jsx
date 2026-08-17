import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

// Wraps the whole app once (see main.jsx). Everything auth-related — the
// current user, login/logout, and "is this a demo role-preview session" —
// lives here so no page has to re-derive it.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFromToken = useCallback(async () => {
    const token = localStorage.getItem("ibwise_token");
    if (!token) { setLoading(false); return; }
    try {
      const me = await api.get("/auth/me");
      setUser(me);
    } catch {
      localStorage.removeItem("ibwise_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFromToken(); }, [loadFromToken]);

  async function login(email, password) {
    const { token, user: loggedInUser } = await api.post("/auth/login", { email, password });
    localStorage.setItem("ibwise_token", token);
    setUser(loggedInUser);
    return loggedInUser;
  }

  // Lets the demo skip real auth and preview a role's dashboard directly —
  // used by the role-picker on the login screen. Clearly not for production.
  function previewRole(role) {
    setUser({ id: "demo", role, firstName: "Demo", lastName: role.charAt(0) + role.slice(1).toLowerCase(), isDemo: true });
  }

  function logout() {
    localStorage.removeItem("ibwise_token");
    setUser(null);
  }

  // Merges fields into the current user without a re-fetch — used after a
  // successful profile save so the UI reflects it immediately.
  function patchUser(fields) {
    setUser((u) => (u ? { ...u, ...fields } : u));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, previewRole, patchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
