import React, { createContext, useContext, useState } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = async (email, password) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    return true;
  };

  const register = async (data) => {
    const savedUser = await authService.register(data);
    setUser(savedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(savedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data) => {
    const updatedUser = await authService.updateProfile(user.id, data);
    // Merge so we keep the token (PATCH response doesn't include it)
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
    return merged;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
