import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdoptionService } from '../api/services';

// --- Styled Components ---
const PageContainer = styled(Box)(({ theme }) => ({
  fontFamily: "'Fredoka', sans-serif",
}));

const PageHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 700,
  color: '#2D3436',
  textAlign: 'center'
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 24,
  boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
  border: '2px solid #F0F0F0',
  overflow: 'hidden'
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#4FD1C5', // Morski nagłówek
  '& th': {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    fontFamily: "'Fredoka', sans-serif",
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FFF8E7', // Co drugi wiersz kremowy
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// --- Logika kolorów wg Twojego Enuma ---
const StyledChip = styled(Chip)(({ statuscode, theme }) => {
  let bgColor = '#E0E0E0';
  let textColor = '#555';

  // C# Enum: Accepted = 0
  if (statuscode === 0) { 
    bgColor = '#2ECC71'; // Zielony
    textColor = '#fff';
  } 
  // C# Enum: InProgress = 1
  else if (statuscode === 1) { 
    bgColor = '#FFC048'; // Żółty/Pomarańczowy
    textColor = '#fff';
  } 
  // C# Enum: Rejected = 2
  else if (statuscode === 2) { 
    bgColor = '#FF6B6B'; // Czerwony
    textColor = '#fff';
  }

  return {
    backgroundColor: bgColor,
    color: textColor,
    fontWeight: 'bold',
    borderRadius: 8,
    fontFamily: "'Fredoka', sans-serif",
  };
});

export const AdoptionRequestsPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await AdoptionService.getAll();
        setRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    if(!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  // --- MAPOWANIE NAZW WG TWOJEGO ENUMA ---
  const getStatusLabel = (status) => {
    switch(status) {
      case 0: return 'Zaakceptowany';       // Accepted
      case 1: return 'Weryfikacja';         // InProgress
      case 2: return 'Odrzucony';           // Rejected
      default: return 'Nieznany';
    }
  };

  return (
    <PageContainer>
      <PageHeader variant="h4">Wnioski Adopcyjne 📄</PageHeader>
      
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data zgłoszenia</TableCell>
              <TableCell>ID Zwierzaka</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Data rozpatrzenia</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {requests.map((row) => (
              <StyledTableRow key={row.id}>
                <TableCell style={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
                <TableCell>{formatDate(row.requestDate)}</TableCell>
                <TableCell>{row.petId}</TableCell>
                <TableCell align="center">
                  <StyledChip 
                    label={getStatusLabel(row.status)} 
                    statuscode={row.status} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                    {row.resolvedDate ? formatDate(row.resolvedDate) : '-'}
                </TableCell>
              </StyledTableRow>
            ))}
            
            {requests.length === 0 && (
               <TableRow>
                 <TableCell colSpan={5} align="center" style={{ padding: 20 }}>
                   Brak wniosków do wyświetlenia.
                 </TableCell>
               </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </PageContainer>
  );
};