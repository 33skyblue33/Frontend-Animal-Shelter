import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PetService, AdoptionService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// --- Styled Components ---
const PetCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const PetMedia = styled(CardMedia)({
  height: 200,
  backgroundColor: '#f0f0f0', // Placeholder color
});

const PetContent = styled(CardContent)({
  flexGrow: 1,
});

const PetAttributeChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

// --- Component ---
export const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const response = await PetService.getAll();
      setPets(response.data);
    } catch (error) {
      console.error("Failed to load pets", error);
    }
  };

  const handleAdopt = async (petId) => {
    if (!user) return;
    try {
      await AdoptionService.create({
        userId: user.id,
        petId: petId
      });
      toast.success("Wysłano prośbę o adopcję!");
    } catch (error) {
      toast.error("Błąd podczas wysyłania prośby.");
    }
  };

  return (
    <Grid container spacing={4}>
      {pets.map((pet) => (
        <Grid item key={pet.id} xs={12} sm={6} md={4}>
          <PetCard>
            <PetMedia
              image={pet.imageUrl || 'https://via.placeholder.com/200?text=No+Image'}
              title={pet.name}
            />
            <PetContent>
              <Typography gutterBottom variant="h5" component="h2">
                {pet.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {pet.description}
              </Typography>
              
              <div>
                <PetAttributeChip label={`Wiek: ${pet.age}`} size="small" />
                <PetAttributeChip label={`Kolor: ${pet.color}`} size="small" />
              </div>
            </PetContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => handleAdopt(pet.id)}>
                Adoptuj
              </Button>
            </CardActions>
          </PetCard>
        </Grid>
      ))}
    </Grid>
  );
};