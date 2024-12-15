import React, { useState } from 'react';
import api from '../services/api.tsx';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Divider, 
  Alert 
} from '@mui/material';

const RaceEventForm: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [trackName, setTrackName] = useState('');
  const [trackDistance, setTrackDistance] = useState<number | ''>('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [fee, setFee] = useState<number | ''>('');
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');  
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post('/race_events', {
        name,
        date,
        distance,
        fee,
        max_participants: maxParticipants,
        location: {
          city,
          country,
        },
        track: {
          name: trackName,
          distance: trackDistance,
          difficulty_level: difficultyLevel,
        },
      });      
      navigate('/race_events');
    } catch (err: any) {
      console.error(err);
      setError('Failed to create the event. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Running Event
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Event Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Distance (km)"
            type="number"
            variant="outlined"
            fullWidth
            value={distance}
            onChange={(e) => setDistance(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </Box>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Location Info
        </Typography>

        <Box mb={2}>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Country"
            variant="outlined"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </Box>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Route
        </Typography>

        <Box mb={2}>
          <TextField
            label="Track Name"
            variant="outlined"
            fullWidth
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Track Distance (km)"
            type="number"
            variant="outlined"
            fullWidth
            value={trackDistance}
            onChange={(e) => setTrackDistance(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Difficulty Level"
            variant="outlined"
            fullWidth
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Fee (PLN)"
            type="number"
            variant="outlined"
            fullWidth
            value={fee}
            onChange={(e) => setFee(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Max Participants"
            type="number"
            variant="outlined"
            fullWidth
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Event
        </Button>
      </form>
    </Container>
  );
};

export default RaceEventForm;
