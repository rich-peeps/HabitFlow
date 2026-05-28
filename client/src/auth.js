import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as apiLogin, signup as apiSignup } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    getMe()
      .then(setUser)
      .catch(() => { localStorage.removeItem('token'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { user, access_token } = await apiLogin(credentials);
    localStorage.setItem('token', access_token);
    setUser(user);
  };

  const signup = async (data) => {
    const { user, access_token } = await apiSignup(data);
    localStorage.setItem('token', access_token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
