import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setToken as setApiToken } from '../api/mockServer.js';
import * as authApi from '../api/auth.js';

const TOKEN_KEY = 'medilynk.token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  // Restore the session on refresh, the way the JWT session would behave in the real app.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setApiToken(token);
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setApiToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const adoptSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setApiToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
      adoptSession(data);
      return data;
    },
    [adoptSession],
  );

  const register = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      adoptSession(data);
      return data;
    },
    [adoptSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setApiToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout }),
    [token, user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
