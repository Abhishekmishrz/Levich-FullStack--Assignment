import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          // If getCurrentUser fails, try to refresh token
          try {
            const refreshResponse = await authService.refreshToken(refreshToken);
            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            setUser(refreshResponse.data.user);
          } catch (refreshError) {
            // If refresh fails, clear everything
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    return await authService.requestPasswordReset(email);
  };

  const resetPassword = async (token, password) => {
    return await authService.resetPassword(token, password);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 