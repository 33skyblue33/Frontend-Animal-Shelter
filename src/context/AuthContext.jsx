import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../api/services';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log("Logowanie...");
      const response = await AuthService.login({ email, password });
      
      const { accessToken, userId } = response.data;
      
      const userData = { id: userId, email: email };

      setToken(accessToken);
      setUser(userData);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error("Błąd logowania:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout(); 
    } catch (e) {
      console.error(e);
    } finally {
      setToken(null);
      setUser(null);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);