import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { PetsPage } from './pages/PetsPage';
import { AdoptionRequestsPage } from './pages/AdoptionRequestsPage';

// Prosty komponent chroniący trasy
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/pets" />} />
            <Route path="login" element={<LoginPage />} />
            {/* Tutaj dodaj RegisterPage analogicznie do LoginPage */}
            
            {/* Trasy chronione */}
            <Route 
              path="pets" 
              element={
                <PrivateRoute>
                  <PetsPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="adoptions" 
              element={
                <PrivateRoute>
                  <AdoptionRequestsPage />
                </PrivateRoute>
              } 
            />
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;