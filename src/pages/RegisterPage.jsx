import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, TextField, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthService } from '../api/services';
import { toast } from 'react-toastify';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: '0 auto',
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
}));

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      await AuthService.register(payload);
      
      toast.success("Rejestracja udana! Sprawdź email (lub zaloguj się).");
      navigate('/login');
    } catch (error) {
        if (error.response) {
       
        console.error("Status:", error.response.status);
        console.error("Dane:", error.response.data);
        console.error("Nagłówki:", error.response.headers);
      } else if (error.request) {

        console.error("Zapytanie wyszło, ale serwer milczy (lub CORS/SSL blokuje):", error.request);
      } else {
     
        console.error("Błąd konfiguracji:", error.message);
      }
      console.error(error);
      
      const msg = error.response?.data?.message || "Błąd rejestracji";
      toast.error(msg);
    }
  };

  return (
    <FormContainer elevation={3}>
      <Typography variant="h5" align="center">Zarejestruj się</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Imię"
          name="name"
          fullWidth
          margin="normal"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Wiek"
          name="age"
          type="number"
          fullWidth
          margin="normal"
          required
          value={formData.age}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Hasło"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <SubmitButton 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ mt: 2 }}
        >
          Zarejestruj
        </SubmitButton>
      </form>
    </FormContainer>
  );
};