import React, { useEffect, useState } from 'react';
import { 
  Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Box,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField 
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { PetService, AdoptionService, BreedService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PetsIcon from '@mui/icons-material/Pets';

// --- Styled Components (Te same co wcześniej) ---
const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
}));

const FilterButton = styled(Button)(({ theme, active }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: active ? theme.palette.primary.main : '#fff',
  color: active ? '#fff' : theme.palette.text.primary,
  border: '2px solid',
  borderColor: active ? theme.palette.primary.main : '#E0E0E0',
  borderRadius: 50,
  fontWeight: 700,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : '#F5F5F5',
  }
}));

const StyledCard = styled(Card)(({ bgcolor }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: bgcolor,
  borderRadius: 30,
  padding: 12,
  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s',
  '&:hover': { transform: 'scale(1.02)' }
}));

const ImageContainer = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
  height: 180, 
  position: 'relative',
  border: '4px solid rgba(255,255,255,0.5)'
});

const StyledMedia = styled(CardMedia)({
  height: '100%',
  objectFit: 'cover',
});

const ContentBox = styled(CardContent)({
  textAlign: 'center',
  color: '#2D3436',
  paddingTop: 10,
  paddingBottom: 0,
  flexGrow: 1,
});

const PetName = styled(Typography)({
  fontFamily: "'Fredoka', sans-serif",
  fontWeight: 700,
  fontSize: '1.6rem',
  marginBottom: 2,
  lineHeight: 1.2
});

const AdoptButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFC048',
  color: '#2D3436',
  width: '100%',
  fontWeight: 800,
  fontSize: '1.1rem',
  marginTop: 10,
  borderRadius: 15,
  '&:hover': { backgroundColor: '#FFA801' }
}));

// --- STYLING MODALA ---
const StyledDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: 30,
    padding: 10,
    border: '4px solid #4FD1C5'
  }
});

export const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreedId, setSelectedBreedId] = useState(0);
  
  // Stan do Modala
  const [openModal, setOpenModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [reason, setReason] = useState(""); // Stan na tekst formularza

  const { user } = useAuth();
  const theme = useTheme();

  const cardColors = [
    theme.palette.custom.cardOrange,
    theme.palette.custom.cardBlue,
    theme.palette.custom.cardGreen,
    theme.palette.custom.cardRed,
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [petsResponse, breedsResponse] = await Promise.all([
          PetService.getAll(),
          BreedService.getAll()
        ]);
        setPets(petsResponse.data);
        setBreeds(breedsResponse.data);
      } catch (error) {
        toast.error("Nie udało się pobrać danych.");
      }
    };
    loadData();
  }, []);

  // Otwieranie modala
  const handleOpenAdoptModal = (pet) => {
    if (!user) {
      toast.info("Zaloguj się, aby adoptować pieska!");
      return;
    }
    setSelectedPet(pet);
    setOpenModal(true);
  };

  // Zamykanie modala
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPet(null);
    setReason("");
  };

  // Wysłanie wniosku (API)
  const submitAdoption = async () => {
    if (!selectedPet || !user) return;

    try {
      // Uwaga: Backend na ten moment przyjmuje tylko userId i petId.
      // Pole "reason" jest tu dla UX, w przyszłości możesz dodać to pole w C#.
      await AdoptionService.create({ 
        userId: user.id, 
        petId: selectedPet.id 
      });
      
      toast.success(`Wniosek o adopcję ${selectedPet.name} wysłany! 🐶`);
      handleCloseModal();
    } catch (error) {
      toast.error("Błąd wysyłania prośby (może już złożyłeś wniosek?).");
    }
  };

  const filteredPets = selectedBreedId === 0
    ? pets 
    : pets.filter(pet => pet.breedId === selectedBreedId);

  return (
    <div>
      <HeroSection>
        <Typography variant="h3" style={{ color: '#2D3436', marginBottom: 10, fontWeight: 700 }}>
          Znajdź swojego Psa! 🐶
        </Typography>
        <Typography variant="h6" color="textSecondary" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Wierne psiaki czekają na nowy dom
        </Typography>
      </HeroSection>

      {/* Filtry */}
      <Box mb={4} display="flex" justifyContent="center" flexWrap="wrap" alignItems="center">
        <Typography variant="h6" style={{ marginRight: 15, fontWeight: 600, color: '#555' }}>
          Rasa:
        </Typography>
        <FilterButton active={selectedBreedId === 0 ? 1 : 0} onClick={() => setSelectedBreedId(0)}>
          Wszystkie
        </FilterButton>
        {breeds.map((breed) => (
          <FilterButton 
            key={breed.id} 
            active={selectedBreedId === breed.id ? 1 : 0} 
            onClick={() => setSelectedBreedId(breed.id)}
          >
            {breed.name}
          </FilterButton>
        ))}
      </Box>

      {/* Lista Zwierząt */}
      <Grid container spacing={4}>
        {filteredPets.map((pet, index) => {
          const bgColor = cardColors[index % cardColors.length];
          return (
            <Grid item key={pet.id} xs={12} sm={12} md={6} lg={4}>
              <StyledCard bgcolor={bgColor}>
                <ImageContainer>
                  <StyledMedia
                    image={pet.imageUrl || `https://placedog.net/600/400?id=${pet.id}`}
                    title={pet.name}
                  />
                  <Box position="absolute" top={10} right={10} bgcolor="rgba(255,255,255,0.95)" borderRadius={20} padding="4px 10px" display="flex" alignItems="center">
                     <PetsIcon style={{ color: '#4FD1C5', fontSize: 18, marginRight: 4 }} />
                     <Typography variant="caption" fontWeight="bold" color="textPrimary">Do wzięcia</Typography>
                  </Box>
                </ImageContainer>
                <ContentBox>
                  <PetName>{pet.name}</PetName>
                  <Typography variant="body2" style={{ opacity: 0.8, fontWeight: 500 }}>
                    {breeds.find(b => b.id === pet.breedId)?.name || 'Piesek'} • {pet.age} lat • {pet.color}
                  </Typography>
                </ContentBox>
                <CardActions style={{ padding: 0, marginTop: 'auto' }}>
                  <AdoptButton onClick={() => handleOpenAdoptModal(pet)}>
                    Przygarnij Psa
                  </AdoptButton>
                </CardActions>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>
      
      {/* --- MODAL ADOPCYJNY --- */}
      <StyledDialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.5rem', color: '#2D3436' }}>
          Adopcja: {selectedPet?.name} ❤️
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: 15, textAlign: 'center' }}>
            To wspaniała decyzja! Wypełnij poniższy formularz, abyśmy mogli się z Tobą skontaktować.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Dlaczego chcesz adoptować tego pieska?"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ backgroundColor: '#f9f9f9', borderRadius: 10 }}
          />
          <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 10 }}>
            * Nasz pracownik skontaktuje się z Tobą telefonicznie w ciągu 24h.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingBottom: 20 }}>
          <Button onClick={handleCloseModal} style={{ color: '#888', fontWeight: 'bold' }}>
            Anuluj
          </Button>
          <Button 
            onClick={submitAdoption} 
            variant="contained" 
            style={{ backgroundColor: '#4FD1C5', borderRadius: 20, padding: '10px 30px', fontWeight: 'bold' }}
          >
            Wyślij Wniosek 🐾
          </Button>
        </DialogActions>
      </StyledDialog>
    </div>
  );
};