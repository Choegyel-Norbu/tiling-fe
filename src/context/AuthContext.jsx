import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, authStorage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getToken();
      const savedUser = authStorage.getUser();

      if (token && savedUser) {
        // Verify token is still valid by calling /auth/me
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.data);
            authStorage.setUser(response.data); // Update user data
          } else {
            // Token invalid, clear storage
            authStorage.clear();
            setUser(null);
          }
        } catch (error) {
          // Token expired or invalid, clear storage
          console.error('Token validation failed:', error);
          authStorage.clear();
          setUser(null);
        }
      } else {
        // No existing session
        authStorage.clear();
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login with Google ID token
   * @param {string} idToken - Google ID token from Google Sign-In
   */
  const login = async (idToken) => {
    try {
      const response = await authAPI.googleSignIn(idToken);

      if (response.success) {
        // Store JWT token and user data
        authStorage.setToken(response.data.token);
        authStorage.setUser(response.data.user);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout - clear all authentication data
   */
  const logout = () => {
    setUser(null);
    authStorage.clear();
  };

  // Computed role checks
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    isAdmin,
    isUser,
    role: user?.role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
