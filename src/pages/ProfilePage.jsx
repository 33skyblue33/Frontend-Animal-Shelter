import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';

// --- Styled Components ---
const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 30,
  maxWidth: 500,
  width: '100%',
  textAlign: 'center',
  position: 'relative',
  marginTop: 40, // Miejsce na awatar wystający w górę
  overflow: 'visible'
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  backgroundColor: theme.palette.primary.main,
  border: '5px solid #fff',
  position: 'absolute',
  top: -50,
  left: '50%',
  transform: 'translateX(-50%)',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 20,
  padding: '10px 30px',
  fontWeight: 'bold'
}));

export const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '' // Backend wymaga hasła w UserRequest
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const response = await UserService.getById(user.id);
      const { name, email, age } = response.data;
      setFormData({ 
        name, 
        email, 
        age, 
        password: '' // Hasła nie pobieramy z API ze względów bezpieczeństwa
      });
    } catch (error) {
      toast.error("Nie udało się pobrać danych profilu.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      toast.warning("Aby zaktualizować dane, musisz podać hasło (nowe lub obecne).");
      return;
    }

    try {
      // API oczekuje inta dla wieku
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      await UserService.update(user.id, payload);
      toast.success("Profil zaktualizowany pomyślnie!");
      // Opcjonalnie: wyczyść hasło po zapisie
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      console.error(error);
      toast.error("Błąd aktualizacji profilu.");
    }
  };

  if (!user) return <Typography>Musisz być zalogowany.</Typography>;

  return (
    <PageContainer>
      <ProfileCard elevation={3}>
        <StyledAvatar>
          <PersonIcon style={{ fontSize: 60 }} />
        </StyledAvatar>
        
        <Typography variant="h5" style={{ marginTop: 50, fontWeight: 700, color: '#2D3436' }}>
          Twój Profil
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 20 }}>
          Zarządzaj swoimi danymi
        </Typography>

        <form onSubmit={handleUpdate}>
          <TextField
            label="Imię i Nazwisko"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            InputProps={{ style: { borderRadius: 20 } }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            InputProps={{ style: { borderRadius: 20 } }}
          />
          <TextField
            label="Wiek"
            name="age"
            type="number"
            fullWidth
            margin="normal"
            value={formData.age}
            onChange={handleChange}
            InputProps={{ style: { borderRadius: 20 } }}
          />
          <TextField
            label="Hasło (Wymagane do zmian)"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            helperText="Wpisz obecne hasło lub nowe, jeśli chcesz je zmienić."
            InputProps={{ style: { borderRadius: 20 } }}
          />

          <ActionButton 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth
          >
            Zapisz Zmiany
          </ActionButton>
        </form>
      </ProfileCard>
    </PageContainer>
  );
};