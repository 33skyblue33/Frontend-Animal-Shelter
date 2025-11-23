import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { DotationService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';


const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.primary,
}));

const HeartContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(4, 0),
  animation: `${pulse} 2s infinite ease-in-out`, 
}));


const SumText = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: '#fff',
  zIndex: 2,
});

const BankInfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 30,
  backgroundColor: '#fff',
  textAlign: 'center',
  maxWidth: 500,
  width: '100%',
  marginBottom: theme.spacing(4),
  border: `3px solid ${theme.palette.primary.main}`,
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
}));

const DonateButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF6B6B', 
  color: '#fff',
  fontSize: '1.2rem',
  padding: '12px 32px',
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#EE5253',
  }
}));

const StyledInput = styled(TextField)({
  backgroundColor: '#fff',
  borderRadius: 24,
  '& fieldset': { borderRadius: 24 },
});

export const DotationsPage = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadDotations();
  }, []);

  const loadDotations = async () => {
    try {
      const response = await DotationService.getAll();
      const sum = response.data.reduce((acc, curr) => acc + curr.amount, 0);
      setTotalAmount(sum);
    } catch (error) {
      console.error("Błąd pobierania dotacji", error);
    }
  };

  const handleDonate = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      toast.warning("Wpisz poprawną kwotę!");
      return;
    }

    const payload = {
      username: user ? user.email : "Anonimowy Darczyńca", 
      amount: value,
      description: "Wsparcie dla schroniska"
    };

    try {
      await DotationService.create(payload);
      toast.success(`Dziękujemy za wpłatę ${value} PLN! ❤️`);
      setAmount('');
      loadDotations(); 
    } catch (error) {
      console.error(error);
      toast.error("Coś poszło nie tak przy płatności.");
    }
  };

  return (
    <PageContainer>
      <BankInfoCard elevation={0}>
        <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 10, color: '#4FD1C5' }}>
          Wspomóż nasze ogonki! 🏦
        </Typography>
        <Typography variant="body1" style={{ fontSize: '1.1rem' }}>
          Nr konta: <strong>12 3456 7890 0000 1111 2222 3333</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Bank HappyPaws S.A.
        </Typography>
      </BankInfoCard>

      <Typography variant="h4" style={{ fontWeight: 700 }}>Razem zebraliśmy:</Typography>
      
      <HeartContainer>
        <FavoriteIcon style={{ fontSize: 350, color: '#FF6B6B' }} />
        
        <SumText>
          <Typography variant="h3" style={{ fontWeight: 800, textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            {totalAmount} zł
          </Typography>
          <Typography variant="h6">Dziękujemy!</Typography>
        </SumText>
      </HeartContainer>

      <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth={300}>
        <StyledInput
          label="Kwota (PLN)"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{ style: { borderRadius: 24 } }}
        />
        <DonateButton onClick={handleDonate}>
          Wpłać Darowiznę
        </DonateButton>
      </Box>
      
    </PageContainer>
  );
};