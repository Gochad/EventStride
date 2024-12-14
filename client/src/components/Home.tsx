import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box mt={4} textAlign="center">
        <Box
          component="div"
          sx={{
            backgroundImage: `url('logo.png')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '150px',
            height: '150px',
            margin: '0 auto 20px',
          }}
        />
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Running Event App
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Track and manage running events effortlessly.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
