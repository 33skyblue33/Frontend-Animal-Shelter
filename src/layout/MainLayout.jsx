import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

// --- Styled Components ---
const RootContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  flex: 1,
}));

const LogoTypography = styled(Typography)({
  flexGrow: 1,
  fontWeight: 'bold',
  cursor: 'pointer',
});

// --- Component ---
export const MainLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <RootContainer>
      <CssBaseline />
      <StyledAppBar position="static">
        <Toolbar>
          <LogoTypography variant="h6" onClick={() => navigate('/')}>
            AnimalShelter
          </LogoTypography>
          
          {isAuthenticated ? (
            <>
              <NavButton component={Link} to="/pets">Zwierzaki</NavButton>
              <NavButton component={Link} to="/adoptions">Adopcje</NavButton>
              <NavButton onClick={handleLogout}>Wyloguj</NavButton>
            </>
          ) : (
            <>
              <NavButton component={Link} to="/login">Logowanie</NavButton>
              <NavButton component={Link} to="/register">Rejestracja</NavButton>
            </>
          )}
        </Toolbar>
      </StyledAppBar>
      
      <ContentContainer maxWidth="lg">
        <Outlet />
      </ContentContainer>
    </RootContainer>
  );
};