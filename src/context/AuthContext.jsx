import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedData = localStorage.getItem('adminToken');
      if (storedData) {
        const { token, email } = JSON.parse(storedData);
        try {
          // Verify token against backend
          await authService.getMe(token);
          setAdmin({ email, token });
        } catch (error) {
          // Token invalid or expired
          console.error('Auth verification failed:', error);
          authService.logout();
          setAdmin(null);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setAdmin(data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
