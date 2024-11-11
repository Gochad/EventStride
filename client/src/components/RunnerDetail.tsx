import React, { useState, useEffect } from 'react';
import api from '../services/api';

import { Runner } from '../types';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';

const RunnerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [runner, setRunner] = useState<Runner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRunner = async () => {
      try {
        const response = await api.get(`/runners/${id}`);
        setRunner(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRunner();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!runner) {
    return <Typography variant="h6" color="error">Runner not found</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Runner Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1">{runner.name}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Age:</Typography>
          <Typography variant="body1">{runner.age}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Category:</Typography>
          <Typography variant="body1">{runner.category}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RunnerDetail;
