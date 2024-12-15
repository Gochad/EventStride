import React, { useState, useEffect } from 'react';
import api from '../services/api.tsx';
import { RaceEvent } from '../types';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';

const RaceEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<RaceEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaceEvent = async () => {
      try {
        const response = await api.get(`/race_events/${id}`);
        setEvent(response.data);
        setError(null); // Clear any previous errors
      } catch (error: any) {
        console.error('Error fetching event:', error);
        setError(error.response?.data?.error || 'Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRaceEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          Event not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Event Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box mb={2}>
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1">{event.name || 'N/A'}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Date:</Typography>
          <Typography variant="body1">
            {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Distance:</Typography>
          <Typography variant="body1">{event.distance ? `${event.distance} km` : 'N/A'}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">City:</Typography>
          <Typography variant="body1">{event.location?.city || 'N/A'}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Country:</Typography>
          <Typography variant="body1">{event.location?.country || 'N/A'}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Route:</Typography>
          <Typography variant="body1">{event.track?.name || 'N/A'}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="h6">Track Difficulty Level:</Typography>
          <Typography variant="body1">{event.track?.difficulty_level || 'N/A'}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RaceEventDetail;
