import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import api from '../services/api';

const RunnerForm: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/runners', { name, age, number, email, category });
      navigate('/runners');
    } catch (error) {
      console.error('Błąd podczas dodawania zawodnika:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add new runner
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Age"
            type="number"
            variant="outlined"
            fullWidth
            value={age}
            onChange={(e) => setAge(e.target.value !== '' ? Number(e.target.value) : '')}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Phone number"
            variant="outlined"
            fullWidth
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Box>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
        >
          Add
        </Button>
      </form>
    </Container>
  );
};

export default RunnerForm;
