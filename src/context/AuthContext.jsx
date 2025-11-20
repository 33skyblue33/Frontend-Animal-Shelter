import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  const login = async (email, password) => {
    try {
      const response = await AuthService.login({ email, password });
      const { accessToken, userId } = response.data;
      
      setToken(accessToken);
      setUser({ id: userId, email }); // Możesz tu dodać dekodowanie JWT, by wyciągnąć rolę
      localStorage.setItem('accessToken', accessToken);
      return true;
    } catch (error) {
      if (error.response) {
        // Serwer odpowiedział kodem błędu (np. 400, 401, 500)
        console.error("Status:", error.response.status);
        console.error("Dane:", error.response.data);
        console.error("Nagłówki:", error.response.headers);
      } else if (error.request) {
        // Zapytanie wyszło, ale brak odpowiedzi (To jest Twój Network Error)
        console.error("Zapytanie wyszło, ale serwer milczy (lub CORS/SSL blokuje):", error.request);
      } else {
        // Coś innego poszło nie tak przy tworzeniu zapytania
        console.error("Błąd konfiguracji:", error.message);
      }
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);