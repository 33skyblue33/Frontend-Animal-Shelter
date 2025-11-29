import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, Box } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const RootContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  boxShadow: 'none', 
  paddingTop: theme.spacing(1),
}));

const LogoText = styled(Typography)({
  flexGrow: 1,
  fontWeight: 700,
  fontSize: '1.8rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#fff',
  textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
});

const NavButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.2)',
  color: '#fff',
  marginLeft: theme.spacing(2),
  border: '2px solid rgba(255,255,255,0.3)',
  '&:hover': {
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
  },
}));


const WaveContainer = styled('div')({
  width: '100%',
  backgroundColor: '#4FD1C5', 
  lineHeight: 0, 
  marginBottom: '20px'
});

const ContentContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  flex: 1,
}));


export const MainLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <RootContainer>
        <CssBaseline />
        <StyledAppBar position="static">
          <Toolbar>
            <LogoText variant="h6" onClick={() => navigate('/')}>
              🐾 HappyPaws
            </LogoText>
            
            {isAuthenticated ? (
              <>
                <NavButton component={Link} to="/pets">Zwierzaki</NavButton>
                <NavButton component={Link} to="/adoptions">Adopcje</NavButton>
                
                <NavButton component={Link} to="/dotations" style={{ color: '#FFF8E7' }}>Dotacje ❤️</NavButton>
                <NavButton component={Link} to="/profile" title="Mój Profil">
                  <Box gap={1} display="flex" alignItems="center">Profil <AccountCircleIcon /></Box>
                </NavButton>
                
                <NavButton onClick={handleLogout} style={{ backgroundColor: '#FF6B6B' }}>Wyloguj</NavButton>
              </>
            ) : (
              <>
                <NavButton component={Link} to="/dotations">Wesprzyj nas</NavButton>
                
                <NavButton component={Link} to="/login">Logowanie</NavButton>
                <NavButton component={Link} to="/register" variant="contained" color="secondary">Rejestracja</NavButton>
              </>
            )}
          </Toolbar>
        </StyledAppBar>
        <WaveContainer>
          <svg viewBox="0 0 1440 120" fill="#FFF8E7" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </WaveContainer>

        <ContentContainer maxWidth="lg">
          <Outlet />
        </ContentContainer>
      </RootContainer>
    </ThemeProvider>
  );
};