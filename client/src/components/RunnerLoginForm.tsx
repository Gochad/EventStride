import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginRunner } from '../services/api.tsx';


const RunnerLoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginRunner({
                email,
                password
            });

            navigate('/runners');
        } catch (error) {
            console.error('Error during runner registration:', error);
        }
    };

    return (
        <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
            Runner Login
            </Typography>
            <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
            />
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                Login
            </Button>
            </form>
            {error && (
            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {error}
            </Typography>
            )}
        </Box>
        </Container>
    );
};

export default RunnerLoginForm;
