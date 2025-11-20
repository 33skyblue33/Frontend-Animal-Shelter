import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdoptionService } from '../api/services';

const PageHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
  let color = theme.palette.default;
  if (status === 1) color = theme.palette.success.main; // Zakładając enum: 0-Pending, 1-Approved, etc.
  if (status === 2) color = theme.palette.error.main;
  
  return {
    backgroundColor: color,
    color: '#fff',
    fontWeight: 'bold'
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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <PageHeader variant="h4">Wnioski Adopcyjne</PageHeader>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Wniosku</TableCell>
              <TableCell>Data zgłoszenia</TableCell>
              <TableCell>ID Zwierzaka</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data rozpatrzenia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{formatDate(row.requestDate)}</TableCell>
                <TableCell>{row.petId}</TableCell>
                <TableCell>
                   {/* Status jest zwracany jako enum/int z API, warto zmapować go na tekst */}
                  <StatusChip label={`Status: ${row.status}`} status={row.status} size="small" />
                </TableCell>
                <TableCell>
                    {row.resolvedDate ? formatDate(row.resolvedDate) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};