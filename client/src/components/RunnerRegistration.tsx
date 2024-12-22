import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { createRunner } from '../services/api.tsx';

const RunnerRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    category: '',
    number: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRunner({
        name: formData.name,
        age: Number(formData.age),
        category: formData.category,
        number: formData.number,
        email: formData.email,
        password: formData.password,
      });
      setMessage('Runner registered successfully');
      navigate('/runners');
    } catch (error) {
      console.error('Error during runner registration:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Register a new runner
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Age"
            name="age"
            type="number"
            variant="outlined"
            fullWidth
            value={formData.age}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Phone number"
            name="number"
            variant="outlined"
            fullWidth
            value={formData.number}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Category"
            name="category"
            variant="outlined"
            fullWidth
            value={formData.category}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
        {message && (
          <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </form>
    </Container>
  );
};

export default RunnerRegistrationForm;
